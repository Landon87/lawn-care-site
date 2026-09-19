-- Emerald's Cuts Lawn Services - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- BOOKINGS / FORM SUBMISSIONS
-- ================================
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    preferred_date DATE,
    property_type TEXT CHECK (property_type IN ('residential', 'commercial')),
    location TEXT,
    consultation TEXT CHECK (consultation IN ('in-person', 'phone')),
    maintenance BOOLEAN DEFAULT false,
    notes TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
    source TEXT DEFAULT 'website', -- where the lead came from
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_phone ON bookings(phone);

-- ================================
-- CUSTOMERS (auto-built from bookings)
-- ================================
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    location TEXT,
    property_type TEXT,
    notes TEXT,
    total_bookings INTEGER DEFAULT 1,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);

-- ================================
-- BUSINESS SETTINGS
-- ================================
CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- singleton table
    business_name TEXT DEFAULT 'Emeralds Cuts Lawn Services',
    phone TEXT DEFAULT '(904) 555-0123',
    email TEXT DEFAULT 'contactus@emeraldscuts.com',
    hours TEXT DEFAULT 'Mon-Sat: 8AM - 6PM',
    address TEXT,
    service_areas TEXT[] DEFAULT ARRAY['Jacksonville', 'Macclenny', 'St. Augustine', 'Yulee', 'Stance', 'Jax Beach', 'Middleburg'],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id, phone) VALUES (1, '(904) 575-7836') ON CONFLICT DO NOTHING;

-- ================================
-- PRICING TABLE (admin-managed)
-- ================================
CREATE TABLE pricing (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service TEXT NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pricing
INSERT INTO pricing (service, description, price, sort_order) VALUES
    ('Tree & Shrub Care', 'Per visit', '$75', 1),
    ('Seasonal Cleanup', 'Spring & Fall', '$125', 2),
    ('Lawn Mowing', 'Starting price, varies by yard size', '$49+', 3),
    ('Fertilization', 'Seasonal treatments', '$55+', 4),
    ('Landscaping', 'Contact us for estimate', 'Custom Quote', 5)
ON CONFLICT DO NOTHING;

-- RLS for pricing
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public to read pricing" ON pricing
    FOR SELECT TO anon, authenticated USING (true);

-- ================================
-- ACTIVITY LOG (for admin audit trail)
-- ================================
CREATE TABLE activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL, -- 'booking_created', 'status_updated', 'customer_updated', etc.
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- ================================
-- ROW LEVEL SECURITY (RLS)
-- ================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Public can INSERT bookings (for the website form)
CREATE POLICY "Allow public to create bookings" ON bookings
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Public can read settings (for displaying business info)
CREATE POLICY "Allow public to read settings" ON settings
    FOR SELECT TO anon, authenticated USING (true);

-- Only service role can do everything else (admin dashboard)
-- The service role key bypasses RLS by default

-- ================================
-- FUNCTIONS
-- ================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create/update customer when booking is inserted
CREATE OR REPLACE FUNCTION upsert_customer_from_booking()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO customers (name, phone, email, location, property_type, last_contact_date)
    VALUES (NEW.name, NEW.phone, NEW.email, NEW.location, NEW.property_type, NEW.created_at)
    ON CONFLICT (phone) DO UPDATE SET
        name = EXCLUDED.name,
        email = COALESCE(EXCLUDED.email, customers.email),
        location = COALESCE(EXCLUDED.location, customers.location),
        property_type = COALESCE(EXCLUDED.property_type, customers.property_type),
        total_bookings = customers.total_bookings + 1,
        last_contact_date = EXCLUDED.last_contact_date,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_upsert_customer
    AFTER INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION upsert_customer_from_booking();

-- Log activity
CREATE OR REPLACE FUNCTION log_booking_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_log (action, details)
    VALUES (
        'booking_created',
        jsonb_build_object(
            'booking_id', NEW.id,
            'name', NEW.name,
            'phone', NEW.phone,
            'location', NEW.location
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_booking
    AFTER INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION log_booking_activity();
