// apps/web/src/app/onboarding/time-frequency.tsx
'use client';

import React from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';

interface TimeFrequencyProps {
  onNext: () => void;
  onBack: () => void;
}

const TimeFrequency: React.FC<TimeFrequencyProps> = ({ onNext, onBack }) => {
  const { trainingFrequency, setTrainingFrequency, trainingDuration, setTrainingDuration } = useOnboardingStore();

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrainingFrequency(Number(event.target.value));
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrainingDuration(Number(event.target.value));
  };

  return (
    <div className="flex flex-col h-full pt-20 pb-28"> {/* Adjusted padding for header and footer */}
      <div className="mx-auto w-full max-w-md"> {/* Centering wrapper */}
      {/* AI Chat Message */}
      <div className="flex items-end gap-3 p-4">
        <div
          className="aspect-square w-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
          data-alt="AI Trainer avatar with a green gradient"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOb7tQ11MpWso2NVMNBqF-Gkrp7r5LeVAQdoIjKywWm826v8_yNfOJTAjqakGmic6a_Myye24CDcfTGLYjCgv_MDSGxN1aT3QdMDrdM_1Mcd0WR24bflWUoLZSdc6I_nMrS3PFG8xTvMVNNULY4EH3xlig3eth6nvOfrRwmkNfHtLFSFlQP8FV0aG6Xga2efSy2ELY4kthZrWX30ocZjpyVSnm3A-VEZEHOJnZB9BtFROqnXeiRuoPUghJw4fe2rdEZqBTd5-3-F")' }}
        ></div>
        <div className="flex flex-1 flex-col gap-1 items-start">
          <p className="text-[#92c9a4] text-[13px] font-normal leading-normal max-w-[360px]">AI Trainer</p>
          <p className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-[#23482f] text-white">
            Great! How many days a week do you want to train, and for how long per session?
          </p>
        </div>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-6 px-4">
        {/* Days per week Slider */}
        <div className="@container">
          <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4">
            <div className="flex w-full shrink-[3] items-center justify-between">
              <p className="text-white text-base font-medium leading-normal">Days per week</p>
              <p className="text-white text-sm font-normal leading-normal">{trainingFrequency || 4} days</p>
            </div>
            <div className="flex h-4 w-full items-center gap-4">
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={trainingFrequency || 4}
                onChange={handleFrequencyChange}
                className="flex-1 h-1 rounded-sm bg-primary/20 appearance-none cursor-pointer [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Minutes per session Slider */}
        <div className="@container">
          <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4">
            <div className="flex w-full shrink-[3] items-center justify-between">
              <p className="text-white text-base font-medium leading-normal">Minutes per session</p>
              <p className="text-white text-sm font-normal leading-normal">{trainingDuration || 45} min</p>
            </div>
            <div className="flex h-4 w-full items-center gap-4">
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={trainingDuration || 45}
                onChange={handleDurationChange}
                className="flex-1 h-1 rounded-sm bg-primary/20 appearance-none cursor-pointer [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
              />
            </div>
          </div>
        </div>
      </div>

      </div> {/* End Centering wrapper */}
      {/* Sticky Footer with Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background-dark to-transparent p-6">
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex h-16 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/10 text-white gap-2 pl-5 text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="material-symbols-outlined !text-3xl">arrow_back</span>
          </button>
          <button
            onClick={onNext}
            className="flex h-16 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-background-dark gap-2 pl-5 text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="material-symbols-outlined !text-3xl">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TimeFrequency;
