# 🚀 Quick Start Guide

Get your MomBaby Admin Dashboard up and running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
cd muying-admin
npm install
```

## Step 2: Start Development Server (30 sec)

```bash
npm run dev
```

## Step 3: Open Browser (10 sec)

Visit: **http://localhost:3000**

🎉 **That's it!** Your dashboard is now running!

## What You'll See

### 🏠 Dashboard Overview
- 4 stat cards showing revenue, orders, products, and customers
- Recent orders list with status badges
- Top products showcase with images

### 📦 Products View
Click "Products" in the sidebar to see:
- Product management table
- Filter and add product buttons
- Product images, prices, stock levels
- Action buttons (view, edit, delete)

### 📋 Orders View
Click "Orders" in the sidebar to see:
- Order management table
- Export functionality
- Order status tracking
- Customer information

## Navigation

### Sidebar
- **Dashboard** - Overview with stats
- **Products** - Product management (24 items badge)
- **Orders** - Order management (8 items badge)
- **Customers** - Coming soon
- **Analytics** - Coming soon
- **Settings** - Coming soon

### Features to Try

1. **Collapse Sidebar** - Click the arrow button (desktop only)
2. **Mobile Menu** - Resize browser or use mobile device
3. **Search** - Use the search bar in sidebar
4. **Dark Mode** - Add `className="dark"` to `<html>` tag in layout.tsx
5. **Hover Effects** - Hover over cards and buttons

## Next Steps

### Connect to Backend (5 min)

1. **Create environment file**
```bash
cp .env.example .env.local
```

2. **Edit .env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. **Start your Spring Boot backend**
```bash
cd ../muying-mall
mvn spring-boot:run
```

4. **Update components to use real data**

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed steps.

### Customize Design (10 min)

1. **Change Colors**
   - Edit gradient: `from-pink-500 to-purple-600`
   - Modify in: `components/dashboard/*.tsx`

2. **Update Logo**
   - Replace `<Baby />` icon in `Sidebar.tsx`
   - Change "MomBaby" text

3. **Add Navigation Items**
   - Edit `components/dashboard/constants.ts`
   - Add new items to `navigationItems` array

### Add Authentication (15 min)

1. **Create login page**
```bash
mkdir app/login
# Create app/login/page.tsx
```

2. **Implement login logic**
```typescript
import { authApi } from '@/lib/api';

const handleLogin = async () => {
  const response = await authApi.login(username, password);
  localStorage.setItem('adminToken', response.data.token);
};
```

3. **Protect routes**
   - Create `middleware.ts`
   - Check for token
   - Redirect to login if not authenticated

## Common Tasks

### Add a New View

1. Create component: `components/dashboard/CustomersView.tsx`
2. Import in `AdminDashboard.tsx`
3. Add to view switching logic
4. Update navigation in `constants.ts`

### Fetch Real Data

```typescript
// In your component
import { productsApi } from '@/lib/api';

const [products, setProducts] = useState([]);

useEffect(() => {
  productsApi.getList(1, 10).then(response => {
    if (response.success) {
      setProducts(response.data);
    }
  });
}, []);
```

### Add Loading States

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  fetchData().finally(() => setLoading(false));
}, []);

if (loading) return <div>Loading...</div>;
```

### Handle Errors

```typescript
const [error, setError] = useState('');

try {
  const data = await api.getData();
} catch (err) {
  setError('Failed to load data');
}

{error && <div className="text-red-500">{error}</div>}
```

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search (coming soon)
- `Esc` - Close mobile menu
- `Tab` - Navigate through elements

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors
```bash
# Check for errors
npm run type-check

# Fix common issues
npm install --save-dev @types/node @types/react
```

### Styling Issues
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev
```

## Development Tips

### Hot Reload
- Changes auto-reload in browser
- No need to restart server
- Fast refresh preserves state

### Component Structure
```
Component
  ├── State (useState, useEffect)
  ├── Handlers (onClick, onChange)
  ├── Render (JSX)
  └── Styles (Tailwind classes)
```

### Best Practices
- Keep components small and focused
- Use TypeScript types
- Extract reusable logic
- Add loading and error states
- Test on mobile devices

## Resources

- 📖 [Full Documentation](./DASHBOARD_README.md)
- 🔌 [Integration Guide](./INTEGRATION_GUIDE.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 📊 [Project Summary](./PROJECT_SUMMARY.md)

## Getting Help

1. Check documentation files
2. Review code comments
3. Look at example components
4. Test with sample data
5. Check browser console for errors

## What's Next?

After getting familiar with the dashboard:

1. ✅ Connect to backend API
2. ✅ Implement authentication
3. ✅ Add real data
4. ✅ Customize design
5. ✅ Add new features
6. ✅ Deploy to production

## Success Checklist

- [ ] Dashboard loads successfully
- [ ] All views are accessible
- [ ] Sidebar works on mobile
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Ready to connect backend

---

**Need help?** Check the documentation or open an issue!

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Happy coding! 🎉**
