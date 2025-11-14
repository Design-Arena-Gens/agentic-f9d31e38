// Audio context for ASMR sounds
let audioContext;
let isPlaying = false;
let animationInterval;
let cutProgress = 0;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const volumeSlider = document.getElementById('volume');
const cuttingArm = document.getElementById('cuttingArm');
const knife = document.getElementById('knife');
const cutLine = document.getElementById('cutLine');
const sparklesContainer = document.getElementById('sparkles');

// Initialize audio context on user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Create glass cutting ASMR sound
function playGlassCuttingSound(duration = 0.3) {
    if (!audioContext) return;

    const volume = volumeSlider.value / 100;

    // Oscillator for glass resonance
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Glass-like frequency
    oscillator.frequency.setValueAtTime(2000 + Math.random() * 1000, audioContext.currentTime);
    oscillator.type = 'sine';

    // High-pass filter for crisp sound
    filterNode.type = 'highpass';
    filterNode.frequency.setValueAtTime(1500, audioContext.currentTime);

    // Soft, ASMR-friendly envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Create soft ambient background
function playAmbientSound() {
    if (!audioContext) return;

    const volume = volumeSlider.value / 100;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(100 + Math.random() * 50, audioContext.currentTime);
    oscillator.type = 'sine';

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(300, audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume * 0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
}

// Create sparkle effect
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';

    const tx = (Math.random() - 0.5) * 50;
    const ty = (Math.random() - 0.5) * 50;
    sparkle.style.setProperty('--tx', tx + 'px');
    sparkle.style.setProperty('--ty', ty + 'px');

    sparklesContainer.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Animate cutting
function animateCutting() {
    cutProgress += 2;

    if (cutProgress > 160) {
        cutProgress = 0;
    }

    // Update cut line
    cutLine.setAttribute('y2', 40 + cutProgress);

    // Create sparkles along the cut
    if (cutProgress > 0 && Math.random() > 0.7) {
        const sparkleX = 145 + Math.random() * 10;
        const sparkleY = 40 + cutProgress;
        createSparkle(sparkleX, sparkleY);
    }

    // Play sound periodically
    if (cutProgress % 20 === 0) {
        playGlassCuttingSound();
    }
}

// Start ASMR experience
function startExperience() {
    initAudio();
    isPlaying = true;

    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';

    // Add cutting animation to arm
    cuttingArm.classList.add('cutting-animation');
    knife.classList.add('cutting-animation');

    // Start animation loop
    animationInterval = setInterval(() => {
        animateCutting();

        // Play ambient sound occasionally
        if (Math.random() > 0.95) {
            playAmbientSound();
        }
    }, 50);
}

// Stop ASMR experience
function stopExperience() {
    isPlaying = false;

    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';

    // Remove cutting animation
    cuttingArm.classList.remove('cutting-animation');
    knife.classList.remove('cutting-animation');

    // Clear animation
    clearInterval(animationInterval);

    // Reset cut line
    cutProgress = 0;
    cutLine.setAttribute('y2', 40);
}

// Event listeners
startBtn.addEventListener('click', startExperience);
stopBtn.addEventListener('click', stopExperience);

// Volume control
volumeSlider.addEventListener('input', (e) => {
    // Volume is applied in sound generation functions
});

// Initial sparkle effect on load
setTimeout(() => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createSparkle(
                150 + Math.random() * 100,
                100 + Math.random() * 50
            );
        }, i * 200);
    }
}, 500);
