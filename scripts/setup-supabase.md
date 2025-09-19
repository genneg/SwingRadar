# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Fill in:
   - **Name**: `blues-festival-finder`
   - **Password**: Generate strong password (save it!)
   - **Region**: `US East (Virginia)`
5. Wait ~2-3 minutes for provisioning

## 2. Get Database Connection String

1. In Supabase dashboard, go to **Settings → Database**
2. Copy the connection details:
   ```
   Host: db.YOUR_PROJECT_REF.supabase.co
   Database: postgres
   Port: 5432
   User: postgres
   Password: [your-password]
   ```

3. Your DATABASE_URL will be:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
   ```

## 3. Configure Vercel Environment Variables

In your Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Update these variables:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

## 4. Run Database Migration

After updating environment variables in Vercel:

1. Trigger new deployment (push to main branch)
2. Or run manually:
   ```bash
   # With your production DATABASE_URL set locally
   npx prisma migrate deploy
   ```

## 5. Verify Database Setup

1. Check Supabase Table Editor to see your tables created
2. Visit your app's `/api/test-db` endpoint to verify connection

## 6. Optional: Seed Initial Data

If you have sample data:
```bash
npx prisma db seed
```

## Security Notes

- Never commit real credentials to git
- Use Vercel environment variables for production
- Enable Row Level Security (RLS) in Supabase if needed
- Consider enabling Supabase API auth for additional security

## Supabase Free Tier Limits

- 500MB database storage
- 2GB bandwidth/month
- 50MB file uploads
- 2 concurrent connections

Perfect for development and small production apps!