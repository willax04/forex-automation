# Social Media Automation & Lead Management App

A comprehensive mobile-first web application for managing social media content, scheduling posts, and tracking leads across multiple platforms.

## 🚀 Features

### 🔐 Security
- **PIN Authentication**: Secure 4-6 digit PIN login screen
- **Theme Support**: Dark/Light mode with system preference detection

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices
- **Touch-Friendly UI**: Large buttons and intuitive navigation
- **Progressive Web App**: Can be installed on mobile devices

### 📊 Content Management
- **Content Bank**: Upload and organize photos, videos, and captions
- **Smart Categorization**: Organize content by type (Promo, Tips, Engagement, etc.)
- **Batch Operations**: Select and manage multiple content items

### ⏰ Scheduling & Posting
- **One-Button Blast**: Post all scheduled content instantly
- **Staggered Posting**: Space out posts automatically
- **Multi-Platform Support**: Instagram, Facebook, Twitter, TikTok, LinkedIn

### 💬 Lead Management
- **Unified Inbox**: All social media conversations in one place
- **Lead Pipeline**: Visual sales pipeline with drag-and-drop
- **Smart Tags**: Organize leads by status and priority
- **Follow-up Reminders**: Never miss important conversations

### 📈 Analytics & Insights
- **Engagement Tracking**: Likes, comments, shares, and reach metrics
- **Performance Reports**: Weekly and monthly summaries
- **Top Content**: Identify your best-performing posts

## 🛠️ Technology Stack

- **Backend**: Node.js, Express, SQLite, Socket.io
- **Frontend**: React, TypeScript, Tailwind CSS
- **Authentication**: JWT with PIN-based security
- **Real-time**: WebSocket connections for live updates
- **File Handling**: Multer for media uploads

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd social-media-automation-app
   npm install
   cd client && npm install
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```
   This starts both the backend (port 5000) and frontend (port 3000)

3. **Access the app:**
   - Open http://localhost:3000 in your browser
   - Default PIN: **1234**

## 📱 Usage

### First Launch
1. Enter your PIN (default: 1234) on the security screen
2. Explore the dashboard to see your progress overview
3. Upload content in the Content Bank
4. Schedule posts in the Content Scheduler
5. Monitor conversations and manage leads

### Key Workflows

#### Content Creation & Scheduling
1. **Upload Content** → Content Bank → Add Content
2. **Schedule Posts** → Content Scheduler → Add to Queue
3. **Post Content** → Dashboard → One Button Blast

#### Lead Management
1. **View Messages** → Conversations → Review unread messages
2. **Manage Leads** → Lead Pipeline → Update lead status
3. **Set Reminders** → Lead details → Follow-up dates

## 🎨 Design System

### Color Palette
- **Brand Blue**: #003366 (Primary text, headers)
- **Brand Teal**: #00B4A6 (Accent color, buttons)
- **Soft White**: #F9FAFB (Light mode background)
- **Dark Blue**: #001F33 to #004D66 (Dark mode gradient)

### Typography
- **Font**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Mobile-first**: Responsive typography scaling

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Changing Default PIN
1. Launch the app and login with PIN: 1234
2. Go to Settings → Security → Change PIN
3. Enter your new 4-6 digit PIN

## 📊 Database Schema

The app uses SQLite with the following tables:
- `users`: Authentication and user data
- `content`: Media files and post information
- `leads`: Contact information and pipeline status
- `conversations`: Message history and communication
- `analytics`: Post performance metrics
- `settings`: App configuration

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - PIN authentication
- `POST /api/auth/change-pin` - Update PIN

### Content Management
- `GET /api/content` - Fetch content library
- `POST /api/content` - Upload new content
- `DELETE /api/content/:id` - Remove content

### Scheduling
- `GET /api/schedule/queue` - Get scheduled posts
- `POST /api/schedule/add` - Add to posting queue
- `POST /api/schedule/post-all` - Execute batch posting

### Leads & Conversations
- `GET /api/leads` - Fetch leads database
- `POST /api/conversations` - Add new conversation
- `GET /api/conversations/:leadId` - Get conversation history

## 🚧 Roadmap

### Phase 2: AI Features
- [ ] AI-powered caption generation
- [ ] Hashtag recommendations
- [ ] Content repurposing suggestions
- [ ] Optimal posting time predictions

### Phase 3: Social Media Integration
- [ ] Instagram Graph API integration
- [ ] Facebook Business API
- [ ] Twitter API v2
- [ ] TikTok Business API
- [ ] LinkedIn API

### Phase 4: Advanced Analytics
- [ ] Advanced engagement analytics
- [ ] Competitor analysis
- [ ] ROI tracking
- [ ] Custom reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@socialmediaapp.com or create an issue in the repository.

---

**Built with ❤️ for entrepreneurs and social media managers who want to grow their business efficiently.**
