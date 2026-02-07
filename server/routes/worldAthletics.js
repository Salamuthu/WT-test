const express = require('express');
const router = express.Router();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const SECRET_KEY = "your_secret_key";
    const jwt = require("jsonwebtoken");

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

const mongoose = require('mongoose');
const AthleteProfile = mongoose.model("AthleteProfile");

let puppeteer;
try {
    puppeteer = require('puppeteer-core');
} catch (e) {
    console.warn('puppeteer-core not installed.');
}

function getChromePath() {
    const platform = process.platform;

    if (platform === 'win32') {
        return [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
            process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
            process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
        ];
    } else if (platform === 'darwin') {
        return [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium'
        ];
    } else {
        return [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium'
        ];
    }
}

function findChrome() {
    const fs = require('fs');
    const paths = getChromePath();

    for (const path of paths) {
        try {
            if (fs.existsSync(path)) {
                console.log(`✅ Found Chrome at: ${path}`);
                return path;
            }
        } catch (e) {}
    }
    return null;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Scraper - ONLY Seasonal Bests
router.post('/world-athletics', authMiddleware, async (req, res) => {
    let browser;

    try {
        const { athleteCode } = req.body;

        if (!athleteCode) {
            return res.status(400).json({ error: 'Athlete code is required' });
        }

        if (!puppeteer) {
            return res.status(500).json({ error: 'puppeteer-core not installed' });
        }

        const chromePath = findChrome();
        if (!chromePath) {
            return res.status(500).json({ error: 'Chrome not found' });
        }

        console.log(`🔍 Fetching Seasonal Bests for: ${athleteCode}`);

        browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        const url = `https://worldathletics.org/athletes/_/${athleteCode}`;
        console.log(`📍 Navigating to: ${url}`);

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        console.log('✅ Page loaded');
        await delay(2000);

        // Get athlete name
        const athleteName = await page.evaluate(() => {
            const nameEl = document.querySelector('h1');
            return nameEl ? nameEl.textContent.trim() : '';
        });
        console.log(`👤 Athlete: ${athleteName}`);

        // Click STATISTICS tab
        console.log('📊 Clicking STATISTICS tab...');
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a, [role="tab"]'));
            const statsButton = buttons.find(btn =>
                btn.textContent.toUpperCase().includes('STATISTICS')
            );
            if (statsButton) statsButton.click();
        });
        await delay(3000);

        // Click "Season's bests" sub-tab
        console.log('📋 Clicking "Season\'s bests" sub-tab...');
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const sbButton = buttons.find(btn =>
                btn.textContent.toLowerCase().includes('season')
            );
            if (sbButton) sbButton.click();
        });
        await delay(2000);

        // Extract Seasonal Bests data
        const seasonalBests = await page.evaluate(() => {
            const data = [];
            const tables = document.querySelectorAll('table');

            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = Array.from(row.querySelectorAll('td')).map(td =>
                        td.textContent.trim().replace(/\s+/g, ' ')
                    );

                    if (cells.length >= 2 && cells[1]) {
                        // Skip header rows
                        if (cells[0].toLowerCase().includes('discipline') ||
                            cells[1].toLowerCase().includes('performance')) {
                            return;
                        }

                        data.push({
                            discipline: cells[0] || '',
                            performance: cells[1] || '',
                            wind: cells[2] || null,
                            date: cells[3] || '',
                            venue: cells[4] || '',
                            score: cells[5] || ''
                        });
                    }
                });
            });

            return data;
        });

        await browser.close();

        console.log(`\n✅ Extraction complete!`);
        console.log(`   Name: ${athleteName}`);
        console.log(`   Seasonal Bests: ${seasonalBests.length}`);

        seasonalBests.forEach((sb, i) => {
            console.log(`   ${i + 1}. ${sb.discipline}: ${sb.performance} (${sb.venue}, ${sb.date})`);
        });

        if (seasonalBests.length === 0) {
            return res.status(404).json({
                error: 'No seasonal bests found for this athlete.',
                hint: 'The athlete might not have competed this season yet.'
            });
        }

        const athleteData = {
            name: athleteName,
            seasonalBests: seasonalBests
        };

        // Update database
        const profile = await AthleteProfile.findOneAndUpdate(
            { userId: req.userId },
            {
                worldAthleticsCode: athleteCode,
                worldAthleticsData: athleteData,
            },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        console.log('✅ Profile updated successfully\n');

        res.json({
            success: true,
            profile,
            athleteData,
            message: `Successfully loaded ${seasonalBests.length} seasonal bests for ${athleteName}`
        });

    } catch (error) {
        if (browser) {
            await browser.close().catch(() => {});
        }

        console.error('❌ Error:', error.message);

        res.status(500).json({
            error: 'Failed to fetch athlete data.',
            details: error.message
        });
    }
});

// Clear data
router.post('/clear-world-athletics', authMiddleware, async (req, res) => {
    try {
        const profile = await AthleteProfile.findOneAndUpdate(
            { userId: req.userId },
            {
                worldAthleticsCode: null,
                worldAthleticsData: null
            },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        console.log('✅ Data cleared');

        res.json({
            success: true,
            message: 'Data cleared successfully',
            profile
        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to clear data'
        });
    }
});

module.exports = router;