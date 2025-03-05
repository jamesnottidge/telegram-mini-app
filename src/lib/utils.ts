import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price with commas and a maximum of two decimal places
export function formatPrice(value: string | number): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "";

  const [integerPart, decimalPart = "00"] = numValue.toFixed(2).split(".");

  // Format the integer part with commas
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // Ensure the decimal part has exactly two digits
  const formattedDecimalPart =
    decimalPart.length === 1 ? `${decimalPart}0` : decimalPart;

  return `${formattedIntegerPart}.${formattedDecimalPart}`;
}

/**
 * Every error from the API(apart from failed requests) would follow a specific format
 * we can rely on that format and return a formatted error message.
 * This is hypothetical and would depend on the actual API response format
 * @param error The error object from the API raw as it is
 * @returns The formatted error message
 */
export async function formatApiError(error: Response) {
  try {
    const err = await error.json();
    return err.message;
  } catch (e) {
    const err = error.statusText;
    return err ?? e;
  }
}

export function fetchLocalStorageItem(key: string) {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item);
    } catch {}
  }
  return null;
}

export function setLocalStorageItem(key: string, value: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
