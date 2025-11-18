# Database Scripts

## Seeding the Database

To populate your Supabase database with mock data:

```bash
bun run scripts/seed-data.ts
```

This will create:
- 3 demo user accounts (track, trainer, vet)
- 1 track (Churchill Downs)
- 8 races
- 8 horses
- Multiple welfare reports
- Race entries
- Examinations

### Demo Credentials

After seeding, you can log in with:

**Track Manager:**
- Email: `track@demo.com`
- Password: `demo123`

**Trainer:**
- Email: `trainer@demo.com`
- Password: `demo123`

**Veterinarian:**
- Email: `vet@demo.com`
- Password: `demo123`

## Running the Migration

To run the database migration in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click "Run"

Alternatively, if you have Supabase CLI installed:

```bash
supabase db push
```

## Important Notes

- Make sure your `.env` file is properly configured before running scripts
- The seeding script will attempt to create new users - if they already exist, it will skip them
- You may need to disable RLS temporarily or use a service role key for seeding

