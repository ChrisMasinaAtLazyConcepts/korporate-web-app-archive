export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  image_url?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  is_bot: boolean;
  created_at: string;
}