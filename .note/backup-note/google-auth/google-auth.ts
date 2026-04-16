/*
1. A single account can have a maximum of 12 projects.
2. Your current per day token grant rate limit is 10,000 grants per day.

First, set up Google OAuth credentials:

Go to https://console.cloud.google.com/
Create a new project or select existing one
Go to "APIs & Services" > "Credentials"
Click "Create Credentials" > "OAuth client ID"
Choose "Web application"
Add authorized redirect URI: http://localhost:3000/api/auth/callback/google
Add authorized redirect URI: http://[domain.com]/api/auth/callback/google
Save your Client ID and Client Secret
Create environment variables file and update GoogleAuthButton component:

*/
