export const CERTIFICATE_FRAME_COUNT = 600;

export const CERTIFICATE_SCROLL_VH = 2000;

export const certificateFramePath = (n: number) =>
  `/certificates/frames/frame-${String(n).padStart(3, "0")}.jpg`;
