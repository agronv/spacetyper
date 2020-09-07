export default class Audio {
  constructor() {
    this.audio = document.createElement("audio");
    this.audio.src = "https://notefloat.s3.amazonaws.com/Synthwave_D.mp3";
    this.audio.loop = true;
    this.lowVolume = 0.5;
    this.highVolume = 1.0;
    this.audio.volume = this.lowVolume;

    this.volumeIcon = document.getElementById('volume');
    this.volumeIcon.onclick = this.onClick.bind(this);
  }

  onClick() {
    console.log(this.audio.muted)
    this.audio.muted = !this.audio.muted;
    if (this.audio.muted) {
      this.volumeIcon.src = "./public/images/mute.png"
    } else {
      this.volumeIcon.src = "./public/images/volume.png"
    }
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  swing(p) {
    return 0.5 - Math.cos(p * Math.PI) / 2;
  }

  async adjustVolume(newVolume) {
    const duration = 2000
    const interval = 5
    const originalVolume = this.audio.volume;
    const delta = newVolume - originalVolume;

    if (delta === 0) return Promise.resolve();

    const ticks = Math.floor(duration / interval);
    let tick = 1;
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        this.audio.volume = originalVolume + (
          this.swing(tick / ticks) * delta
        );
        tick += 1
        if (tick === ticks) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  }

  lowerVolume() {
    this.adjustVolume(this.lowVolume)
  }

  raiseVolume() {
    this.adjustVolume(this.highVolume)
  }
}
