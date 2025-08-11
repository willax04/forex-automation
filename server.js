const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pin_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Content table
  db.run(`CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    caption TEXT,
    media_url TEXT,
    media_type TEXT,
    category TEXT,
    tags TEXT,
    price REAL,
    is_scheduled BOOLEAN DEFAULT 0,
    scheduled_time DATETIME,
    post_history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Leads table
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    platform TEXT,
    username TEXT,
    status TEXT DEFAULT 'New Lead',
    notes TEXT,
    tags TEXT,
    last_contact DATETIME,
    follow_up_date DATETIME,
    phone TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Conversations table
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    platform TEXT,
    message TEXT,
    is_from_user BOOLEAN DEFAULT 0,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  )`);

  // Analytics table
  db.run(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER,
    platform TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    date DATE,
    FOREIGN KEY (content_id) REFERENCES content(id)
  )`);

  // Settings table
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert default user if none exists
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error(err);
    } else if (row.count === 0) {
      const defaultPin = '1234';
      const hashedPin = bcrypt.hashSync(defaultPin, 10);
      db.run("INSERT INTO users (pin_hash) VALUES (?)", [hashedPin], (err) => {
        if (err) {
          console.error('Error creating default user:', err);
        } else {
          console.log('Default user created with PIN: 1234');
        }
      });
    }
  });

  // Insert default settings
  const defaultSettings = [
    { key: 'theme', value: 'light' },
    { key: 'posting_interval', value: '15' },
    { key: 'notifications_enabled', value: 'true' }
  ];

  defaultSettings.forEach(setting => {
    db.run("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", 
      [setting.key, setting.value]);
  });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body;

  db.get("SELECT * FROM users LIMIT 1", (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(pin, user.pin_hash)) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id } });
  });
});

app.post('/api/auth/change-pin', authenticateToken, (req, res) => {
  const { newPin } = req.body;
  const hashedPin = bcrypt.hashSync(newPin, 10);

  db.run("UPDATE users SET pin_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", 
    [hashedPin, req.user.userId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'PIN updated successfully' });
    });
});

// Dashboard Routes
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Get stats for dashboard
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM content WHERE created_at >= ?) as posts_this_week,
      (SELECT COUNT(*) FROM conversations WHERE created_at >= ? AND is_from_user = 1) as replies_this_week,
      (SELECT COUNT(*) FROM leads WHERE status = 'Closed Sale' AND updated_at >= ?) as sales_this_week,
      (SELECT COUNT(*) FROM leads WHERE status NOT IN ('Closed Sale', 'Lost')) as active_leads,
      (SELECT COUNT(*) FROM conversations WHERE is_read = 0) as unread_messages
  `, [weekStartStr, weekStartStr, weekStartStr], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows[0] || {});
  });
});

