const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware - Render-де фронтенд қосылуы үшін CORS-ты ашық қалдырамыз
app.use(cors());
app.use(express.json());

// PostgreSQL-ге қосылу (Render-ге арналған SSL баптауымен)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Токенді тексеру (Middleware)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Токен табылмады" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Токен жарамсыз" });
        req.user = user;
        next();
    });
}

// Байланысты тексеру
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Базаға қосылу қатесі:', err.stack);
    }
    console.log('PostgreSQL базасына сәтті қосылды! ✅');
    release();
});

// --- АВТОРИЗАЦИЯ ---

app.post('/api/register', async (req, res) => { 
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, 'USER']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Тіркелу сәтсіз аяқталды." });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Рольді де токенге қосамыз
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '24h' }
                );
                const { password: _, ...userData } = user;
                res.json({ ...userData, token }); 
            } else {
                res.status(401).json({ error: "Пароль қате!" });
            }
        } else {
            res.status(401).json({ error: "Мұндай email тіркелмеген!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Сервер қатесі" });
    }
});

// --- КІТАПТАРМЕН ЖҰМЫС ---

// КІТАП ҚОСУ (Админ панель үшін - ОСЫ ЖОҚ БОЛАТЫН)
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, year, description, genre, price, image_url, summary, stock } = req.body;
        const query = `
            INSERT INTO books (title, author, year, description, genre, price, image_url, summary, stock)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`;
        const values = [title, author, year, description, genre, price, image_url, summary, stock || 10];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Кітап қосу қатесі:", err.message);
        res.status(500).json({ error: "Кітапты базаға сақтау мүмкін болмады." });
    }
});

// КІТАПТЫ ӨШІРУ (Админ үшін)
app.delete('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM books WHERE id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: "Кітап табылмады" });
        res.json({ message: "Кітап сәтті өшірілді" });
    } catch (err) {
        res.status(500).json({ error: "Өшіру кезінде қате шықты" });
    }
});

app.put('/api/user/update/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        // Деректер қорындағы "name" бағанын жаңарту
        const result = await pool.query(
            "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email",
            [username, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Пайдаланушы табылмады" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Жаңарту қатесі:", err.message);
        res.status(500).json({ error: "Деректерді жаңарту сәтсіз аяқталды" });
    }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Кітап табылмады" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Серверде қате шықты" });
    }
});

app.get('/api/books', async (req, res) => {
    try {
        const { search, genre, sort } = req.query;
        let query = `SELECT * FROM books WHERE 1=1`; 
        let params = [];
        if (search) {
            params.push(`%${search}%`);
            query += ` AND (title ILIKE $${params.length} OR author ILIKE $${params.length})`;
        }
        if (genre && genre !== 'Барлығы') {
            params.push(genre);
            query += ` AND genre = $${params.length}`;
        }
        
        if (sort === 'cheap') query += " ORDER BY price ASC";
        else if (sort === 'expensive') query += " ORDER BY price DESC";
        else if (sort === 'year_new') query += " ORDER BY year DESC";
        else query += " ORDER BY id DESC";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Серверде қате шықты" });
    }
});

// --- ТАПСЫРЫСТАР ---

app.post('/api/orders', async (req, res) => {
    const client = await pool.connect();
    try {
        const { items, address, details, totalPrice, paymentMethod, userId } = req.body;
        await client.query('BEGIN');
        const orderQuery = `INSERT INTO orders (items, address, details, total_price, payment_method, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const orderValues = [JSON.stringify(items), address, JSON.stringify(details), totalPrice, paymentMethod, userId];
        const orderResult = await client.query(orderQuery, orderValues);

        for (const item of items) {
            const updateResult = await client.query(`UPDATE books SET stock = stock - $1 WHERE id = $2 AND stock >= $1`, [item.quantity, item.id]);
            if (updateResult.rowCount === 0) throw new Error(`Кітап жеткіліксіз: ${item.title}`);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: "Тапсырыс сәтті сақталды!", order: orderResult.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

app.get('/api/my-orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(`SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC`, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Тапсырыстарды алу мүмкін болмады" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер ${PORT} портында қосылды 🚀`);
});