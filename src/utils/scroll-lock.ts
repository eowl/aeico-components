let lockCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

export function acquireScrollLock(): void {
  if (lockCount === 0) {
    const body = document.body;
    savedOverflow = body.style.overflow;
    savedPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `calc(${savedPaddingRight || '0px'} + ${scrollbarWidth}px)`;
    }
  }
  lockCount++;
}

export function releaseScrollLock(): void {
  if (lockCount === 0) return;
  lockCount--;
  if (lockCount === 0) {
    const body = document.body;
    body.style.overflow = savedOverflow;
    body.style.paddingRight = savedPaddingRight;
    savedOverflow = '';
    savedPaddingRight = '';
  }
}
