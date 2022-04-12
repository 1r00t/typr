export class Timer {
  isRunning: boolean;
  startTime: number;
  overallTime: number;
  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.overallTime = 0;
  }

  _getTimeElapsedSinceLastStart(): number {
    if (!this.startTime) {
      return 0;
    }
    return Date.now() - this.startTime;
  }

  start() {
    if (this.isRunning) {
      console.error('Timer is already running');
    }
    this.isRunning = true;
    this.startTime = Date.now();
  }

  stop() {
    if (!this.isRunning) {
      console.error('Timer is already stopped');
    }
    this.isRunning = false;
    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
  }

  reset() {
    this.overallTime = 0;
    this.isRunning = false;
    this.startTime = 0;
  }

  getTime(): number {
    if (!this.startTime) {
      return 0;
    }
    if (this.isRunning) {
      return this.overallTime + this._getTimeElapsedSinceLastStart();
    }
    return this.overallTime;
  }
}