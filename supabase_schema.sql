-- Travel Trap Detector Schema
-- Run this in your Supabase SQL Editor

-- 1. Tariff Rules
CREATE TABLE tariff_rules (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- e.g., 'auto', 'taxi', 'app_cab'
    base_fare DECIMAL(10, 2) NOT NULL,
    base_km DECIMAL(10, 2) NOT NULL,
    per_km DECIMAL(10, 2) NOT NULL,
    night_multiplier DECIMAL(4, 2) DEFAULT 1.0,
    night_start TIME,
    night_end TIME,
    source_name VARCHAR(255),
    source_url TEXT,
    effective_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Price Reports (Community data)
CREATE TABLE price_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Optional, maps to auth.users if logged in
    city VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    pickup_point VARCHAR(255) NOT NULL,
    drop_point VARCHAR(255) NOT NULL,
    distance_km DECIMAL(10, 2) NOT NULL,
    quoted_price DECIMAL(10, 2) NOT NULL,
    paid_price DECIMAL(10, 2), -- Nullable if they didn't take the ride
    trip_time TIMESTAMP WITH TIME ZONE,
    issue_tags TEXT[], -- e.g., ['overcharge', 'hidden_fee', 'meter_refused', 'detour', 'other']
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, flagged
    flags JSONB DEFAULT '[]'::jsonb, -- Store automated flag reasons
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Report Evidence
CREATE TABLE report_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES price_reports(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    type VARCHAR(20), -- photo, bill, screenshot
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Moderation Log
CREATE TABLE moderation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES price_reports(id) ON DELETE CASCADE,
    moderator_id UUID, -- References auth.users
    action VARCHAR(20) NOT NULL, -- approved, rejected
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Quote Checks (Anonymous log for demo statistics)
CREATE TABLE quote_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100),
    service_type VARCHAR(50),
    distance_km DECIMAL(10, 2),
    quoted_price DECIMAL(10, 2),
    verdict VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Example for Guwahati Autos)
INSERT INTO tariff_rules (city, service_type, base_fare, base_km, per_km, night_multiplier, night_start, night_end, source_name, effective_date)
VALUES ('Guwahati', 'auto', 25.00, 1.0, 15.00, 1.50, '21:00:00', '05:00:00', 'Assam Transport Department', '2023-01-01');

-- Mock Approved Reports for Testing (Guwahati)
INSERT INTO price_reports (city, service_type, pickup_point, drop_point, distance_km, quoted_price, paid_price, status, created_at)
VALUES 
    ('Guwahati', 'auto', 'Paltan Bazaar', 'Kamakhya Temple', 7.5, 150.00, 140.00, 'approved', NOW() - INTERVAL '2 days'),
    ('Guwahati', 'auto', 'Paltan Bazaar', 'Kamakhya Temple', 7.2, 160.00, 160.00, 'approved', NOW() - INTERVAL '5 days'),
    ('Guwahati', 'auto', 'Railway Station', 'Dispur', 8.5, 180.00, 170.00, 'approved', NOW() - INTERVAL '10 days'),
    ('Guwahati', 'auto', 'Airport', 'Paltan Bazaar', 22.0, 500.00, 450.00, 'approved', NOW() - INTERVAL '1 day'),
    ('Guwahati', 'auto', 'ISBT', 'Ganeshguri', 11.0, 250.00, 220.00, 'approved', NOW() - INTERVAL '15 days');
