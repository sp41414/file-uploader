const { StorageClient } = require("@supabase/supabase-js");

const storage = new StorageClient(process.env.SUPABASE_URL + "/storage/v1", {
    apikey: process.env.SUPABASE_ANON_KEY,
});

module.exports = storage;
