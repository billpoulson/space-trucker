import * as dotenv from 'dotenv'
import * as fs from 'fs'
dotenv.config()

// Load environment variables from the .env file
// Generate the environment.ts file dynamically
const envConfig = `
export const environment = {
  auth_issuer: '${process.env['AUTH_ISSUER']}',
  auth_client_id:'${process.env['AUTH_CLIENT_ID']}',
  auth_callback_uri: '${process.env['AUTH_CALLBACK_URI']}',
  auth_audience: '${process.env['AUTH_AUDIENCE']}',
};
`

// Write to environment.ts file
fs.writeFileSync('./src/environment.ts', envConfig)

console.log('Environment file generated successfully!')
