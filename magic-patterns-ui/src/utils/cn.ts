import { twMerge } from 'tailwind-merge';

type ClassValue = string | number | null | undefined | false | ClassValue[];

function flatten(value: ClassValue): string[] {
  if (!value && value !== 0) return [];
  if (Array.isArray(value)) return value.flatMap(flatten);
  return [String(value)];
}

/** Conditional class joiner with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(inputs.flatMap(flatten).join(' '));
}