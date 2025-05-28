import { supabase, ApiKey } from '@/lib/supabase';

/**
 * Service to handle all API key operations with Supabase
 */
export const apiKeyService = {
  /**
   * Get all API keys
   */
  async getAllApiKeys(): Promise<ApiKey[]> {
    console.log('Attempting to fetch API keys from Supabase...');
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('id', { ascending: true });
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Error fetching API keys:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception in getAllApiKeys:', err);
      throw err;
    }
  },

  /**
   * Get a single API key by ID
   */
  async getApiKeyById(id: number): Promise<ApiKey | null> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching API key with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },

  /**
   * Create a new API key
   */
  async createApiKey(apiKey: Omit<ApiKey, 'id'>): Promise<ApiKey> {
    console.log('Creating new API key with data:', apiKey);
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{
        description: apiKey.description,
        key: apiKey.key,
        added: apiKey.added,
        expires: apiKey.expires,
        usage: apiKey.usage,
        "limit": apiKey.limit // Using quotes for the reserved keyword
      }])
      .select();
    
    console.log('Supabase insert response:', { data, error });
    
    if (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create API key: No data returned');
    }
    
    return data[0];
  },

  /**
   * Update an API key
   */
  async updateApiKey(id: number, updates: Partial<ApiKey>): Promise<void> {
    const updateData: any = { ...updates };
    
    // Handle "limit" as a reserved keyword by reconstructing the object
    if (updates.limit !== undefined) {
      delete updateData.limit;
      updateData["limit"] = updates.limit;
    }
    
    console.log(`Updating API key ${id} with data:`, updateData);
    
    const { error } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating API key with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an API key
   */
  async deleteApiKey(id: number): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting API key with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update API key usage count
   */
  async incrementUsage(id: number): Promise<number> {
    // First get the current key to check limits
    const key = await this.getApiKeyById(id);
    
    if (!key) {
      throw new Error(`API key with ID ${id} not found`);
    }
    
    if (key.usage >= key.limit) {
      throw new Error(`API key with ID ${id} has reached its usage limit`);
    }
    
    const newUsage = key.usage + 1;
    
    await this.updateApiKey(id, { usage: newUsage });
    
    return newUsage;
  },

  /**
   * Generate a new API key string with MSTR prefix
   */
  generateApiKeyString(): string {
    // Generate a random UUID-like string
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    // Add the MSTR prefix
    return `MSTR-${uuid}`;
  }
}; 