# Sâm Ngọc Linh Web

Frontend web application for Sâm Ngọc Linh project.

## API Configuration

The application uses environment variables to configure the API endpoint:

- For development: `http://localhost:8080/api` (configured in `.env.development`)
- For production: `https://samngoclinh-back.onrender.com/api` (configured in `.env.production`)

You can modify these values in the respective environment files.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

The application is configured to be deployed on Netlify.

```bash
# Build and deploy
npm run deploy
```

Make sure you have the Netlify CLI installed:

```bash
npm install -g netlify-cli
```

## Environment Variables

- `VITE_API_URL` - The API endpoint URL 