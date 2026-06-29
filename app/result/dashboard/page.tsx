import { redirect } from 'next/navigation'

// Legacy URL — redirect to canonical dashboard route
export default function OldDashboardPage() {
  redirect('/dashboard')
}
