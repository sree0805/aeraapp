const { config } = require('dotenv');
config({ path: '.env' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) {
        console.error("Error: No GEMINI_API_KEY or GOOGLE_API_KEY found in .env");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Failed to list models:", error.message);
    }
}

listModels();
