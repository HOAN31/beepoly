const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;

module.exports = {
  supabase,
  isConfigured
};
