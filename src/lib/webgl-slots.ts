// Shared WebGL context slot pool — capped at MAX_SLOTS across all canvases in the app.
// Both ProjectCard previews and ModelViewer acquire slots from this same pool so the
// browser never exceeds its hardware WebGL context limit.

export const MAX_SLOTS = 8;

let usedSlots = 0;
const waitQueue: Array<() => void> = [];

export function acquireWebGLSlot(onReady: () => void): () => void {
  if (usedSlots < MAX_SLOTS) {
    usedSlots++;
    onReady();
    return () => releaseWebGLSlot(onReady);
  }
  waitQueue.push(onReady);
  return () => releaseWebGLSlot(onReady);
}

function releaseWebGLSlot(cb: () => void) {
  const idx = waitQueue.indexOf(cb);
  if (idx >= 0) {
    // Was still waiting — remove from queue, nothing to release
    waitQueue.splice(idx, 1);
  } else {
    usedSlots = Math.max(0, usedSlots - 1);
    const next = waitQueue.shift();
    if (next) {
      usedSlots++;
      next();
    }
  }
}
