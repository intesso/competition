export const isMobile = ('ontouchstart' in window)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enterFullscreen (element: any) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  }
  if (element.msRequestFullscreen) { // for IE11 (remove June 15, 2022)
    element.msRequestFullscreen()
  }
  if (element.webkitRequestFullscreen) { // iOS Safari
    element.webkitRequestFullscreen()
  }
}

export function vibrate (duration = 200) {
  // test vibration support
  if ('vibrate' in navigator) {
    navigator.vibrate(duration)
  } else if ('mozVibrate' in navigator) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).mozVibrate(duration)
  } else if ('webkitVibrate' in navigator) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).webkitVibrate(duration)
  } else if ('msVibrate' in navigator) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).msVibrate(duration)
  }
}
