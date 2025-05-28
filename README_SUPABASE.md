# API-Master Supabase Integration

This guide explains how to set up the Supabase integration for the API-Master dashboard.

## Setup Steps

1. **Create a Supabase Project**
   - Go to [Supabase](https://supabase.com/) and sign up/sign in
   - Create a new project
   - Note your project URL and anon/public key

2. **Configure Environment Variables**
   - Create a `.env.local` file in the project root
   - Add the following environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Set Up Database Schema**
   - Go to the Supabase SQL Editor
   - Paste and run the contents of `scripts/supabase_schema.sql`
   - This will create the `api_keys` table and add sample data

4. **Run the Application**
   - Run `npm run dev` to start the development server
   - Your app should now be connected to Supabase

## Database Structure

The `api_keys` table has the following structure:

- `id`: Serial integer, primary key
- `description`: Text, description of the API key
- `key`: Text, the actual API key
- `added`: Text, date the key was added
- `expires`: Text, date the key expires
- `usage`: Integer, current usage count
- `limit`: Integer, maximum usage limit
- `created_at`: Timestamp with timezone, auto-generated

## Authentication

For a complete implementation, you should add authentication:

1. **Add Authentication to the App**
   - Implement Supabase Auth UI or custom authentication
   - Update Row Level Security (RLS) policies as needed

2. **Secure Your API Keys**
   - Use RLS to restrict access to API keys based on user ID
   - Add a `user_id` column to the `api_keys` table

## Troubleshooting

- **Connection Issues**: Make sure your environment variables are correctly set
- **Missing Tables**: Verify that you've run the SQL script in the Supabase SQL Editor
- **Data Not Loading**: Check the browser console for error messages from Supabase
- **Auth Issues**: Ensure your RLS policies are properly configured 