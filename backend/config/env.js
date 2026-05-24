/**
 * Environment variable validation.
 * Import and call validateEnv() at the very top of server.js
 * to fail-fast when required configuration is missing.
 */

const REQUIRED_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const OPTIONAL_VARS = [
  { key: 'PORT', fallback: '5000' },
  { key: 'NODE_ENV', fallback: 'development' },
  { key: 'ALLOWED_ORIGINS', fallback: '' },
  { key: 'GOOGLE_CLIENT_ID', fallback: '' },
  { key: 'GROQ_API_KEY', fallback: '' },
  { key: 'GROQ_MODEL', fallback: 'llama-3.3-70b-versatile' },
  { key: 'CLOUDINARY_CLOUD_NAME', fallback: '' },
  { key: 'CLOUDINARY_API_KEY', fallback: '' },
  { key: 'CLOUDINARY_API_SECRET', fallback: '' },
];

export function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n╔══════════════════════════════════════════════╗');
    console.error('║  MISSING REQUIRED ENVIRONMENT VARIABLES      ║');
    console.error('╚══════════════════════════════════════════════╝');
    missing.forEach((key) => console.error(`  ✖  ${key}`));
    console.error('\nCopy backend/.env.example → backend/.env and fill in the values.\n');
    process.exit(1);
  }

  // Warn about optional vars that are empty
  const warnings = OPTIONAL_VARS.filter(({ key }) => !process.env[key]);
  if (warnings.length > 0) {
    console.warn('\n⚠  Optional environment variables not set:');
    warnings.forEach(({ key, fallback }) =>
      console.warn(`   ${key}  (using fallback: "${fallback || '(empty)'}")`)
    );
    console.warn('');
  }

  // Security: ensure JWT secrets are strong enough in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET.length < 32) {
      console.error('✖  JWT_SECRET must be at least 32 characters in production.');
      process.exit(1);
    }
    if (process.env.JWT_REFRESH_SECRET.length < 32) {
      console.error('✖  JWT_REFRESH_SECRET must be at least 32 characters in production.');
      process.exit(1);
    }
  }

  return true;
}

export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV !== 'production';
