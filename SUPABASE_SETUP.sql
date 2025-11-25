-- ============================================
-- SQL para configurar o banco de dados Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Investigators table
CREATE TABLE IF NOT EXISTS investigators (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- People table
CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  gang TEXT NOT NULL,
  hierarchy TEXT NOT NULL CHECK (hierarchy IN ('Lider', 'Sub-Lider', 'Membro')),
  phone TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  deep TEXT,
  vehicle_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  plate TEXT NOT NULL,
  model TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  owner_id TEXT,
  gang_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gangs table
CREATE TABLE IF NOT EXISTS gangs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT,
  allied_gang_ids TEXT[] DEFAULT '{}',
  friend_gang_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  person_ids TEXT[] DEFAULT '{}',
  vehicle_ids TEXT[] DEFAULT '{}',
  gang_ids TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  closed_reason TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investigations table
CREATE TABLE IF NOT EXISTS investigations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sections JSONB DEFAULT '[]',
  person_ids TEXT[] DEFAULT '{}',
  faction_ids TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Charges table
CREATE TABLE IF NOT EXISTS charges (
  id TEXT PRIMARY KEY,
  person_ids TEXT[] DEFAULT '{}',
  vehicle_ids TEXT[] DEFAULT '{}',
  gang_id TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'resolvido')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bases table
CREATE TABLE IF NOT EXISTS bases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  gang_id TEXT,
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  person_ids TEXT[] DEFAULT '{}',
  vehicle_ids TEXT[] DEFAULT '{}',
  gang_ids TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  meeting_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deeps table
CREATE TABLE IF NOT EXISTS deeps (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  person_ids TEXT[] DEFAULT '{}',
  gang_id TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auctions table
CREATE TABLE IF NOT EXISTS auctions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  entries JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facades table
CREATE TABLE IF NOT EXISTS facades (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  gang_id TEXT,
  person_ids TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  investigator_id TEXT NOT NULL,
  investigator_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size INTEGER NOT NULL,
  investigation_id TEXT,
  case_id TEXT,
  person_id TEXT,
  meeting_id TEXT,
  auction_id TEXT,
  vehicle_id TEXT,
  deep_id TEXT,
  base_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_people_gang ON people(gang);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_charges_status ON charges(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_investigator ON activity_logs(investigator_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_uploads_investigation ON uploads(investigation_id);
CREATE INDEX IF NOT EXISTS idx_uploads_case ON uploads(case_id);
CREATE INDEX IF NOT EXISTS idx_uploads_person ON uploads(person_id);
CREATE INDEX IF NOT EXISTS idx_uploads_vehicle ON uploads(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_uploads_meeting ON uploads(meeting_id);
CREATE INDEX IF NOT EXISTS idx_uploads_auction ON uploads(auction_id);
CREATE INDEX IF NOT EXISTS idx_uploads_deep ON uploads(deep_id);
CREATE INDEX IF NOT EXISTS idx_uploads_base ON uploads(base_id);
CREATE INDEX IF NOT EXISTS idx_deeps_gang ON deeps(gang_id);
CREATE INDEX IF NOT EXISTS idx_bases_gang ON bases(gang_id);
CREATE INDEX IF NOT EXISTS idx_facades_gang ON facades(gang_id);

-- Add missing columns to existing tables (for updates)
ALTER TABLE bases ADD COLUMN IF NOT EXISTS gang_id TEXT;
ALTER TABLE bases ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE deeps ADD COLUMN IF NOT EXISTS person_ids TEXT[] DEFAULT '{}';
ALTER TABLE deeps ADD COLUMN IF NOT EXISTS gang_id TEXT;
ALTER TABLE deeps ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE people ADD COLUMN IF NOT EXISTS deeps TEXT[] DEFAULT '{}';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS investigation_id TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS case_id TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS person_id TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS meeting_id TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS auction_id TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS vehicle_id TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS deep_id TEXT;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS base_id TEXT;
ALTER TABLE investigations ADD COLUMN IF NOT EXISTS faction_ids TEXT[] DEFAULT '{}';


ALTER TABLE people ADD COLUMN IF NOT EXISTS deep TEXT;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE gangs ADD COLUMN IF NOT EXISTS friend_gang_ids TEXT[] DEFAULT '{}';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS facade_id TEXT;

-- Inserir investigadores padrão
INSERT INTO investigators (id, name) VALUES
  ('N-00', 'Kitsune'),
  ('N-01', 'Hinata'),
  ('N-02', 'Luciano'),
  ('N-03', 'Miranda'),
  ('N-04', 'Eloa'),
  ('N-05', 'Lua'),
  ('N-06', 'Hiro'),
  ('N-07', 'H40N'),
  ('N-08', 'Lara'),
  ('N-09', 'Francisco'),
  ('N-10', 'Boris'),
  ('N-11', 'Kokusai')
ON CONFLICT (id) DO NOTHING;
