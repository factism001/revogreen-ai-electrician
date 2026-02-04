#!/usr/bin/env node

// Validate that required environment variables are set
const requiredEnvVars = ['GOOGLE_GENAI_API_KEY'];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please set these environment variables before building/running the app.');
  console.error('   For Netlify: Set them in the Netlify dashboard under Site Settings > Environment Variables');
  console.error('   For local dev: Create a .env.local file (see .env.example)\n');
  process.exit(1);
}

console.log('✅ All required environment variables are set');