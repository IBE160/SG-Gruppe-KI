import React, { useEffect } from 'react';
import Image from 'next/image';
import { useDashboardStore } from '@/store/dashboardStore'; // Import the Zustand store

export default function MetricsDisplay() {
  const { dashboardData, loading, error, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <div className="p-4 text-white">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-4 text-white">No dashboard data available.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Goal Progress Widget */}
      <div className="flex flex-col gap-3 p-4 rounded-lg bg-card-dark col-span-2">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-white text-base font-medium leading-normal">Goal: {dashboardData.goal_progress.name}</p>
          <p className="text-white/70 text-sm font-normal leading-normal">{dashboardData.goal_progress.current}{dashboardData.goal_progress.unit} / {dashboardData.goal_progress.target}{dashboardData.goal_progress.unit}</p>
        </div>
        <div className="rounded-full bg-primary/20 h-2">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${(dashboardData.goal_progress.current / dashboardData.goal_progress.target) * 100}%` }}></div>
        </div>
      </div>

      {/* Workout Streak Widget */}
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-card-dark items-center justify-center aspect-square">
        <span className="material-symbols-outlined text-primary text-4xl">local_fire_department</span>
        <p className="text-white text-2xl font-bold">{dashboardData.workout_streak.days} Days</p>
        <p className="text-white/70 text-sm">Workout Streak</p>
      </div>

      {/* Weekly Volume Widget */}
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-card-dark justify-between aspect-square">
        <div>
          <p className="text-white text-base font-medium">Weekly Volume</p>
          <p className="text-white/70 text-sm">Last 7 days</p>
        </div>
        <Image
          alt="Line chart showing weekly workout volume increasing over the past 7 days"
          src={dashboardData.weekly_volume.chart_data_url}
          width={100} // Example width, adjust as needed
          height={50} // Example height, adjust as needed
          className="w-full h-auto object-contain -ml-2 -mb-2"
        />
      </div>

      {/* Today's Context Widget */}
      <div className="col-span-2 flex flex-col gap-3 p-4 rounded-lg bg-card-dark">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
          <p className="text-white font-medium">Today's Context</p>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          {dashboardData.todays_context.message}
        </p>
      </div>

      {/* Recent Workouts Widget */}
      <div className="col-span-2 flex flex-col gap-3 p-4 rounded-lg bg-card-dark">
        <p className="text-white text-base font-medium">Recent Workouts</p>
        <div className="flex flex-col gap-3">
          {dashboardData.recent_workouts.map((workout, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between items-center">
                <p className="text-white">{workout.name}</p>
                <p className="text-white/50 text-sm">{workout.date}</p>
              </div>
              {index < dashboardData.recent_workouts.length - 1 && (
                <div className="w-full h-px bg-white/10"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
