// apps/web/src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { ContextWindow } from '@/components/ContextWindow/ContextWindow';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark text-white p-4">
      {/* TODO: The dashboard should have a more complex layout, but for now we are just rendering the ContextWindow for the E2E test */}
      <ContextWindow />
    </div>
  );
}