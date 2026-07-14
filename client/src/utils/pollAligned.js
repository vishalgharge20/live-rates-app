/**
 * pollAligned
 * ------------------------------------------------------
 * Runs `callback` immediately, then keeps calling it every
 * `intervalMs`, aligned to wall-clock boundaries (e.g. every
 * 15s means always at :00, :15, :30, :45 of the minute) —
 * NOT just "every 15s after this function was called."
 *
 * This is what makes the public page and admin panel refresh
 * at the same real-world moment even if they were opened at
 * different times, instead of each drifting on its own
 * independent timer.
 *
 * Returns a cleanup function that cancels all pending timers.
 * ------------------------------------------------------
 */
export function pollAligned(callback, intervalMs) {
  let timeoutId;
  let intervalId;
  let cancelled = false;

  const msIntoCurrentWindow = Date.now() % intervalMs;
  const msUntilNextBoundary = intervalMs - msIntoCurrentWindow;

  callback();

  timeoutId = setTimeout(() => {
    if (cancelled) return;
    callback();
    intervalId = setInterval(() => {
      if (!cancelled) callback();
    }, intervalMs);
  }, msUntilNextBoundary);

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
}