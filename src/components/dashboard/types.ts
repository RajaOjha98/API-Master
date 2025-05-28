// Define API Key type
export interface ApiKey {
  id: number;
  description: string;
  key: string;
  added: string;
  expires: string;
  usage: number;
  limit: number;
} 