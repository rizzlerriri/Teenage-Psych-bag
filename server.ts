
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const DB_FILE = path.join(process.cwd(), 'db.json');

// Initialize JSON database
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    posts: [],
    users: [],
    settings: {}
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

const getDb = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const saveDb = (data: any) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

app.use(express.json());

// Set up image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Middlewares
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const user = db.users.find((u: any) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username } });
});

// --- BLOG ROUTES ---
app.get('/api/posts', (req, res) => {
  const { category, search } = req.query;
  const db = getDb();
  let posts = [...db.posts];

  if (category) {
    posts = posts.filter((p: any) => p.category === category);
  }
  if (search) {
    const s = (search as string).toLowerCase();
    posts = posts.filter((p: any) => 
      p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s)
    );
  }

  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const db = getDb();
  const post = db.posts.find((p: any) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

app.post('/api/posts', authenticateToken, (req, res) => {
  const { title, content, excerpt, category, tags, featuredImage } = req.body;
  const db = getDb();
  const newPost = {
    id: Date.now(),
    title,
    content,
    excerpt: excerpt || content.substring(0, 150) + '...',
    category,
    tags,
    featuredImage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.posts.push(newPost);
  saveDb(db);
  res.json({ id: newPost.id });
});

app.put('/api/posts/:id', authenticateToken, (req, res) => {
  const { title, content, excerpt, category, tags, featuredImage } = req.body;
  const db = getDb();
  const index = db.posts.findIndex((p: any) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Post not found' });

  db.posts[index] = {
    ...db.posts[index],
    title,
    content,
    excerpt: excerpt || content.substring(0, 150) + '...',
    category,
    tags,
    featuredImage,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  res.json({ success: true });
});

app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  const db = getDb();
  db.posts = db.posts.filter((p: any) => p.id !== parseInt(req.params.id));
  saveDb(db);
  res.json({ success: true });
});

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ url: `/uploads/${req.file.filename}` });
});

// --- ADMIN USER BOOTSTRAP ---
function bootstrapAdmin() {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  const db = getDb();
  const existing = db.users.find((u: any) => u.username === adminUsername);
  if (!existing) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.users.push({ id: 1, username: adminUsername, password: hashedPassword });
    saveDb(db);
    console.log(`Admin user created: ${adminUsername}`);
  }
}
bootstrapAdmin();

// --- VITE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
