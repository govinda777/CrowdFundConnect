import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function calculateDaysLeft(deadline: number): number {
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, Math.floor((deadline - now) / (24 * 60 * 60)));
}

export function calculatePercentage(current: number, total: number): number {
  return Math.min(100, Math.floor((current / total) * 100));
}
