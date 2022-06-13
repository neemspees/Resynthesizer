const HEIGH_MAX = 1080 * 2;
const WIDTH_MIN = 0;
const WIDTH_MAX = 1920;
const FREQUENCY_MIN = 16.35;
const FREQUENCY_MAX = 246.9;

const context = new AudioContext()

const gainNode = context.createGain();
gainNode.connect(context.destination);

const oscillators = [];

for (let i = 0; i < 2; i++) {
  const oscillator = context.createOscillator();
  oscillator.type = 'triangle';
  oscillator.connect(gainNode);
  oscillators.push(oscillator);
}

const updateFrequency = () => {
  const widthRange = WIDTH_MAX - WIDTH_MIN;
  const frequencyRange = FREQUENCY_MAX - FREQUENCY_MIN;
  const frequency = FREQUENCY_MIN + (frequencyRange / widthRange) * Math.min(window.innerWidth, WIDTH_MAX);

  const time = context.currentTime + .0001;

  for (const i in oscillators) {
    const frequencyMultiplier = 2 ** i;
    oscillators[i].frequency.setValueAtTime(frequency + (frequency * frequencyMultiplier), time);
  }
};

const updateGain = () => {
  gainNode.gain.value = Math.min(window.innerHeight, 1080) / HEIGH_MAX;
};

const updateColor = () => {
  const color1 = Math.min(window.innerWidth, WIDTH_MAX) / WIDTH_MAX * 255;
  const color2 = Math.min(window.innerHeight, HEIGH_MAX) / HEIGH_MAX * 255;
  document.body.style.backgroundColor = `rgb(${color1},${color2},${255 - color2})`;
};

const update = () => {
  updateGain();
  updateFrequency();
  updateColor();
};

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
  update();

  for (const oscillator of oscillators) {
    oscillator.start();
  }
});

window.addEventListener('resize', () => {
  update();
});

update();
