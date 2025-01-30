const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

const allowedCategories = [
    "action", "gore", "rpg", "violent", "adventure", "horror", "simulation", "vr", 
    "casual", "indie", "sports", "nostalgia-games", "early-access", "racing", "strategy"
];

// Fungsi untuk scraping daftar game berdasarkan halaman
const scrapeGames = async (page = 1) => {
    try {
        const url = `https://game3rb.com/page/${page}/`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let games = [];

        $('article.post-hentry').each((index, element) => {
            const title = $(element).find('h3.entry-title a').text().trim();
            const link = $(element).find('h3.entry-title a').attr('href');
            const image = $(element).find('.entry-image').attr('src');
            const categories = $(element).find('.entry-category').map((i, el) => $(el).text()).get();
            const releaseDate = $(element).find('time.entry-date').attr('datetime');
            const slug = link ? link.replace('https://game3rb.com/', '').replace(/\/$/, '') : '';
            games.push({ title, slug, link, image, categories, releaseDate });
        });
        return games;
    } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
        return [];
    }
};

// Fungsi untuk scraping daftar game berdasarkan pencarian
const searchGames = async (query, page = 1) => {
    try {
        const url = `https://game3rb.com/?s=${encodeURIComponent(query)}&paged=${page}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let games = [];

        $('article.post-hentry').each((index, element) => {
            const title = $(element).find('h3.entry-title a').text().trim();
            const link = $(element).find('h3.entry-title a').attr('href');
            const image = $(element).find('.entry-image').attr('src');
            const categories = $(element).find('.entry-category').map((i, el) => $(el).text()).get();
            const releaseDate = $(element).find('time.entry-date').attr('datetime');
            const slug = link ? link.replace('https://game3rb.com/', '').replace(/\/$/, '') : '';
            games.push({ title, slug, link, image, categories, releaseDate });
        });
        return games;
    } catch (error) {
        console.error(`Error searching for "${query}":`, error.message);
        return [];
    }
};


const scrapeCategoryGames = async (category, page = 1) => {
    if (!allowedCategories.includes(category)) {
        return { error: "Invalid category" };
    }
    try {
        const url = `https://game3rb.com/category/pc-games/${category}/page/${page}/`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let games = [];

        $('article.post-hentry').each((index, element) => {
            const title = $(element).find('h3.entry-title a').text().trim();
            const link = $(element).find('h3.entry-title a').attr('href');
            const image = $(element).find('.entry-image').attr('src');
            const categories = $(element).find('.entry-category').map((i, el) => $(el).text()).get();
            const releaseDate = $(element).find('time.entry-date').attr('datetime');
            const slug = link ? link.replace('https://game3rb.com/', '').replace(/\/$/, '') : '';
            games.push({ title, slug, link, image, categories, releaseDate });
        });
        return games;
    } catch (error) {
        console.error(`Error fetching category ${category} page ${page}:`, error.message);
        return [];
    }
};

const scrapeOnlineGames = async (page = 1) => {
    try {
        const url = `https://game3rb.com/category/games-online/page/${page}/`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let games = [];

        $('article.post-hentry').each((index, element) => {
            const title = $(element).find('h3.entry-title a').text().trim();
            const link = $(element).find('h3.entry-title a').attr('href');
            const image = $(element).find('.entry-image').attr('src');
            const categories = $(element).find('.entry-category').map((i, el) => $(el).text()).get();
            const releaseDate = $(element).find('time.entry-date').attr('datetime');
            const slug = link ? link.replace('https://game3rb.com/', '').replace(/\/$/, '') : '';
            games.push({ title, slug, link, image, categories, releaseDate });
        });
        return games;
    } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
        return [];
    }
};