// Content Routes
app.get('/api/content', authenticateToken, (req, res) => {
  const { category, search } = req.query;
  let query = "SELECT * FROM content WHERE 1=1";
  const params = [];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (search) {
    query += " AND (title LIKE ? OR caption LIKE ? OR tags LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/content', authenticateToken, upload.single('media'), (req, res) => {
  const { title, caption, category, tags, price } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const mediaType = req.file ? req.file.mimetype.split('/')[0] : null;

  db.run(`INSERT INTO content (title, caption, media_url, media_type, category, tags, price)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, caption, mediaUrl, mediaType, category, tags, price || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Content created successfully' });
    });
});

app.delete('/api/content/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // First get the media URL to delete the file
  db.get("SELECT media_url FROM content WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Delete the file if it exists
    if (row && row.media_url) {
      const filePath = path.join(__dirname, row.media_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from database
    db.run("DELETE FROM content WHERE id = ?", [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Content deleted successfully' });
    });
  });
});

// Schedule/Queue Routes
app.get('/api/schedule/queue', authenticateToken, (req, res) => {
  db.all("SELECT * FROM content WHERE is_scheduled = 1 ORDER BY scheduled_time ASC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/schedule/add', authenticateToken, (req, res) => {
  const { contentId, scheduledTime } = req.body;

  db.run("UPDATE content SET is_scheduled = 1, scheduled_time = ? WHERE id = ?",
    [scheduledTime, contentId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Content scheduled successfully' });
    });
});

app.post('/api/schedule/post-all', authenticateToken, (req, res) => {
  // This is a mock implementation - in reality, you'd integrate with social media APIs
  db.all("SELECT * FROM content WHERE is_scheduled = 1", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Simulate posting to social media platforms
    const postResults = rows.map(content => ({
      id: content.id,
      title: content.title,
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      status: 'posted',
      timestamp: new Date().toISOString()
    }));

    // Update content as posted
    const updatePromises = rows.map(content => {
      return new Promise((resolve, reject) => {
        const postHistory = JSON.stringify([
          ...(JSON.parse(content.post_history || '[]')),
          { date: new Date().toISOString(), platforms: ['Instagram', 'Facebook', 'Twitter'] }
        ]);

        db.run("UPDATE content SET is_scheduled = 0, scheduled_time = NULL, post_history = ? WHERE id = ?",
          [postHistory, content.id], (err) => {
            if (err) reject(err);
            else resolve();
          });
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        io.emit('posts_completed', { results: postResults });
        res.json({ 
          message: `Successfully posted ${rows.length} items`,
          results: postResults 
        });
      })
      .catch(() => {
        res.status(500).json({ error: 'Error updating post status' });
      });
  });
});

// Leads Routes
app.get('/api/leads', authenticateToken, (req, res) => {
  const { status, search } = req.query;
  let query = "SELECT * FROM leads WHERE 1=1";
  const params = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  if (search) {
    query += " AND (name LIKE ? OR username LIKE ? OR notes LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY updated_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/leads', authenticateToken, (req, res) => {
  const { name, platform, username, notes, tags, phone, email } = req.body;

  db.run(`INSERT INTO leads (name, platform, username, notes, tags, phone, email)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, platform, username, notes, tags, phone, email],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Lead created successfully' });
    });
});

app.put('/api/leads/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, platform, username, status, notes, tags, follow_up_date, phone, email } = req.body;

  db.run(`UPDATE leads SET 
          name = ?, platform = ?, username = ?, status = ?, notes = ?, 
          tags = ?, follow_up_date = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [name, platform, username, status, notes, tags, follow_up_date, phone, email, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Lead updated successfully' });
    });
});

// Conversations Routes
app.get('/api/conversations/:leadId', authenticateToken, (req, res) => {
  const { leadId } = req.params;

  db.all("SELECT * FROM conversations WHERE lead_id = ? ORDER BY created_at ASC", [leadId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/conversations', authenticateToken, (req, res) => {
  const { leadId, platform, message, isFromUser } = req.body;

  db.run(`INSERT INTO conversations (lead_id, platform, message, is_from_user)
          VALUES (?, ?, ?, ?)`,
    [leadId, platform, message, isFromUser ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Update last contact for lead
      db.run("UPDATE leads SET last_contact = CURRENT_TIMESTAMP WHERE id = ?", [leadId]);

      // Emit real-time update
      io.emit('new_message', {
        id: this.lastID,
        leadId,
        platform,
        message,
        isFromUser,
        timestamp: new Date().toISOString()
      });

      res.json({ id: this.lastID, message: 'Message added successfully' });
    });
});

// Analytics Routes
app.get('/api/analytics/overview', authenticateToken, (req, res) => {
  const { timeframe = '30' } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(timeframe));
  const startDateStr = startDate.toISOString().split('T')[0];

  db.all(`
    SELECT 
      DATE(date) as date,
      SUM(likes) as total_likes,
      SUM(comments) as total_comments,
      SUM(shares) as total_shares,
      SUM(reach) as total_reach
    FROM analytics 
    WHERE date >= ?
    GROUP BY DATE(date)
    ORDER BY date ASC
  `, [startDateStr], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Settings Routes
app.get('/api/settings', authenticateToken, (req, res) => {
  db.all("SELECT key, value FROM settings", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });
});

app.post('/api/settings', authenticateToken, (req, res) => {
  const { key, value } = req.body;

  db.run("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
    [key, value], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Setting updated successfully' });
    });
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
