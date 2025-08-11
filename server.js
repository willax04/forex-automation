const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Initialize SQLite database
const db = new sqlite3.Database('app.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pin TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Content table
  db.run(`CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    caption TEXT,
    hashtags TEXT,
    category TEXT DEFAULT 'general',
    price TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_at DATETIME,
    scheduled_for DATETIME
  )`);

  // Leads table
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT,
    tags TEXT,
    last_contact DATETIME DEFAULT CURRENT_TIMESTAMP,
    follow_up_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Conversations table
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    platform TEXT NOT NULL,
    message TEXT NOT NULL,
    sender TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  )`);

  // Analytics table
  db.run(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER,
    platform TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(id)
  )`);

  // Settings table
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert default user with PIN 1234
  db.run(`INSERT OR IGNORE INTO users (pin) VALUES (?)`, ['$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi']); // bcrypt hash of '1234'
  
  // Insert default settings
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['theme', 'system']);
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, ['notifications', 'true']);
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body;

  db.get('SELECT * FROM users WHERE id = 1', (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(pin, user.pin)) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id } });
  });
});

// Content routes
app.get('/api/content', authenticateToken, (req, res) => {
  const { category, scheduled } = req.query;
  let query = 'SELECT * FROM content';
  let params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (scheduled === 'true') {
    query += (params.length > 0 ? ' AND' : ' WHERE') + ' scheduled_for IS NOT NULL AND posted_at IS NULL';
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, content) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(content);
  });
});

app.post('/api/content/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { caption = '', hashtags = '', category = 'general', price = '', tags = '' } = req.body;

  db.run(
    'INSERT INTO content (filename, original_name, caption, hashtags, category, price, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.file.filename, req.file.originalname, caption, hashtags, category, price, tags],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      const newContent = {
        id: this.lastID,
        filename: req.file.filename,
        original_name: req.file.originalname,
        caption,
        hashtags,
        category,
        price,
        tags,
        created_at: new Date().toISOString()
      };

      io.emit('contentUploaded', newContent);
      res.json(newContent);
    }
  );
});

app.post('/api/content/:id/schedule', authenticateToken, (req, res) => {
  const { scheduled_for } = req.body;
  const contentId = req.params.id;

  db.run(
    'UPDATE content SET scheduled_for = ? WHERE id = ?',
    [scheduled_for, contentId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      io.emit('contentScheduled', { id: contentId, scheduled_for });
      res.json({ success: true });
    }
  );
});

app.post('/api/content/post-all', authenticateToken, (req, res) => {
  const now = new Date().toISOString();
  
  db.run(
    'UPDATE content SET posted_at = ? WHERE scheduled_for IS NOT NULL AND posted_at IS NULL',
    [now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      io.emit('contentPosted', { count: this.changes });
      res.json({ success: true, count: this.changes });
    }
  );
});

// Leads routes
app.get('/api/leads', authenticateToken, (req, res) => {
  db.all('SELECT * FROM leads ORDER BY created_at DESC', (err, leads) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(leads);
  });
});

app.post('/api/leads', authenticateToken, (req, res) => {
  const { name, contact, status = 'new', notes = '', tags = '' } = req.body;

  db.run(
    'INSERT INTO leads (name, contact, status, notes, tags) VALUES (?, ?, ?, ?, ?)',
    [name, contact, status, notes, tags],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      const newLead = {
        id: this.lastID,
        name,
        contact,
        status,
        notes,
        tags,
        last_contact: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      io.emit('leadAdded', newLead);
      res.json(newLead);
    }
  );
});

app.put('/api/leads/:id', authenticateToken, (req, res) => {
  const { name, contact, status, notes, tags, follow_up_date } = req.body;
  const leadId = req.params.id;

  db.run(
    'UPDATE leads SET name = ?, contact = ?, status = ?, notes = ?, tags = ?, follow_up_date = ?, last_contact = CURRENT_TIMESTAMP WHERE id = ?',
    [name, contact, status, notes, tags, follow_up_date, leadId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      io.emit('leadUpdated', { id: leadId, ...req.body });
      res.json({ success: true });
    }
  );
});

// Conversations routes
app.get('/api/conversations', authenticateToken, (req, res) => {
  const query = `
    SELECT c.*, l.name as lead_name, l.contact as lead_contact 
    FROM conversations c 
    LEFT JOIN leads l ON c.lead_id = l.id 
    ORDER BY c.created_at DESC
  `;

  db.all(query, (err, conversations) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(conversations);
  });
});

app.post('/api/conversations', authenticateToken, (req, res) => {
  const { lead_id, platform, message, sender } = req.body;

  db.run(
    'INSERT INTO conversations (lead_id, platform, message, sender) VALUES (?, ?, ?, ?)',
    [lead_id, platform, message, sender],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      const newConversation = {
        id: this.lastID,
        lead_id,
        platform,
        message,
        sender,
        is_read: false,
        created_at: new Date().toISOString()
      };

      io.emit('newMessage', newConversation);
      res.json(newConversation);
    }
  );
});

// Analytics routes
app.get('/api/analytics', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      c.id as content_id,
      c.original_name,
      c.category,
      c.posted_at,
      SUM(a.likes) as total_likes,
      SUM(a.comments) as total_comments,
      SUM(a.shares) as total_shares,
      SUM(a.saves) as total_saves,
      SUM(a.reach) as total_reach
    FROM content c
    LEFT JOIN analytics a ON c.id = a.content_id
    WHERE c.posted_at IS NOT NULL
    GROUP BY c.id
    ORDER BY c.posted_at DESC
  `;

  db.all(query, (err, analytics) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(analytics);
  });
});

// Settings routes
app.get('/api/settings', authenticateToken, (req, res) => {
  db.all('SELECT * FROM settings', (err, settings) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    res.json(settingsObj);
  });
});

app.put('/api/settings/:key', authenticateToken, (req, res) => {
  const { value } = req.body;
  const key = req.params.key;

  db.run(
    'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
    [key, value],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      io.emit('settingUpdated', { key, value });
      res.json({ success: true });
    }
  );
});

// Change PIN
app.post('/api/auth/change-pin', authenticateToken, (req, res) => {
  const { currentPin, newPin } = req.body;

  db.get('SELECT * FROM users WHERE id = 1', (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!bcrypt.compareSync(currentPin, user.pin)) {
      return res.status(401).json({ error: 'Invalid current PIN' });
    }

    const hashedNewPin = bcrypt.hashSync(newPin, 10);
    
    db.run('UPDATE users SET pin = ? WHERE id = 1', [hashedNewPin], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true });
    });
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {};
  
  // Get posts this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  db.get(
    'SELECT COUNT(*) as count FROM content WHERE posted_at > ?',
    [weekAgo.toISOString()],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.postsThisWeek = result.count;
      
      // Get unread conversations
      db.get('SELECT COUNT(*) as count FROM conversations WHERE is_read = FALSE', (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.unreadMessages = result.count;
        
        // Get leads this month
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        db.get(
          'SELECT COUNT(*) as count FROM leads WHERE created_at > ?',
          [monthAgo.toISOString()],
          (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            stats.newLeadsThisMonth = result.count;
            
            // Get scheduled content count
            db.get(
              'SELECT COUNT(*) as count FROM content WHERE scheduled_for IS NOT NULL AND posted_at IS NULL',
              (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                stats.scheduledPosts = result.count;
                
                res.json(stats);
              }
            );
          }
        );
      });
    }
  );
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
