export interface User {
  id: number;
}

export interface Content {
  id: number;
  filename: string;
  original_name: string;
  caption: string;
  hashtags: string;
  category: string;
  price?: string;
  tags?: string;
  created_at: string;
  posted_at?: string;
  scheduled_for?: string;
}

export interface Lead {
  id: number;
  name: string;
  contact?: string;
  status: string;
  notes?: string;
  tags?: string;
  last_contact: string;
  follow_up_date?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  lead_id?: number;
  platform: string;
  message: string;
  sender: string;
  is_read: boolean;
  created_at: string;
  lead_name?: string;
  lead_contact?: string;
}

export interface Analytics {
  content_id: number;
  original_name: string;
  category: string;
  posted_at: string;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_saves: number;
  total_reach: number;
}

export interface DashboardStats {
  postsThisWeek: number;
  unreadMessages: number;
  newLeadsThisMonth: number;
  scheduledPosts: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: string;
}

export interface AuthContextType {
  user: User | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isDarkMode: boolean;
}
