# Deployment Guide

## Production Build

### 1. Environment Variables

Create `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.mombaby.com
NEXT_PUBLIC_WS_URL=wss://api.mombaby.com/ws
```

### 2. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### 3. Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to test the production build.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables**
- Go to Vercel Dashboard
- Select your project
- Settings → Environment Variables
- Add `NEXT_PUBLIC_API_URL`

4. **Custom Domain**
- Settings → Domains
- Add your custom domain

### Option 2: Docker

1. **Create Dockerfile**

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. **Update next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

3. **Create docker-compose.yml**

```yaml
version: '3.8'

services:
  admin:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: your-spring-boot-image
    ports:
      - "8080:8080"
    restart: unless-stopped
```

4. **Build and Run**

```bash
docker-compose up -d
```

### Option 3: Traditional Server (PM2)

1. **Install PM2**
```bash
npm install -g pm2
```

2. **Create ecosystem.config.js**

```javascript
module.exports = {
  apps: [{
    name: 'mombaby-admin',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
```

3. **Deploy**

```bash
# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Option 4: Nginx Reverse Proxy

1. **Nginx Configuration**

```nginx
# /etc/nginx/sites-available/mombaby-admin
server {
    listen 80;
    server_name admin.mombaby.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

2. **Enable Site**

```bash
sudo ln -s /etc/nginx/sites-available/mombaby-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **SSL with Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d admin.mombaby.com
```

## Performance Optimization

### 1. Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={100}
  height={100}
  quality={75}
/>
```

### 2. Code Splitting

Components are automatically code-split. For dynamic imports:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 3. Caching Strategy

Add caching headers in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=120' },
        ],
      },
    ];
  },
};
```

### 4. Bundle Analysis

```bash
npm install @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

## Monitoring

### 1. Error Tracking with Sentry

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Analytics

Add Google Analytics or Plausible:

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Security Checklist

- [ ] Enable HTTPS
- [ ] Set secure headers (CSP, HSTS, etc.)
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted origins
- [ ] Implement proper authentication
- [ ] Add CSRF protection
- [ ] Regular security updates

## CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Backup Strategy

1. **Database Backups** (Backend)
2. **Static Assets** (Images, uploads)
3. **Configuration Files**
4. **Environment Variables**

## Rollback Plan

1. Keep previous builds
2. Use version tags
3. Quick rollback with Vercel:
   ```bash
   vercel rollback
   ```

## Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}
```

## Post-Deployment

1. Test all critical paths
2. Monitor error rates
3. Check performance metrics
4. Verify API connections
5. Test authentication flow
6. Check mobile responsiveness

## Troubleshooting

### Build Fails
- Check Node.js version (20+)
- Clear `.next` folder
- Delete `node_modules` and reinstall

### API Connection Issues
- Verify CORS settings
- Check environment variables
- Test API endpoints directly

### Performance Issues
- Enable caching
- Optimize images
- Use CDN for static assets
- Enable compression

## Support

For deployment issues:
- Check Next.js deployment docs
- Review Vercel documentation
- Check server logs
- Monitor application metrics
