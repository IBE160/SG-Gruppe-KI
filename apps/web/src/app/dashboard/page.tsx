import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MetricsDisplay from '@/components/Dashboard/MetricsDisplay';
import WeeklyReview from '@/components/Dashboard/WeeklyReview'; // Import WeeklyReview

export default function DashboardPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark dark group/design-root overflow-x-hidden">
      <div className="flex-1 pb-28">
        {/* Top App Bar */}
        <div className="flex items-center bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
          <div className="flex size-12 shrink-0 items-center justify-start">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User's profile picture"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQErvFjyzX5lgQRyqBM8MbaqzhAd_xTX9wYNq67fdqqtQFwsWnSuztvD2KXviJEBBdO1fXhYrVbd7AwzDTZscM24LHe_MoxkHucZmCwU-jmHAUyMaWTLETI8wX0iUNJ9wbKWIeX_gGg5M5NvcW5664OxnKY4GCXboHSfj_5c7DYM9rbhh5ichGMEzfXa8Sro8Y0iUNJ9wbKWIeX_gGg5M5NvcW5664OxnKY4GCXboHSfj_5c7DYM9rbhh5ichGMEzfXa8Sro8Y0xXuSdIj7oo1sXJvbK2driNOAU2MNQAQq4GiID5rQp8ZIPuKPCUIXgtWKW0DrgrV2mSsvN9mGBnH")' }}
            ></div>
          </div>
          <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Dashboard</h1>
          <div className="flex w-auto items-center justify-end">
            <button className="text-background-dark bg-primary text-sm font-bold leading-normal tracking-[0.015em] shrink-0 px-4 py-2 rounded-full">
              Generate Plan
            </button>
          </div>
        </div>

        {/* Celebrate Your Wins Section */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Celebrate Your Wins</h2>
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 pr-1">
          <div className="flex items-stretch gap-3">
            <div className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-60 bg-card-dark p-4">
              <div
                className="w-full bg-center bg-no-repeat aspect-[1.5/1] bg-cover rounded-lg flex flex-col"
                data-alt="Abstract graphic of a barbell"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjgFXYXkucz7B8jbRGgSApzLguMHpmA6o3oUzPUVbhg9rVNTmwXxIYMl3rD89yFB6JKLWBuiKULLhXpUt7fNgE1NKjsZZ_VsqBkcIYxtvYxNhgvPREwa79VPhxMMzg7ive3_cXiDEgp7gszptq97bYvic8uVDvkqJff8k4hOUiDapwK1k9TCUv_9OqLwZGP4Mp1QpROmaP_HtWlV4jRnR4ksIi4RRKfWh0B5xymw2Uq26DbMqPdtAm-oer-zIzPpCjqFaWQnIcaOCKOl0xDbjJ_B3jtZk7oCBTV_cjdV9izKhC8kmdbAnO0lV_0e_amNrhR63b062F")' }}
              ></div>
              <div>
                <p className="text-white text-base font-medium leading-normal">New PR: Squat!</p>
                <p className="text-primary text-sm font-normal leading-normal">You lifted 120kg!</p>
              </div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-60 bg-card-dark p-4">
              <div
                className="w-full bg-center bg-no-repeat aspect-[1.5/1] bg-cover rounded-lg flex flex-col"
                data-alt="Graphic with a flame icon"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdYzDDFg8U2ghHuopG4QBHdseC3ixdPCM04Cmp25gaCjevHIWl-q9kZt5iep50O6hO4ltmXUfVEn13InLA8tKkeaARO3J2reUzYOizDfZeY7dl-D7x4i4XnG63sCl7Dvuy7cuEFJcTdV0UNlPh1yNHoz4Ue9DLP_Q5zXQ7ER7hBqqQovM-jKhwTOWN6hRAKyoxyqjJMgdmjTwS_cvmrXP96HJ7ltda6O7PrrWrpXuP7qUrJ7CL0MVn1RjT0wkaxxbHJpctvoUlWJ7s")' }}
              ></div>
              <div>
                <p className="text-white text-base font-medium leading-normal">5 Day Streak!</p>
                <p className="text-primary text-sm font-normal leading-normal">Keep the fire going!</p>
              </div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-60 bg-card-dark p-4 mr-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-[1.5/1] bg-cover rounded-lg flex flex-col"
                data-alt="Graphic of a medal"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9B1Ocx5sJIJyHOMQf1ZkF1jCPIhj5IsIcpoLSNOXLESbbwWApWfkCqvt8-G2M9wbKTfsYeedujWj99O9zHoaNXk9yLGFvua-jWnbpb7Afe5FtmL8eK6rC0aD5yYwH7EZDUagTmW1gLEp0_aymu4x9zS1FNDUbfhJkw4V6FxUyJOklMeJZPsa0lr9oVQske3y8tzYtlHoXvFH4fe91XyfONgrIlimO4Ro9Va9iimbjd3uOHXPYCxFC1ADLyg-ECacH5ZtkfQzG-8gn")' }}
              ></div>
              <div>
                <p className="text-white text-base font-medium leading-normal">50 Workouts Logged</p>
                <p className="text-primary text-sm font-normal leading-normal">Consistency is key!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Widgets Section */}
        <div className="flex items-center justify-between px-4 pb-3 pt-8">
          <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Your Widgets</h2>
          <button className="flex items-center justify-center size-8 rounded-full text-white/70 hover:bg-white/10">
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
        </div>

        {/* Widget Grid */}
        <MetricsDisplay />

        {/* Weekly Review Section */}
        <WeeklyReview />

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around items-center h-20 px-4">
          <div className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined fill">dashboard</span>
            <span className="text-xs font-medium">Dashboard</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-white/70">
            <span className="material-symbols-outlined">play_circle</span>
            <span className="text-xs font-medium">Workout</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-white/70">
            <span className="material-symbols-outlined">history</span>
            <span className="text-xs font-medium">History</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-white/70">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs font-medium">Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}