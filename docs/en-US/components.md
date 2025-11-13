# 🧩 Component Documentation

Complete guide to all dashboard components and their usage.

## Component Hierarchy

```
AdminDashboard (Root)
├── Sidebar
│   ├── Logo & Brand
│   ├── Search Bar
│   ├── Navigation Items
│   └── User Profile
├── Header
│   ├── Page Title
│   ├── Notifications
│   └── User Menu
└── Main Content
    ├── OverviewView
    ├── ProductsView
    ├── OrdersView
    └── Other Views
```

## Core Components

### AdminDashboard

**Location**: `components/dashboard/AdminDashboard.tsx`

Main container component that manages the entire dashboard state.

**Props**: None (root component)

**State**:
- `isOpen` - Sidebar visibility (mobile)
- `isCollapsed` - Sidebar collapsed state (desktop)
- `activeItem` - Current navigation item
- `searchQuery` - Search input value
- `showNotifications` - Notification panel visibility
- `selectedView` - Current view being displayed

**Usage**:
```typescript
import { AdminDashboard } from '@/components/dashboard';

export default function Page() {
  return <AdminDashboard />;
}
```

**Features**:
- Responsive sidebar management
- View switching
- Mobile overlay
- Window resize handling

---

### Sidebar

**Location**: `components/dashboard/Sidebar.tsx`

Collapsible navigation sidebar with search and user profile.

**Props**:
```typescript
interface SidebarProps {
  isOpen: boolean;              // Sidebar visibility
  isCollapsed: boolean;         // Collapsed state
  activeItem: string;           // Active navigation item
  searchQuery: string;          // Search input value
  onToggleCollapse: () => void; // Collapse toggle handler
  onItemClick: (id: string) => void; // Navigation handler
  onSearchChange: (query: string) => void; // Search handler
}
```

**Features**:
- Smooth collapse/expand animation
- Search functionality
- Badge notifications
- User profile section
- Logout button
- Tooltip on collapsed items

**Customization**:
```typescript
// Change logo
<Baby className="text-white h-5 w-5" />
// Replace with your icon

// Change brand name
<span className="font-semibold">MomBaby</span>
// Update to your brand

// Modify colors
className="bg-gradient-to-br from-pink-500 to-purple-600"
// Change gradient colors
```

---

### Header

**Location**: `components/dashboard/Header.tsx`

Top navigation bar with page title and user actions.

**Props**:
```typescript
interface HeaderProps {
  activeItem: string;           // Current page name
  showNotifications: boolean;   // Notification panel state
  onToggleNotifications: () => void; // Toggle handler
}
```

**Features**:
- Dynamic page title
- Notification bell with badge
- User profile display
- Responsive layout

**Customization**:
```typescript
// Add more actions
<button className="p-2 rounded-lg hover:bg-slate-100">
  <Settings className="h-5 w-5" />
</button>

// Customize user info
<p className="text-sm font-medium">Your Name</p>
<p className="text-xs text-slate-500">Your Role</p>
```

---

### OverviewView

**Location**: `components/dashboard/OverviewView.tsx`

Dashboard overview with stats, recent orders, and top products.

**Props**: None

**Features**:
- 4 stat cards with trends
- Recent orders list (5 items)
- Top products showcase (5 items)
- Hover animations
- Status badges

**Data Structure**:
```typescript
// Stats
{
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: Component;
}

// Orders
{
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

// Products
{
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  image: string;
}
```

**Customization**:
```typescript
// Add more stats
const customStats = [
  ...stats,
  { id: "visitors", label: "Visitors", value: "5,234", ... }
];

// Change card colors
className="bg-green-100 dark:bg-green-900/20"

// Modify layout
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
```

---

### ProductsView

**Location**: `components/dashboard/ProductsView.tsx`

Product management table with CRUD operations.

**Props**: None

**Features**:
- Sortable table
- Filter button
- Add product button
- Action buttons (view, edit, delete)
- Stock status indicators
- Product images

**Table Columns**:
- Product (image + name)
- Category
- Price
- Stock (with color coding)
- Sales
- Actions

**Customization**:
```typescript
// Add columns
<th>Rating</th>
<td>{product.rating}</td>

// Change stock threshold
{product.stock < 50 ? 'text-red-600' : 'text-green-600'}
// Adjust 50 to your threshold

// Add bulk actions
<button>Select All</button>
<button>Bulk Delete</button>
```

