"use client";

import React from 'react';
import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboardStore'; // Import the Zustand store

export default function WeeklyReview() {
  const { dashboardData, loading, error } = useDashboardStore();

  if (loading || !dashboardData) {
    return null; // Or a loading spinner, or skeleton
  }

  const { weekly_review } = dashboardData;

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'arrow_drop_up' : 'arrow_drop_down';
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-primary' : 'text-[#fa5538]';
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {/* Charts */}
      {/* Volume Chart */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#326744] bg-[#1a3323]/50 p-6">
        <p className="text-white text-base font-medium leading-normal">Volume</p>
        <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">{weekly_review.volume.value}</p>
        <div className="flex gap-1 items-center">
          <p className="text-[#92c9a4] text-base font-normal leading-normal">This Week</p>
          <span className={`material-symbols-outlined ${getTrendColor(weekly_review.volume.trend)} text-lg`}>{getTrendIcon(weekly_review.volume.trend)}</span>
          <p className={`text-base font-medium leading-normal ${getTrendColor(weekly_review.volume.trend)}`}>{weekly_review.volume.percentage_change}</p>
        </div>
        <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4" dangerouslySetInnerHTML={{ __html: weekly_review.volume.chart_svg }}>
        </div>
        <div className="flex justify-around">
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Mon</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Tue</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Wed</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Thu</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Fri</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Sat</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Sun</p>
        </div>
      </div>
      {/* Intensity Chart */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#326744] bg-[#1a3323]/50 p-6">
        <p className="text-white text-base font-medium leading-normal">Intensity</p>
        <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">{weekly_review.intensity.value}</p>
        <div className="flex gap-1 items-center">
          <p className="text-[#92c9a4] text-base font-normal leading-normal">This Week</p>
          <span className={`material-symbols-outlined ${getTrendColor(weekly_review.intensity.trend)} text-lg`}>{getTrendIcon(weekly_review.intensity.trend)}</span>
          <p className={`text-base font-medium leading-normal ${getTrendColor(weekly_review.intensity.trend)}`}>{weekly_review.intensity.percentage_change}</p>
        </div>
        <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4" dangerouslySetInnerHTML={{ __html: weekly_review.intensity.chart_svg }}>
        </div>
        <div className="flex justify-around">
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Mon</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Tue</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Wed</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Thu</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Fri</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Sat</p>
          <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">Sun</p>
        </div>
      </div>
      {/* Consistency Chart */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#326744] bg-[#1a3323]/50 p-6">
        <p className="text-white text-base font-medium leading-normal">Consistency</p>
        <p className="text-white tracking-light text-[32px] font-bold leading-tight truncate">{weekly_review.consistency.value}</p>
        <div className="flex gap-1 items-center">
          <p className="text-[#92c9a4] text-base font-normal leading-normal">This Week</p>
          <span className={`material-symbols-outlined ${getTrendColor(weekly_review.consistency.trend)} text-lg`}>{getTrendIcon(weekly_review.consistency.trend)}</span>
          <p className={`text-base font-medium leading-normal ${getTrendColor(weekly_review.consistency.trend)}`}>{weekly_review.consistency.percentage_change}</p>
        </div>
        <div className="grid min-h-[180px] grid-cols-7 gap-3 items-end justify-items-center py-4 px-3">
          {weekly_review.consistency.chart_data.map((dayData, index) => (
            <div key={index} className="flex flex-col items-center gap-2 w-full h-full justify-end">
              <div className={`${dayData.trained ? 'bg-primary' : 'bg-primary/30'} rounded-t-full w-2/3`} style={{ height: dayData.height_percentage }}></div>
              <p className="text-[#92c9a4] text-[13px] font-bold leading-normal tracking-[0.015em]">{dayData.day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coach's Corner */}
      <div className="flex flex-col px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Coach's Corner</h3>
        </div>
        <p className="text-[#e0e0e0] text-base font-normal leading-normal pb-3 pt-3">
          {weekly_review.coach_corner.message}
        </p>
        <button className="flex items-center justify-center h-12 px-6 rounded-full bg-primary text-background-dark font-bold text-base leading-normal w-full mt-2">
          {weekly_review.coach_corner.suggestion}
        </button>
      </div>
    </div>
  );
}