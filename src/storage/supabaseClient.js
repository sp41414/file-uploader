const { createClient } = require("@supabase/supabase-js");

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseURL, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

module.exports = supabase;
