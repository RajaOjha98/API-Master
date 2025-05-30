# Deployment Guide for API-Master

This guide explains how to deploy API-Master to Vercel and other platforms.

## Vercel Deployment

### Prerequisites

1. **Supabase Project**: Create a Supabase project at [supabase.com](https://supabase.com)
2. **Database Setup**: Run the SQL script from `scripts/supabase_schema.sql` in your Supabase SQL Editor

### Environment Variables

The following environment variables must be set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Steps to Deploy

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/RajaOjha98/API-Master.git
   cd API-Master
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the project

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the required environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will automatically deploy your project
   - The build should complete successfully with the environment variables set

### Troubleshooting

#### Build Error: "supabaseUrl is required"

This error occurs when environment variables are not properly set. To fix:

1. **Check Environment Variables**: Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel
2. **Redeploy**: After setting environment variables, trigger a new deployment
3. **Verify Values**: Make sure the Supabase URL and key are correct and valid

#### App Loads but Shows "0 API Keys" (RLS Policy Issue)

This is the most common issue on Vercel deployments. The app loads but shows no data because of Row Level Security (RLS) policy restrictions.

**Symptoms:**
- App loads successfully on Vercel
- Dashboard shows "0 API Keys" 
- Analytics cards show all zeros
- Browser console shows permission or RLS errors

**Root Cause:**
The default RLS policy only allows `authenticated` users, but the app uses anonymous access.

**Solution - Update Database Policies:**

1. **Go to Supabase SQL Editor**
   - Open your Supabase project dashboard
   - Navigate to SQL Editor

2. **Run the Updated Schema**
   - Copy the contents of `scripts/supabase_schema.sql` 
   - Execute the entire script in the SQL Editor
   - This will:
     - Drop and recreate the table with proper permissions
     - Add RLS policies for anonymous users
     - Grant necessary permissions to the `anon` role
     - Insert sample data with proper API key format

3. **Verify the Fix**
   - Check that policies exist: Go to Authentication > Policies
   - You should see: "Anonymous users can perform all operations"
   - Test your Vercel deployment - data should now load

**Manual Policy Fix (Alternative):**
If you prefer to manually fix policies without recreating the table:

```sql
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can perform all operations" ON api_keys;

-- Create policy for anonymous users
CREATE POLICY "Anonymous users can perform all operations" 
  ON api_keys 
  FOR ALL 
  TO anon 
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON api_keys TO anon;
GRANT USAGE ON SEQUENCE api_keys_id_seq TO anon;
```

#### Missing Database Tables

If the app loads but shows no data:

1. **Run Database Schema**: Execute the SQL script from `scripts/supabase_schema.sql`
2. **Check RLS Policies**: Ensure Row Level Security policies are properly configured
3. **Verify Connection**: Check browser console for Supabase connection errors

#### Debugging Connection Issues

The app includes built-in debug utilities. Check your browser console for:
- 🔍 Supabase Debug Information
- Environment variable validation
- Connection test results
- Table access verification
- Specific error messages with solutions

### Alternative Deployment Platforms

#### Netlify

1. Connect your repository to Netlify
2. Set the same environment variables in Netlify's environment settings
3. Deploy

#### Docker

1. Build the Docker image:
   ```bash
   docker build -t api-master .
   ```

2. Run with environment variables:
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your-url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
     api-master
   ```

### Production Considerations

1. **Environment Variables**: Never commit real environment variables to version control
2. **Database Security**: Configure proper RLS policies for production use
3. **API Key Security**: Implement proper authentication for production deployments
4. **Monitoring**: Set up error monitoring and logging for production apps

### Support

If you encounter deployment issues:

1. Check the [GitHub Issues](https://github.com/RajaOjha98/API-Master/issues)
2. Review the [README.md](README.md) for additional setup instructions
3. Consult the [Supabase documentation](https://supabase.com/docs) for database-related issues 