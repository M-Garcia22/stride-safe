import { supabase } from '../src/lib/supabase';
import { mockHorses, mockRaces } from '../src/data/preRaceData';
import { mockPostRaceHorses, mockRaceData } from '../src/data/postRaceData';

/**
 * Seeding script to populate Supabase with mock data
 * Run with: bun run scripts/seed-data.ts
 */

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Step 1: Create demo users
    console.log('📝 Creating demo users...');
    const demoUsers = [
      {
        email: 'track@demo.com',
        password: 'demo123',
        user_type: 'track' as const,
        name: 'Churchill Downs Track Manager',
        organization: 'Churchill Downs'
      },
      {
        email: 'trainer@demo.com',
        password: 'demo123',
        user_type: 'trainer' as const,
        name: 'J. Smith',
        organization: 'Thunder Stables LLC'
      },
      {
        email: 'vet@demo.com',
        password: 'demo123',
        user_type: 'vet' as const,
        name: 'Dr. Wilson',
        organization: 'Equine Health Center'
      }
    ];

    const createdUsers: Record<string, string> = {};

    for (const user of demoUsers) {
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            user_type: user.user_type,
            name: user.name,
            organization: user.organization
          }
        }
      });

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError.message);
        continue;
      }

      if (authData.user) {
        // Insert into public.users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: user.email,
            user_type: user.user_type,
            name: user.name,
            organization: user.organization
          });

        if (userError) {
          console.error(`Error inserting user ${user.email}:`, userError.message);
        } else {
          createdUsers[user.user_type] = authData.user.id;
          console.log(`✓ Created ${user.user_type} user: ${user.email}`);
        }
      }
    }

    // Step 2: Create track
    console.log('\n🏇 Creating track...');
    const { data: trackData, error: trackError } = await supabase
      .from('tracks')
      .insert({
        name: 'Churchill Downs',
        location: 'Louisville, Kentucky',
        timezone: 'America/New_York'
      })
      .select()
      .single();

    if (trackError) {
      console.error('Error creating track:', trackError.message);
      return;
    }
    console.log('✓ Created track: Churchill Downs');

    const trackId = trackData.id;
    const trainerId = createdUsers.trainer;
    const vetId = createdUsers.vet;

    // Step 3: Create races
    console.log('\n🏁 Creating races...');
    const racesToInsert = mockRaces.map(race => ({
      race_number: race.id,
      name: race.name,
      race_time: race.time,
      race_date: new Date().toISOString().split('T')[0], // Today's date
      status: race.status,
      distance: race.distance,
      purse: race.purse,
      surface: 'Dirt',
      track_id: trackId
    }));

    const { data: racesData, error: racesError } = await supabase
      .from('races')
      .insert(racesToInsert)
      .select();

    if (racesError) {
      console.error('Error creating races:', racesError.message);
      return;
    }
    console.log(`✓ Created ${racesData.length} races`);

    // Step 4: Create horses
    console.log('\n🐴 Creating horses...');
    const horsesToInsert = mockHorses.map(horse => ({
      name: horse.name,
      birth_date: horse.birthDate,
      sex: horse.sex,
      color: horse.color,
      trainer_id: trainerId,
      owner: horse.owner,
      track_id: trackId,
      vet_id: vetId
    }));

    const { data: horsesData, error: horsesError } = await supabase
      .from('horses')
      .insert(horsesToInsert)
      .select();

    if (horsesError) {
      console.error('Error creating horses:', horsesError.message);
      return;
    }
    console.log(`✓ Created ${horsesData.length} horses`);

    // Create a map of horse names to IDs
    const horseIdMap: Record<string, string> = {};
    horsesData.forEach((horse, idx) => {
      horseIdMap[mockHorses[idx].name] = horse.id;
    });

    // Step 5: Create welfare reports
    console.log('\n📊 Creating welfare reports...');
    let welfareReportsCount = 0;

    for (const mockHorse of mockHorses) {
      const horseId = horseIdMap[mockHorse.name];
      if (!horseId) continue;

      for (const report of mockHorse.welfareReports) {
        const { error: reportError } = await supabase
          .from('welfare_reports')
          .insert({
            horse_id: horseId,
            race_id: null,
            report_date: report.date,
            race_course: report.raceCourse,
            surface: report.surface,
            distance: report.distance,
            welfare_status: report.welfareStatus,
            risk_category: report.riskCategory,
            alerts: report.alerts,
            stride_analysis: report.strideAnalysis
          });

        if (reportError) {
          console.error(`Error creating welfare report for ${mockHorse.name}:`, reportError.message);
        } else {
          welfareReportsCount++;
        }
      }
    }
    console.log(`✓ Created ${welfareReportsCount} welfare reports`);

    // Step 6: Create race entries
    console.log('\n🎟️ Creating race entries...');
    const raceEntriesCount = 0;

    for (const mockHorse of mockHorses) {
      const horseId = horseIdMap[mockHorse.name];
      if (!horseId) continue;

      // Find the corresponding race
      const raceData = racesData.find(r => r.race_number === mockHorse.raceNumber);
      if (!raceData) continue;

      const { error: entryError } = await supabase
        .from('race_entries')
        .insert({
          race_id: raceData.id,
          horse_id: horseId,
          post_position: mockHorse.postPosition,
          jockey: mockHorse.jockey,
          odds: mockHorse.odds,
          weight: mockHorse.weight,
          performance_score: mockHorse.performanceScore,
          wellness_score: mockHorse.wellnessScore,
          performance_ring_score: mockHorse.performanceRingScore,
          welfare_alert: mockHorse.welfareAlert,
          examination_status: mockHorse.examinationStatus
        });

      if (entryError) {
        console.error(`Error creating race entry for ${mockHorse.name}:`, entryError.message);
      }
    }
    console.log(`✓ Created race entries for ${mockHorses.length} horses`);

    // Step 7: Create examinations for horses with examination data
    console.log('\n🔍 Creating examinations...');
    let examinationsCount = 0;

    for (const mockHorse of mockHorses) {
      const horseId = horseIdMap[mockHorse.name];
      if (!horseId) continue;

      // Get the race entry
      const { data: entryData } = await supabase
        .from('race_entries')
        .select('id')
        .eq('horse_id', horseId)
        .single();

      if (!entryData) continue;

      const { error: examError } = await supabase
        .from('examinations')
        .insert({
          race_entry_id: entryData.id,
          examiner_id: vetId,
          examination_date: mockHorse.lastExamination || new Date().toISOString(),
          status: mockHorse.regularVetApproval.status,
          vet_name: mockHorse.regularVetApproval.vetName,
          vet_practice: mockHorse.regularVetApproval.vetPractice,
          comments: mockHorse.regularVetApproval.comments,
          medical_flags: mockHorse.medicalFlags || [],
          recommendation_date: mockHorse.recommendationDate || null,
          regulatory_vet_comments: mockHorse.regulatoryVetComments || null,
          official_steward_notified: mockHorse.officialStewardNotified || null,
          track_official_notified: mockHorse.trackOfficialNotified || null,
          official_record_updated: mockHorse.officialRecordUpdated || false
        });

      if (examError) {
        console.error(`Error creating examination for ${mockHorse.name}:`, examError.message);
      } else {
        examinationsCount++;
      }
    }
    console.log(`✓ Created ${examinationsCount} examinations`);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('Demo credentials:');
    console.log('  Track:   track@demo.com / demo123');
    console.log('  Trainer: trainer@demo.com / demo123');
    console.log('  Vet:     vet@demo.com / demo123\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();

