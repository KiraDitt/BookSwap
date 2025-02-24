const express = require('express');
const router = express.Router();
const axios = require('axios');

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// Route: Søger efter bøger via Google Books API
router.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Søgning mangler' });
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
            params: {
                q: query,
                key: GOOGLE_BOOKS_API_KEY,
                maxResults: 10, // Henter max 10 bøger
            },
        });

        // Filtrer de vigtigste bogdata
        const books = response.data.items.map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors || ['Ukendt forfatter'],
            thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
            description: book.volumeInfo.description || 'Ingen beskrivelse',
        }));

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Fejl ved hentning af bøger' });
    }
});

module.exports = router;
