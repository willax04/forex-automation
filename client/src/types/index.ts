export interface User {
  id: number;
}

export interface Content {
  id: number;
  title: string;
  caption: string;
  media_url?: string;
  media_type?: string;
  category: string;
  tags?: string;
  price?: number;
  is_scheduled: boolean;
  scheduled_time?: string;
  post_history?: string;
  created_at: string;
}

export interface Lead {
  id: number;
  name: string;
  platform: string;
  username: string;
  status: string;
  notes?: string;
  tags?: string;
  last_contact?: string;
  follow_up_date?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  lead_id: number;
  platform: string;
  message: string;
  is_from_user: boolean;
  is_read: boolean;
  created_at: string;
}

export interface Analytics {
  date: string;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_reach: number;
}

export interface DashboardStats {
  posts_this_week: number;
  replies_this_week: number;
  sales_this_week: number;
  active_leads: number;
  unread_messages: number;
}

export type LeadStatus = 
  | 'New Lead'
  | 'Warm Lead'
  | 'Negotiation'
  | 'Closed Sale'
  | 'Lost';
