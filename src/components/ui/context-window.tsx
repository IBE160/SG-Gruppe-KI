// src/components/ui/context-window.tsx
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Assuming shadcn/ui dialog components

export function ContextWindow() {
  const [mood, setMood] = React.useState("");
  const [energy, setEnergy] = React.useState(50); // Scale 0-100
  const [soreness, setSoreness] = React.useState<string[]>([]); // Array of strings for chips
  const [notes, setNotes] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitting context:", { mood, energy, soreness, notes });
    // TODO: Implement actual API call to POST /api/v1/daily_context
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Open Context Window</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Check-In</DialogTitle>
          <DialogDescription>How are you feeling today?</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="mood" className="text-right">
              Mood
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="col-span-3 border p-2 rounded-md"
            >
              <option value="">Select your mood</option>
              <option value="happy">Happy 😊</option>
              <option value="neutral">Neutral 😐</option>
              <option value="sad">Sad 😞</option>
              <option value="stressed">Stressed 😫</option>
              <option value="motivated">Motivated 💪</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="energy" className="text-right">
              Energy
            </label>
            <input
              type="range"
              id="energy"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="col-span-3"
            />
            <span className="col-span-1 text-center">{energy}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label id="soreness-label" className="text-right">
              Soreness
            </label>
            <div role="group" aria-labelledby="soreness-label" className="col-span-3 flex flex-wrap gap-2">
              {["Legs", "Arms", "Chest", "Back", "Core"].map((part) => (
                <button
                  key={part}
                  type="button"
                  className={`px-3 py-1 border rounded-full ${
                    soreness.includes(part) ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() =>
                    setSoreness((prev) =>
                      prev.includes(part)
                        ? prev.filter((item) => item !== part)
                        : [...prev, part]
                    )
                  }
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3 border p-2 rounded-md"
              rows={3}
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md mt-4">
            Submit Context
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
