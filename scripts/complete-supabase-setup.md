# Complete Supabase Setup Guide

## 📋 Overview
This guide walks you through migrating your Blues Dance Festival Finder from local PostgreSQL to Supabase.

## 🚀 Step-by-Step Process

### Phase 1: Supabase Project Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: `blues-festival-finder`
   - Region: `US East (Virginia)` 
   - Generate strong password and **save it**

2. **Get Connection Details**
   - Settings → Database
   - Copy connection string:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres
   ```

### Phase 2: Environment Configuration

3. **Update Vercel Environment Variables**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Add/Update:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres
   NEXTAUTH_SECRET=e3d210be4bc4bf83ccfdf0f9fc13226edb92578b4a8854a0cedba7ce4cb25f51
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   ```

4. **Test Connection Locally** (Optional)
   ```bash
   export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres"
   npm run dev
   # Check http://localhost:3000/api/test-db
   ```

### Phase 3: Database Schema Setup

5. **Run Initial SQL Setup**
   - Supabase Dashboard → SQL Editor
   - Run contents of `scripts/migrate-production.sql`
   - This sets up extensions and initial data

6. **Deploy Prisma Schema**
   ```bash
   # From project root
   cd packages/database
   export DATABASE_URL="your-supabase-url"
   npx prisma migrate deploy
   npx prisma generate
   ```

   **Or use scripts:**
   - Windows: `scripts/prisma-commands.bat`
   - Mac/Linux: `scripts/prisma-commands.sh`

### Phase 4: Data Migration (Optional)

7. **Export Current Data** (if you have existing data)
   ```bash
   # Connect to your local DB and export
   psql $LOCAL_DATABASE_URL -f scripts/migrate-data-from-current-db.sql
   ```

8. **Import Data to Supabase**
   ```bash
   # Automated migration script
   SOURCE_DATABASE_URL="postgresql://scraper:scraper_password@localhost:5432/swing_events" \
   TARGET_DATABASE_URL="your-supabase-url" \
   node scripts/data-migration.js
   ```

### Phase 5: Verification & Testing

9. **Verify Deployment**
   - Push changes to trigger Vercel deployment
   - Check deployment logs for database errors
   - Visit app in browser

10. **Test Database Functionality**
    - `/api/test-db` - Should return success
    - `/api/events` - Should work without errors
    - `/api/health` - Should show database connected

11. **Verify Tables in Supabase**
    - Supabase Dashboard → Table Editor
    - Should see all tables created:
      - `events`, `teachers`, `musicians`
      - `users`, `user_preferences`
      - `event_teachers`, `event_musicians`
      - And more...

## 🎯 Success Checklist

- [ ] Supabase project created
- [ ] Connection string copied  
- [ ] Vercel environment variables updated
- [ ] Initial SQL script executed
- [ ] Prisma migrations deployed
- [ ] Data migrated (if applicable)
- [ ] Vercel deployment successful
- [ ] `/api/test-db` returns success
- [ ] No database errors in logs
- [ ] Tables visible in Supabase dashboard

## 🔧 Troubleshooting

### Common Issues:

**Connection Errors:**
- Verify DATABASE_URL format
- Check Supabase project is not paused
- Ensure password is URL-encoded

**Migration Errors:**
- Run `npx prisma db push` to sync schema
- Check for table name conflicts
- Verify Prisma client is regenerated

**Vercel Deployment Errors:**
- Check environment variables are set
- Verify `dynamic = 'force-dynamic'` on API routes
- Look for TypeScript errors

## 📊 Database Limits

**Supabase Free Tier:**
- 500MB storage
- 2GB bandwidth/month  
- 50MB file uploads
- Unlimited API requests

**Perfect for:**
- Thousands of events
- Hundreds of users
- Development and testing
- Small production apps

## 🚀 Post-Migration

After successful migration:
1. Remove local database dependency
2. Update documentation
3. Set up automated backups (Supabase handles this)
4. Consider enabling Row Level Security for sensitive data
5. Monitor usage in Supabase dashboard

## 📞 Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Review Vercel deployment logs  
3. Verify environment variables
4. Test connection with `npx prisma studio`

---

**🎉 Once completed, your app will be fully cloud-native with zero database maintenance required!**