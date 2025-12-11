// apps/web/src/app/dashboard/loading.tsx
import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark text-white p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-lg">Loading dashboard...</p>
    </div>
  );
}
