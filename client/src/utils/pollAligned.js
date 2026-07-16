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
 * Also re-fires `callback` immediately whenever the page
 * becomes visible again (tab refocused, app reopened from
 * home screen/background, phone unlocked, etc). Mobile
 * browsers aggressively throttle or fully suspend
 * setInterval/setTimeout while a page is backgrounded —
 * especially "Add to Home Screen" apps on iOS — so without
 * this, reopening the app shows stale/dummy data until
 * whatever timer was pending happens to fire (which may be
 * up to `intervalMs` away, or may never fire at all if the
 * timer got suspended).
 *
 * Returns a cleanup function that cancels all pending timers
 * and removes the visibility listeners.
 * ------------------------------------------------------
 */
export function pollAligned(callback, intervalMs) {
  let timeoutId;
  let intervalId;
  let cancelled = false;

  function scheduleAligned() {
    clearTimeout(timeoutId);
    clearInterval(intervalId);

    const msIntoCurrentWindow = Date.now() % intervalMs;
    const msUntilNextBoundary = intervalMs - msIntoCurrentWindow;

    timeoutId = setTimeout(() => {
      if (cancelled) return;
      callback();
      intervalId = setInterval(() => {
        if (!cancelled) callback();
      }, intervalMs);
    }, msUntilNextBoundary);
  }

  function handleResume() {
    if (cancelled) return;
    if (document.visibilityState === "visible") {
      // Fetch immediately on resume, then restart the aligned
      // schedule from now — don't wait for whatever boundary
      // was calculated before the page got backgrounded.
      callback();
      scheduleAligned();
    }
  }

  callback();
  scheduleAligned();

  document.addEventListener("visibilitychange", handleResume);
  window.addEventListener("focus", handleResume);
  window.addEventListener("pageshow", handleResume);

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    document.removeEventListener("visibilitychange", handleResume);
    window.removeEventListener("focus", handleResume);
    window.removeEventListener("pageshow", handleResume);
  };
}