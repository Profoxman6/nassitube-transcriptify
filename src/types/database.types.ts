export interface Transcript {
  id: string;
  user_id: string;
  video_url: string;
  video_id: string;
  content: string;
  language: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}