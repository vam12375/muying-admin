/**
 * 根路由 - 重定向到 dashboard
 */

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
