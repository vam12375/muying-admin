# Backend Integration Guide

This guide explains how to integrate the MomBaby Admin Dashboard with your Spring Boot backend.

## Quick Start

1. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. **Update API calls in components**

Replace sample data with real API calls. Example for Products:

```typescript
// components/dashboard/ProductsView.tsx
import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';

export function ProductsView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getList(1, 10);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

## API Endpoints Mapping

### Authentication
| Frontend Function | Backend Endpoint | Method |
|------------------|------------------|--------|
| `authApi.login()` | `/api/admin/login` | POST |
| `authApi.getUserInfo()` | `/api/admin/info` | GET |
| `authApi.logout()` | `/api/admin/logout` | POST |

### Products
| Frontend Function | Backend Endpoint | Method |
|------------------|------------------|--------|
| `productsApi.getList()` | `/api/products` | GET |
| `productsApi.getDetail()` | `/api/products/{id}` | GET |
| `productsApi.create()` | `/api/admin/products` | POST |
| `productsApi.update()` | `/api/admin/products/{id}` | PUT |
| `productsApi.delete()` | `/api/admin/products/{id}` | DELETE |

### Orders
| Frontend Function | Backend Endpoint | Method |
|------------------|------------------|--------|
| `ordersApi.getList()` | `/api/admin/orders` | GET |
| `ordersApi.getDetail()` | `/api/admin/orders/{id}` | GET |
| `ordersApi.updateStatus()` | `/api/admin/orders/{id}/status` | PUT |
| `ordersApi.ship()` | `/api/admin/orders/{id}/ship` | POST |

### Customers
| Frontend Function | Backend Endpoint | Method |
|------------------|------------------|--------|
| `customersApi.getList()` | `/api/admin/users` | GET |
| `customersApi.getDetail()` | `/api/admin/users/{id}` | GET |
| `customersApi.updateStatus()` | `/api/admin/users/{id}/status` | PUT |

### Statistics
| Frontend Function | Backend Endpoint | Method |
|------------------|------------------|--------|
| `statsApi.getDashboard()` | `/api/admin/statistics` | GET |
| `statsApi.getOrderStats()` | `/api/admin/orders/statistics` | GET |

## CORS Configuration

Add CORS configuration to your Spring Boot backend:

```java
// config/CorsConfig.java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000"); // Next.js dev server
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

## Authentication Flow

### 1. Login Component

Create a login page:

```typescript
// app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login(username, password);
      if (response.success) {
        localStorage.setItem('adminToken', response.data.token);
        router.push('/');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

### 2. Protected Routes

Create a middleware to protect routes:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken');
  
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
```

## Data Transformation

Your backend returns data in this format:

```json
{
  "code": 200,
  "message": "Success",
  "data": [...],
  "success": true
}
```

Transform it for the frontend:

```typescript
// Example: Transform product data
const transformProduct = (backendProduct: any) => ({
  id: backendProduct.id.toString(),
  name: backendProduct.name,
  category: backendProduct.categoryName,
  price: backendProduct.price,
  stock: backendProduct.stock,
  sales: backendProduct.salesCount || 0,
  image: backendProduct.imageUrl || backendProduct.mainImage,
});
```

## Real-time Updates with WebSocket

Connect to your WebSocket endpoint for real-time notifications:

```typescript
// lib/websocket.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(token: string) {
    this.ws = new WebSocket(`${this.url}?token=${token}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle incoming messages
      this.handleMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => this.connect(token), 5000);
    };
  }

  private handleMessage(data: any) {
    // Dispatch events based on message type
    switch (data.type) {
      case 'NEW_ORDER':
        // Update order list
        break;
      case 'STOCK_UPDATE':
        // Update product stock
        break;
      // ... more cases
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
```

## Error Handling

Add global error handling:

```typescript
// lib/api.ts
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (response.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## File Upload

Handle file uploads for product images:

```typescript
// components/ImageUpload.tsx
import { useState } from 'react';
import { uploadApi } from '@/lib/api';

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadApi.uploadImage(file);
      if (response.success) {
        onUpload(response.data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
    </div>
  );
}
```

## Testing the Integration

1. **Start your Spring Boot backend**
```bash
cd muying-mall
mvn spring-boot:run
```

2. **Start the Next.js frontend**
```bash
cd muying-admin
npm run dev
```

3. **Test the connection**
- Open browser console
- Check Network tab for API calls
- Verify CORS headers
- Test authentication flow

## Common Issues

### CORS Errors
- Ensure CORS is properly configured in Spring Boot
- Check allowed origins include `http://localhost:3000`

### 401 Unauthorized
- Verify JWT token is being sent in headers
- Check token expiration
- Ensure backend validates tokens correctly

### Data Format Mismatch
- Transform backend data to match frontend interfaces
- Use TypeScript interfaces for type safety

## Next Steps

1. Implement authentication
2. Connect all API endpoints
3. Add loading states
4. Implement error boundaries
5. Add data caching with React Query
6. Set up WebSocket for real-time updates
7. Add unit tests
8. Deploy to production

## Support

For issues or questions, refer to:
- Backend API documentation
- Next.js documentation
- TypeScript documentation
