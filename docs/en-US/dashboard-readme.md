# MomBaby Admin Dashboard

A modern, beautiful, and interactive admin dashboard for the MomBaby e-commerce platform.

## Features

✨ **Modern UI Design**
- Beautiful gradient color schemes (Pink to Purple)
- Smooth animations with Framer Motion
- Dark mode support
- Responsive design for all screen sizes

🎨 **Rich Interactions**
- Collapsible sidebar with smooth transitions
- Hover effects and micro-interactions
- Mobile-friendly with hamburger menu
- Real-time notifications badge

📊 **Dashboard Views**
- **Overview**: Stats cards, recent orders, top products
- **Products**: Product management table with actions
- **Orders**: Order management with status tracking
- **Customers**: Customer management (coming soon)
- **Analytics**: Analytics dashboard (coming soon)
- **Settings**: System settings (coming soon)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

## Project Structure

```
muying-admin/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page (Dashboard)
│   └── globals.css         # Global styles with Tailwind v4
├── components/
│   └── dashboard/
│       ├── AdminDashboard.tsx   # Main dashboard component
│       ├── Sidebar.tsx          # Collapsible sidebar
│       ├── Header.tsx           # Top header with notifications
│       ├── OverviewView.tsx     # Dashboard overview
│       ├── ProductsView.tsx     # Products management
│       ├── OrdersView.tsx       # Orders management
│       ├── types.ts             # TypeScript interfaces
│       ├── constants.ts         # Sample data and navigation
│       └── index.ts             # Barrel exports
└── lib/
    └── utils.ts            # Utility functions
```

## Component Architecture

### AdminDashboard
Main container component that manages:
- Sidebar state (open/collapsed)
- Active navigation item
- View switching
- Responsive behavior

### Sidebar
Collapsible navigation sidebar with:
- Logo and branding
- Search functionality
- Navigation items with badges
- User profile section
- Logout button

### Header
Top navigation bar featuring:
- Page title
- Notification bell with badge
- User profile dropdown

### View Components
- **OverviewView**: Stats cards, recent orders, top products
- **ProductsView**: Product table with CRUD actions
- **OrdersView**: Order table with status management

## Customization

### Colors
The dashboard uses a pink-to-purple gradient theme. To customize:

1. Update gradient colors in components:
```tsx
bg-gradient-to-r from-pink-500 to-purple-600
```

2. Modify CSS variables in `globals.css` for theme colors

### Navigation Items
Edit `components/dashboard/constants.ts`:

```typescript
export const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
  // Add more items...
];
```

### Sample Data
Replace sample data in `constants.ts` with API calls:

```typescript
// Replace sampleProducts with API fetch
const products = await fetch('/api/products').then(r => r.json());
```

## Integration with Backend

The dashboard is ready to integrate with your Java Spring Boot backend:

### API Endpoints to Connect

1. **Products**: `/api/admin/products`
2. **Orders**: `/api/admin/orders`
3. **Customers**: `/api/admin/users`
4. **Stats**: `/api/admin/statistics`
5. **Auth**: `/api/admin/login`

### Example API Integration

Create an API service:

```typescript
// lib/api.ts
export async function getProducts() {
  const response = await fetch('http://localhost:8080/api/admin/products', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}
```

Use in components:

```typescript
// components/dashboard/ProductsView.tsx
const [products, setProducts] = useState([]);

useEffect(() => {
  getProducts().then(setProducts);
}, []);
```

## Running the Dashboard

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the dashboard.

## Next Steps

1. **Authentication**: Implement login/logout with JWT
2. **API Integration**: Connect to Spring Boot backend
3. **Real-time Updates**: Add WebSocket for live data
4. **Charts**: Integrate Chart.js or Recharts for analytics
5. **Forms**: Add product/order creation forms
6. **File Upload**: Implement image upload for products
7. **Permissions**: Add role-based access control

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
