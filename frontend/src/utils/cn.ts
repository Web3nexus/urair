import { clsx, type ClassValue } from 'clsx'

/**
 * Merge Tailwind class names conditionally.
 *
 * @example
 * cn('base-class', isActive && 'active-class', { 'conditional': condition })
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
