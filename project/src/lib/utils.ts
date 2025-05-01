import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    // In a real app, this would generate an actual thumbnail
    // For now, we'll mock it with a timeout
    setTimeout(() => {
      resolve("https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
    }, 500);
  });
}

export function simulateProcessing<T>(result: T, timeMs = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, timeMs);
  });
}

export function calculateOffsetInTimeline(
  xPosition: number, 
  timelineWidth: number, 
  duration: number
): number {
  const percentage = Math.max(0, Math.min(1, xPosition / timelineWidth));
  return percentage * duration;
}

export function generateMockAudioWaveform(duration: number, pointCount = 100): number[] {
  const waveform = [];
  for (let i = 0; i < pointCount; i++) {
    // Generate random values with a pattern
    const base = Math.sin(i / 10) * 0.5 + 0.5;
    const random = Math.random() * 0.3;
    waveform.push(base + random);
  }
  return waveform;
}