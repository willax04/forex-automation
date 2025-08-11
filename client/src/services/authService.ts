import api from './api';

export const authService = {
  login: async (pin: string) => {
    const response = await api.post('/auth/login', { pin });
    return response.data;
  },

  changePin: async (newPin: string) => {
    const response = await api.post('/auth/change-pin', { newPin });
    return response.data;
  },
};
