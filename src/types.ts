
export type Category = 'Emotions' | 'Identity' | 'Rage' | 'Society' | 'Mind Games';

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: Category;
  tags: string; // JSON string or comma separated
  featuredImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