const UpdateGame = async (page = 1) => {
    try {
        const url = `https://game3rb.com/category/game-updates/page/${page}/`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let games = [];

        $('article.post-hentry').each((index, element) => {
            const title = $(element).find('h3.entry-title a').text().trim();
            const link = $(element).find('h3.entry-title a').attr('href');
            const image = $(element).find('.entry-image').attr('src');
            const categories = $(element).find('.entry-category').map((i, el) => $(el).text()).get();
            const releaseDate = $(element).find('time.entry-date').attr('datetime');
            const slug = link ? link.replace('https://game3rb.com/', '').replace(/\/$/, '') : '';
            games.push({ title, slug, link, image, categories, releaseDate });
        });
        return games;
    } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
        return [];
    }
};




// Fungsi untuk scraping detail game berdasarkan slug
const scrapeGameDetails = async (gameSlug) => {
    try {
        const gameUrl = `https://game3rb.com/${gameSlug}/`;
        const { data } = await axios.get(gameUrl);
        const $ = cheerio.load(data);

        const title = $('h1.entry-title').text().trim();
        const image = $('.entry-content img').first().attr('src');
        const releaseDate = $('p:contains("RELEASE DATE")').text().replace('RELEASE DATE:', '').trim();
        const developer = $('p:contains("DEVELOPER")').text().replace('DEVELOPER:', '').trim();
        const publisher = $('p:contains("PUBLISHER")').text().replace('PUBLISHER:', '').trim();
        const genre = $('p:contains("GENRE")').text().replace('GENRE:', '').trim();
        const reviews = $('p:contains("ALL REVIEWS")').text().replace('ALL REVIEWS:', '').trim();
        const description = $('.game_description_snippet').text().trim();
        
        let systemRequirements = [];
        $('h3:contains("System Requirements")').next('ul').find('li').each((i, el) => {
            systemRequirements.push($(el).text().trim());
        });
        
        let screenshots = [];
        $('.slideshow-container .mySlides img').each((i, el) => {
            const src = $(el).attr('src');
            if (src) screenshots.push(src);
        });

        const trailer = $('video source').attr('src');
        
        // Mengambil semua link download
        let downloadLinks = [];
        $('a#download-link').each((i, el) => {
            downloadLinks.push({
                text: $(el).text().trim(),
                href: $(el).attr('href')
            });
        });
        
        // Mengambil panduan instalasi
        let installationGuide = [];
        $('h3:contains("Game Installation Guide")').nextUntil('h3').each((i, el) => {
            installationGuide.push($(el).text().trim());
        });
        
        // Mengambil mode permainan (Multiplayer, Co-op, dll.)
        let gameModes = [];
        $('p:contains("Modes") span').each((i, el) => {
            gameModes.push($(el).text().trim());
        });
        
        return {
            title,
            image,
            releaseDate,
            developer,
            publisher,
            genre,
            reviews,
            description,
            systemRequirements,
            screenshots,
            trailer,
            downloadLinks,
            installationGuide,
            gameModes,
        };
    } catch (error) {
        console.error(`Error fetching game details for ${gameSlug}:`, error.message);
        return { error: 'Failed to fetch game details' };
    }
};

// Endpoint
app.get('/download', async (req, res) => {
    const gameSlug = req.query.slug;
    if (!gameSlug) return res.status(400).json({ error: 'Game slug is required' });
    res.json(await scrapeGameDetails(gameSlug));
});

app.get('/category', async (req, res) => {
    const category = req.query.category;
    const page = Number(req.query.page) || 1;
    if (!category) return res.status(400).json({ error: 'Category parameter is required' });
    res.json(await scrapeCategoryGames(category, page));
});

app.get('/onlinegame', async (req, res) => {
    res.json(await scrapeOnlineGames(Number(req.query.page) || 1));
});

app.get('/updategame', async (req, res) => {
    res.json(await UpdateGame(Number(req.query.page) || 1));
});

app.get('/games', async (req, res) => {
    res.json(await scrapeGames(Number(req.query.page) || 1));
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });
    res.json(await searchGames(query, Number(req.query.page) || 1));
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
