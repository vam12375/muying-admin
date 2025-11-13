import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 获取 token（从 cookie 或 localStorage，这里我们检查路径）
  const { pathname } = request.nextUrl;
  
  // 公开路径，不需要认证
  const publicPaths = ['/login'];
  
  // 如果是公开路径，直接放行
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // 对于其他路径，暂时放行（因为 token 在 localStorage 中，无法在服务端检查）
  // 实际的认证检查会在客户端组件中进行
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
