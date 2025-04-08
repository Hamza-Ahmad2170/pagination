import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function apiFetch(url?: string) {
  return fetch(`https://dummyjson.com/${url ? url : ""}`);
}