---

### OrdersView

**Location**: `components/dashboard/OrdersView.tsx`

Order management table with status tracking.

**Props**: None

**Features**:
- Order listing table
- Export button
- Status badges
- Date display
- Action menu

**Status Colors**:
- `completed` - Green
- `processing` - Blue
- `pending` - Yellow
- `cancelled` - Red

**Customization**:
```typescript
// Add filters
<select onChange={handleStatusFilter}>
  <option value="all">All Orders</option>
  <option value="pending">Pending</option>
  <option value="completed">Completed</option>
</select>

// Add date range picker
<input type="date" onChange={handleStartDate} />
<input type="date" onChange={handleEndDate} />

// Customize status colors
const statusColors = {
  completed: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  // ... more statuses
};
```

---

## Utility Components

### StatCard

Reusable stat card component (extracted from OverviewView).

**Usage**:
```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
>
  <div className="flex items-center justify-between mb-4">
    <div className="p-3 rounded-lg bg-green-100">
      <Icon className="h-6 w-6 text-green-600" />
    </div>
    <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
      <TrendingUp className="h-4 w-4" />
      <span>+20.1%</span>
    </div>
  </div>
  <h3 className="text-2xl font-bold text-slate-900">$45,231</h3>
  <p className="text-sm text-slate-500">Total Revenue</p>
</motion.div>
```

### StatusBadge

Reusable status badge component.

**Usage**:
```typescript
<span className={`px-2 py-1 text-xs rounded-full ${
  status === 'completed' ? 'bg-green-100 text-green-700' :
  status === 'processing' ? 'bg-blue-100 text-blue-700' :
  status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
  'bg-red-100 text-red-700'
}`}>
  {status}
</span>
```

### ActionButton

Reusable action button component.

**Usage**:
```typescript
<button className="p-1 hover:bg-slate-100 rounded transition-colors">
  <Icon className="h-4 w-4 text-slate-600" />
</button>
```

---

## Animation Patterns

### Fade In
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### Slide In
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### Hover Scale
```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
  {content}
</motion.div>
```

### Sidebar Slide
```typescript
<motion.div
  animate={{
    x: isOpen ? 0 : -320,
    width: isCollapsed ? 112 : 288
  }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
  {content}
</motion.div>
```

---

## Styling Patterns

### Card
```typescript
className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700"
```

### Button Primary
```typescript
className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-colors text-sm font-medium text-white"
```

### Button Secondary
```typescript
className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
```

### Input
```typescript
className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
```

### Table Header
```typescript
className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400"
```

### Table Row
```typescript
className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50"
```

---

## Creating New Components

### Template

```typescript
"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface MyComponentProps {
  // Define props
}

export function MyComponent({ }: MyComponentProps) {
  // State
  const [state, setState] = React.useState();

  // Handlers
  const handleAction = () => {
    // Logic
  };

  // Render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700"
    >
      {/* Content */}
    </motion.div>
  );
}
```

### Best Practices

1. **Use TypeScript** - Define interfaces for props
2. **Add "use client"** - For interactive components
3. **Include animations** - Use Framer Motion
4. **Support dark mode** - Add dark: variants
5. **Make responsive** - Use Tailwind breakpoints
6. **Add loading states** - Show loading indicators
7. **Handle errors** - Display error messages
8. **Optimize performance** - Use React.memo if needed

---

## Component Testing

### Manual Testing Checklist

- [ ] Component renders without errors
- [ ] Props work as expected
- [ ] Animations are smooth
- [ ] Responsive on all screen sizes
- [ ] Dark mode works correctly
- [ ] Hover states are visible
- [ ] Click handlers work
- [ ] Loading states display
- [ ] Error states display
- [ ] Accessibility (keyboard navigation)

### Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## Performance Tips

1. **Lazy load heavy components**
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

2. **Memoize expensive calculations**
```typescript
const expensiveValue = useMemo(() => calculate(), [deps]);
```

3. **Optimize images**
```typescript
<Image src={url} width={100} height={100} quality={75} />
```

4. **Debounce search**
```typescript
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

---

## Accessibility

### ARIA Labels
```typescript
<button aria-label="Toggle sidebar">
  <Menu />
</button>
```

### Keyboard Navigation
```typescript
<button
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Action
</button>
```

### Focus States
```typescript
className="focus:outline-none focus:ring-2 focus:ring-pink-500"
```

---

**Need help?** Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)
