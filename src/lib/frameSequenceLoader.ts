type CachedFrame = {
  image: HTMLImageElement;
  lastUsed: number;
};

export class FrameSequenceLoader {
  private readonly cache = new Map<number, CachedFrame>();
  private readonly loading = new Map<number, HTMLImageElement>();
  private queue: number[] = [];
  private activeLoads = 0;
  private targetIndex = 0;
  private direction = 1;
  private clock = 0;
  private loadedCount = 0;
  private disposed = false;

  constructor(
    private readonly frameCount: number,
    private readonly framePath: (index: number) => string,
    private readonly onFrameLoaded: (index: number, loadedCount: number) => void,
    private readonly concurrency = 4,
    private readonly cacheLimit = 24,
    private readonly lookAhead = 6,
    private readonly lookBehind = 2,
  ) {}

  request(index: number) {
    const target = Math.max(0, Math.min(this.frameCount - 1, Math.round(index)));
    if (target !== this.targetIndex) {
      this.direction = target > this.targetIndex ? 1 : -1;
      this.targetIndex = target;
    }

    const priority = this.getPriorityWindow();
    this.queue = priority.filter(
      (frameIndex) =>
        !this.cache.has(frameIndex) && !this.loading.has(frameIndex),
    );
    this.pump();

    return this.getNearest(target);
  }

  getNearest(index: number) {
    let nearest: CachedFrame | undefined;
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    for (const [frameIndex, frame] of this.cache) {
      const distance = Math.abs(frameIndex - index);
      if (
        distance < nearestDistance ||
        (distance === nearestDistance && frameIndex < nearestIndex)
      ) {
        nearest = frame;
        nearestIndex = frameIndex;
        nearestDistance = distance;
      }
    }

    if (nearest) nearest.lastUsed = ++this.clock;
    return nearest?.image;
  }

  dispose() {
    this.disposed = true;
    this.queue = [];
    this.cache.clear();
    this.loading.clear();
  }

  private getPriorityWindow() {
    const indices = [this.targetIndex];

    for (let offset = 1; offset <= this.lookAhead; offset++) {
      indices.push(this.targetIndex + this.direction * offset);
    }
    for (let offset = 1; offset <= this.lookBehind; offset++) {
      indices.push(this.targetIndex - this.direction * offset);
    }

    return indices.filter(
      (index) => index >= 0 && index < this.frameCount,
    );
  }

  private pump() {
    while (
      !this.disposed &&
      this.activeLoads < this.concurrency &&
      this.queue.length > 0
    ) {
      const index = this.queue.shift();
      if (index === undefined) return;
      if (this.cache.has(index) || this.loading.has(index)) continue;

      const image = new Image();
      this.loading.set(index, image);
      this.activeLoads++;

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (this.loading.get(index) !== image) return;

        this.loading.delete(index);
        this.activeLoads--;

        if (image.naturalWidth > 0 && !this.disposed) {
          this.cache.set(index, { image, lastUsed: ++this.clock });
          this.loadedCount++;
          this.trimCache();
          this.onFrameLoaded(index, this.loadedCount);
        }

        this.pump();
      };

      image.src = this.framePath(index);
      image.decode().then(finish, finish);
    }
  }

  private trimCache() {
    const protectedFrames = new Set(this.getPriorityWindow());
    while (this.cache.size > this.cacheLimit) {
      let oldestIndex = -1;
      let oldestUse = Infinity;

      for (const [index, frame] of this.cache) {
        if (protectedFrames.has(index)) continue;
        if (frame.lastUsed < oldestUse) {
          oldestIndex = index;
          oldestUse = frame.lastUsed;
        }
      }

      if (oldestIndex < 0) return;
      this.cache.delete(oldestIndex);
    }
  }
}
