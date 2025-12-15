import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { DashboardMetrics, fetchDashboardData } from '@/lib/api/dashboard';

interface DashboardState {
  dashboardData: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    immer((set) => ({
      dashboardData: null,
      loading: false,
      error: null,
      fetchDashboard: async () => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          const data = await fetchDashboardData();
          set((state) => {
            state.dashboardData = data;
            state.loading = false;
          });
        } catch (err) {
          set((state) => {
            state.error = "Failed to load dashboard data.";
            state.loading = false;
          });
          console.error("Error fetching dashboard data:", err);
        }
      },
    })),
    { name: 'DashboardStore' }
  )
);