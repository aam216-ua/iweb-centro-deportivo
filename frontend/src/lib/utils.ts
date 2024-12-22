import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randImage(): string {
  const images: string[] = ["/golf.jpg", "/tennis.jpg", "/tennis2.jpg"]
  return randChoice(images)
}
