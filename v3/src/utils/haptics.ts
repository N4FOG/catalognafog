export function triggerHaptic(duration: number = 15): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(duration);
    }
  } catch {
    // Ignore if vibration is not permitted by user agent
  }
}
