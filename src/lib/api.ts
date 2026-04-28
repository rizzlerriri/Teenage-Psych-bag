
import { Post, AuthResponse } from '../types';

const API_URL = '/api';

export const api = {
  getToken: () => localStorage.getItem('blog_token'),
  setToken: (token: string) => localStorage.setItem('blog_token', token),
  logout: () => localStorage.removeItem('blog_token'),

  async login(username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    this.setToken(data.token);
    return data;
  },

  async getPosts(category?: string, search?: string): Promise<Post[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const res = await fetch(`${API_URL}/posts?${params.toString()}`);
    return res.json();
  },

  async getPost(id: string | number): Promise<Post> {
    const res = await fetch(`${API_URL}/posts/${id}`);
    if (!res.ok) throw new Error('Post not found');
    return res.json();
  },

  async createPost(post: Partial<Post>): Promise<{ id: number }> {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(post),
    });
    return res.json();
  },

  async updatePost(id: number, post: Partial<Post>): Promise<void> {
    await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(post),
    });
  },

  async deletePost(id: number): Promise<void> {
    await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: formData,
    });
    return res.json();
  }
};
