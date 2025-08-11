import axios from 'axios';
import { User, Content, Lead, Conversation, Analytics, DashboardStats, Settings } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (pin: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', { pin });
    return response.data;
  },
  
  changePin: async (currentPin: string, newPin: string): Promise<void> => {
    await api.post('/auth/change-pin', { currentPin, newPin });
  }
};

// Content API
export const contentAPI = {
  getAll: async (category?: string, scheduled?: boolean): Promise<Content[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (scheduled) params.append('scheduled', 'true');
    
    const response = await api.get(`/content?${params}`);
    return response.data;
  },
  
  upload: async (file: File, data: Partial<Content>): Promise<Content> => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    const response = await api.post('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  schedule: async (contentId: number, scheduledFor: string): Promise<void> => {
    await api.post(`/content/${contentId}/schedule`, { scheduled_for: scheduledFor });
  },
  
  postAll: async (): Promise<{ success: boolean; count: number }> => {
    const response = await api.post('/content/post-all');
    return response.data;
  }
};

// Leads API
export const leadsAPI = {
  getAll: async (): Promise<Lead[]> => {
    const response = await api.get('/leads');
    return response.data;
  },
  
  create: async (lead: Omit<Lead, 'id' | 'created_at' | 'last_contact'>): Promise<Lead> => {
    const response = await api.post('/leads', lead);
    return response.data;
  },
  
  update: async (leadId: number, lead: Partial<Lead>): Promise<void> => {
    await api.put(`/leads/${leadId}`, lead);
  }
};

// Conversations API
export const conversationsAPI = {
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations');
    return response.data;
  },
  
  create: async (conversation: Omit<Conversation, 'id' | 'created_at' | 'is_read'>): Promise<Conversation> => {
    const response = await api.post('/conversations', conversation);
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getAll: async (): Promise<Analytics[]> => {
    const response = await api.get('/analytics');
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  getAll: async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data;
  },
  
  update: async (key: string, value: string): Promise<void> => {
    await api.put(`/settings/${key}`, { value });
  }
};

export default api;
