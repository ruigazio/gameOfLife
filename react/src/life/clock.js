var Clock;

Clock = (function() {
  function Clock(sampleSize) {
    this.frame = 0;
    this.worst = 0;
    this.marker = performance.now();
    this.avgSample = new Uint16Array(sampleSize);
    this.sampleIdx = 0;
    this.sampleSize = sampleSize;
    this.average = 0;
    this.avgTotal = 0;
    this.cycleComplete = false;
  }

  Clock.prototype.stop = function() {
    this.cycleComplete = false;
    this.worst = 0;
    this.avgSample.fill(0);
    this.avgTotal = 0;
    this.marker = 0;
    this.sampleIdx = 0;
    return this.average = 0;
  };

  Clock.prototype.start = function() {
    return this.marker = performance.now();
  };

  Clock.prototype.mark = function() {
    var frameSlot, previous;
    previous = this.marker;
    this.marker = performance.now();
    this.frame = Math.floor(this.marker - previous);
    frameSlot = this.avgSample[this.sampleIdx];
    this.avgSample[this.sampleIdx] = this.frame;
    this.avgTotal += this.frame - frameSlot;
    if (this.cycleComplete) {
      this.average = Math.floor(this.avgTotal / this.sampleSize);
    }
    if (this.frame > this.worst) {
      this.worst = this.frame;
    }
    this.sampleIdx++;
    return (this.sampleIdx %= this.sampleSize) || (this.worst = 0, this.cycleComplete = true);
  };

  Clock.prototype.getFPS = function() {
    return this.functor(function(time) {
      return Math.floor(1 / (time / 1000));
    });
  };

  Clock.prototype.getTimes = function() {
    return this.functor(function(time) {
      return time;
    });
  };

  Clock.prototype.functor = function(f) {
    return {
      frame: f(this.frame),
      worst: f(this.worst),
      average: f(this.average)
    };
  };

  return Clock;

})();

module.exports = Clock;
