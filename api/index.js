require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const Post = require('./models/Post');

const app = express();

// Configuration for multer (for handling file uploads)
const uploadMiddleware = multer({ dest: 'uploads/' });

const salt = bcrypt.genSaltSync(10);
const secret = 'jdxwejkjdkewdded';

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your allowed origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and credentials to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json('ok');
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
    res.json(req.cookies);
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.get('/api/post', async (req, res) => {
    const posts = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(posts);
});

app.post('/api/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
});

app.put('/api/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });

        res.json(postDoc);
    });
});

app.get('/api/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

async function main() {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

main().catch(console.error);

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
