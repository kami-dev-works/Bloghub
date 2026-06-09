import axios from 'axios';
  const apiBase = import.meta.env.API_URL || 'http://localhost:5000';
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return '';
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}

export const blogApi = {
  getAll: (params) => api.get('/blogs', { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getByShortId: (shortId) => api.get(`/blogs/short/${shortId}`),
  getTop: () => api.get('/blogs/top'),
  getRecent: () => api.get('/blogs/recent'),
  getLocal: (location) => api.get('/blogs/local', { params: { location } }),
  getPending: (params) => api.get('/blogs/pending', { params }),
  getMySubmissions: () => api.get('/blogs/my-submissions'),
  create: (data) => api.post('/blogs', data),
  submit: (data) => api.post('/blogs/submit', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  updateStats: (id, data) => api.put(`/blogs/${id}/stats`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  approve: (id) => api.put(`/blogs/approve/${id}`),
  reject: (id) => api.put(`/blogs/reject/${id}`),
  like: (id) => api.post(`/blogs/${id}/like`),
  rate: (id, rating) => api.post(`/blogs/${id}/rate`, { rating }),
  getTRP: () => api.get('/blogs/trp'),
  getSitemap: () => api.get('/api/sitemap.xml', { responseType: 'text' }),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getAll: (params) => api.get('/users', { params }),
  getAllWithPasswords: (params) => api.get('/users/with-passwords', { params }),
  getStats: () => api.get('/users/stats'),
  updateProfile: (data) => api.put('/users/profile', data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, password) => api.put(`/users/${id}/password`, { password }),
  getLiked: () => api.get('/users/liked'),
  likeBlog: (blogId) => api.post(`/users/like/${blogId}`),
};

export const uploadApi = {
  
  uploadProfile: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBlogImageNew: async ({fileContant,fileName}) => {

    try {
      console.log("test");
    
    const formData = new FormData();
    formData.append('image', fileContant, fileName);
    return api.post('/upload/blog-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    } catch (error) {
      console.log(error);
      
    }
  },
  uploadBlogImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/blog-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBlogImageBase64: async (base64Image) => {
    return api.post('/upload/blog-image/base64', { image: base64Image });
  },
  uploadSiteAsset: async (formData, folder) => {
    return api.post(`/upload/site-asset?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const commentApi = {
  getByBlog: (blogId) => api.get(`/comments/${blogId}`),
  create: (blogId, content) => api.post(`/comments/${blogId}`, { content }),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const feedbackApi = {
  submit: (data) => api.post('/feedback', data),
};

export const serviceApi = {
  getAll: (params) => api.get('/services', { params }),
  getTop: (limit) => api.get('/services/top', { params: { limit } }),
  getById: (id) => api.get(`/services/${id}`),
  getBySlug: (slug) => api.get(`/services/slug/${slug}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  like: (id) => api.post(`/services/${id}/like`),
  rate: (id, rating) => api.post(`/services/${id}/rate`, { rating }),
  updateStats: (id, data) => api.put(`/services/${id}/stats`, data),
};

export const serviceCategoryApi = {
  getAll: () => api.get('/service-categories'),
  create: (data) => api.post('/service-categories', data),
  delete: (id) => api.delete(`/service-categories/${id}`),
};

export const notificationApi = {
  get: () => api.get('/notifications'),
  update: ({ text, textHi }) => api.put('/notifications', { text, textHi }),
};

export const adsApi = {
  getAll: () => api.get('/ads'),
  getAllAdmin: () => api.get('/ads/all'),
  create: (data) => api.post('/ads', data),
  delete: (id) => api.delete(`/ads/${id}`),
  click: (id) => api.post(`/ads/${id}/click`),
};

export const websiteSettingApi = {
  get: () => api.get('/website-settings'),
  update: (data) => api.put('/website-settings', data),
};

export const sliderApi = {
  get: () => api.get('/sliders'),
  getAll: () => api.get('/sliders/all'),
  create: (data) => api.post('/sliders', data),
  update: (id, data) => api.put(`/sliders/${id}`, data),
  delete: (id) => api.delete(`/sliders/${id}`),
  addItem: (id, data) => api.post(`/sliders/${id}/items`, data),
  updateItem: (id, itemId, data) => api.put(`/sliders/${id}/items/${itemId}`, data),
  deleteItem: (id, itemId) => api.delete(`/sliders/${id}/items/${itemId}`),
  availableBlogs: (params) => api.get('/sliders/available-blogs', { params }),
  availableServices: (params) => api.get('/sliders/available-services', { params }),
};

export default api;