const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Manually load .env to be sure
const envPath = path.resolve(process.cwd(), '.env');
console.log('Looking for .env at:', envPath);

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
    console.log('Loaded .env file manually.');
} else {
    console.log('ERROR: .env file not found!');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log('ERROR: Could not find keys in .env file.');
    console.log('Found keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
    console.log('Attempting to connect to Supabase...');
    console.log('URL:', supabaseUrl);

    try {
        const { data, error } = await supabase.from('habits').select('count', { count: 'exact', head: true });

        if (error) {
            if (error.code === 'PGRST116' || error.message.includes('JSON')) {
                // Sometimes initial connection might return weird HTML if the URL is wrong
                console.log('ERROR: Connection failed. Check your URL. Received:', error.message);
            } else {
                console.log('SUCCESS: Connected! (Database returned error, but that means we reached it):', error.message);
            }
        } else {
            console.log('SUCCESS: Fully connected to database!');
        }
    } catch (err) {
        console.log('CRITICAL ERROR:', err.message);
    }
}

checkConnection();
