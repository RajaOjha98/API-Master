# Deployment Guide for API-Master

This guide explains how to deploy API-Master to Vercel and other platforms.

## Vercel Deployment

### Prerequisites

1. **Supabase Project**: Create a Supabase project at [supabase.com](https://supabase.com)
2. **Database Setup**: Run the SQL script from `scripts/supabase_schema_public.sql` in your Supabase SQL Editor for demo deployment, or `scripts/supabase_schema.sql` for production with authentication

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

#### Missing Database Tables

If the app loads but shows no data:

1. **Run Database Schema**: 
   - For **demo/public access**: Execute `scripts/supabase_schema_public.sql`
   - For **production with auth**: Execute `scripts/supabase_schema.sql`
2. **Check RLS Policies**: Ensure Row Level Security policies are properly configured
3. **Verify Connection**: Check browser console for Supabase connection errors
4. **Use Debug Mode**: Add `?debug=true` to the URL to see detailed diagnostic information

#### Database Schema Options

**Option 1: Public Demo Schema** (`scripts/supabase_schema_public.sql`)
- Allows public access without authentication
- Perfect for demos and testing
- Sample data included with proper MSTR- prefixed keys
- **Security Note**: Only use for demo purposes

**Option 2: Authenticated Schema** (`scripts/supabase_schema.sql`)
- Requires user authentication
- Better for production use
- Implements proper Row Level Security (RLS)
- More secure but requires additional authentication setup

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