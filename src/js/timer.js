class Timer {
  constructor() {
    this.time = 0;
    this.isTimerOn = false;
    this.tickTimer = this.tickTimer.bind(this);
  }

  turnOn() {
    debugger
    this.resetTimer();
    this.isTimerOn = true;
    this.interval = setInterval(this.tickTimer, 10);
  }

  turnOff() {
    this.isTimerOn = false;
    clearInterval(this.interval);
  }

  tickTimer() {
    if (this.isTimerOn) this.time += 1;
    document.getElementById('timer').innerHTML = this.parseTime();
  }

  resetTimer() {
    this.time = 0;
  }

  parseTime(time = this.time) {
    let milliseconds = parseInt(time % 100),
      seconds = parseInt((time / 100) % 60),
      minutes = parseInt((time / (100 * 60)) % 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

    return (minutes > 0 ? minutes + ":" : "") + seconds + ":" + milliseconds;
  }
}

export default Timer;