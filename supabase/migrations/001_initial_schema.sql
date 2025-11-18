-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_type AS ENUM ('track', 'trainer', 'vet');
CREATE TYPE horse_sex AS ENUM ('Colt', 'Filly', 'Gelding', 'Mare', 'Stallion');
CREATE TYPE race_status AS ENUM ('scheduled', 'running', 'finished');
CREATE TYPE welfare_status AS ENUM ('good', 'warning', 'alert');
CREATE TYPE examination_status AS ENUM ('pending', 'in-progress', 'passed', 'scratched');
CREATE TYPE approval_status AS ENUM ('approved', 'pending', 'declined');
CREATE TYPE urgency_level AS ENUM ('routine', 'urgent', 'emergency');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  name TEXT NOT NULL,
  organization TEXT,
  phone TEXT,
  license_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks table
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horses table
CREATE TABLE public.horses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  sex horse_sex NOT NULL,
  color TEXT NOT NULL,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner TEXT NOT NULL,
  track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  vet_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Races table
CREATE TABLE public.races (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  race_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  race_time TEXT NOT NULL,
  race_date DATE NOT NULL,
  status race_status DEFAULT 'scheduled',
  distance TEXT NOT NULL,
  purse TEXT NOT NULL,
  surface TEXT,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Welfare reports table
CREATE TABLE public.welfare_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
  race_id UUID REFERENCES public.races(id) ON DELETE SET NULL,
  report_date DATE NOT NULL,
  race_course TEXT NOT NULL,
  surface TEXT NOT NULL,
  distance TEXT NOT NULL,
  welfare_status welfare_status NOT NULL,
  risk_category INTEGER CHECK (risk_category BETWEEN 1 AND 5) NOT NULL,
  alerts TEXT[] DEFAULT '{}',
  stride_analysis JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Race entries (horses entered in specific races)
CREATE TABLE public.race_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  race_id UUID NOT NULL REFERENCES public.races(id) ON DELETE CASCADE,
  horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
  post_position INTEGER NOT NULL,
  jockey TEXT NOT NULL,
  odds TEXT NOT NULL,
  weight INTEGER NOT NULL,
  performance_score DECIMAL(5,2) DEFAULT 0,
  wellness_score DECIMAL(5,2) DEFAULT 0,
  performance_ring_score DECIMAL(5,2) DEFAULT 0,
  welfare_alert BOOLEAN DEFAULT FALSE,
  examination_status examination_status DEFAULT 'pending',
  finish_position INTEGER,
  race_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(race_id, horse_id)
);

-- Examinations table
CREATE TABLE public.examinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  race_entry_id UUID NOT NULL REFERENCES public.race_entries(id) ON DELETE CASCADE,
  examiner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  examination_date TIMESTAMPTZ NOT NULL,
  status approval_status DEFAULT 'pending',
  vet_name TEXT,
  vet_practice TEXT,
  comments TEXT,
  medical_flags TEXT[] DEFAULT '{}',
  recommendation_date TIMESTAMPTZ,
  regulatory_vet_comments TEXT,
  official_steward_notified TIMESTAMPTZ,
  track_official_notified TIMESTAMPTZ,
  official_record_updated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (for vet communication)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES public.horses(id) ON DELETE SET NULL,
  race_entry_id UUID REFERENCES public.race_entries(id) ON DELETE SET NULL,
  urgency urgency_level NOT NULL,
  message TEXT NOT NULL,
  additional_details TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_horses_trainer ON public.horses(trainer_id);
CREATE INDEX idx_horses_vet ON public.horses(vet_id);
CREATE INDEX idx_horses_track ON public.horses(track_id);
CREATE INDEX idx_welfare_reports_horse ON public.welfare_reports(horse_id);
CREATE INDEX idx_welfare_reports_date ON public.welfare_reports(report_date DESC);
CREATE INDEX idx_race_entries_race ON public.race_entries(race_id);
CREATE INDEX idx_race_entries_horse ON public.race_entries(horse_id);
CREATE INDEX idx_examinations_race_entry ON public.examinations(race_entry_id);
CREATE INDEX idx_messages_to_user ON public.messages(to_user_id, read);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.welfare_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.race_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for horses table
CREATE POLICY "Trainers can view their own horses"
  ON public.horses FOR SELECT
  USING (
    trainer_id = auth.uid() OR
    vet_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND user_type = 'track'
    )
  );

CREATE POLICY "Trainers can manage their own horses"
  ON public.horses FOR ALL
  USING (trainer_id = auth.uid());

-- RLS Policies for races table
CREATE POLICY "Everyone can view races"
  ON public.races FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for welfare reports
CREATE POLICY "Users can view welfare reports for accessible horses"
  ON public.welfare_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.horses
      WHERE id = welfare_reports.horse_id
      AND (
        trainer_id = auth.uid() OR
        vet_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND user_type = 'track'
        )
      )
    )
  );

-- RLS Policies for race entries
CREATE POLICY "Users can view race entries for accessible horses"
  ON public.race_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.horses
      WHERE id = race_entries.horse_id
      AND (
        trainer_id = auth.uid() OR
        vet_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND user_type = 'track'
        )
      )
    )
  );

-- RLS Policies for examinations
CREATE POLICY "Users can view examinations for accessible horses"
  ON public.examinations FOR SELECT
  USING (
    examiner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.race_entries re
      JOIN public.horses h ON h.id = re.horse_id
      WHERE re.id = examinations.race_entry_id
      AND (
        h.trainer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND user_type = 'track'
        )
      )
    )
  );

CREATE POLICY "Vets can create examinations"
  ON public.examinations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND user_type = 'vet'
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can update their received messages"
  ON public.messages FOR UPDATE
  USING (to_user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON public.tracks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_horses_updated_at BEFORE UPDATE ON public.horses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_races_updated_at BEFORE UPDATE ON public.races FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_welfare_reports_updated_at BEFORE UPDATE ON public.welfare_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_race_entries_updated_at BEFORE UPDATE ON public.race_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_examinations_updated_at BEFORE UPDATE ON public.examinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

