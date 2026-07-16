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
 * becomes visible/active again (tab refocused, app reopened
 * from home screen/background, phone unlocked, network back
 * online, etc). Mobile browsers — especially iOS Safari
 * "Add to Home Screen" apps — aggressively suspend
 * setInterval/setTimeout while a page is backgrounded, and
 * are inconsistent about which resume event actually fires.
 * So we listen to several signals at once rather than relying
 * on just one.
 *
 * Returns a cleanup function that cancels all pending timers
 * and removes the resume listeners.
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
    // visibilitychange fires for both "visible" and "hidden" —
    // only act on the "became visible again" case. The other
    // listeners (focus/pageshow/online) don't have that ambiguity.
    if (document.visibilityState !== undefined && document.visibilityState !== "visible") {
      return;
    }

    // Fetch immediately on resume, then restart the aligned
    // schedule from now — don't wait for whatever boundary was
    // calculated before the page got backgrounded/suspended.
    callback();
    scheduleAligned();
  }

  callback();
  scheduleAligned();

  document.addEventListener("visibilitychange", handleResume);
  window.addEventListener("focus", handleResume);
  window.addEventListener("pageshow", handleResume);
  window.addEventListener("online", handleResume);

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    document.removeEventListener("visibilitychange", handleResume);
    window.removeEventListener("focus", handleResume);
    window.removeEventListener("pageshow", handleResume);
    window.removeEventListener("online", handleResume);
  };
}