function createVideoControls(video) {
  if (video.parentElement.querySelector('.video-controls')) return;

  const controls = document.createElement('div');
  controls.className = 'video-controls';

  let isMuted = localStorage.getItem('isMuted') === 'true';
  video.muted = isMuted;

  const playPauseButton = document.createElement('button');
  playPauseButton.textContent = '▶️';
  playPauseButton.className = 'control-button';
  playPauseButton.onclick = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'progress-bar';

  const progress = document.createElement('div');
  progress.className = 'progress';
  progressBarContainer.appendChild(progress);

  progressBarContainer.addEventListener('click', (e) => {
    const rect = progressBarContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = offsetX / width;
    video.currentTime = percentage * video.duration;
  });

  video.addEventListener('timeupdate', () => {
    const percentage = (video.currentTime / video.duration) * 100;
    progress.style.width = `${percentage}%`;
  });

  const volumeBarContainer = document.createElement('div');
  volumeBarContainer.className = 'volume-bar';

  const volumeLevel = document.createElement('div');
  volumeLevel.className = 'volume-level';
  volumeBarContainer.appendChild(volumeLevel);

  const volumeIcon = document.createElement('span');
  volumeIcon.className = 'volume-icon';
  volumeIcon.textContent = isMuted ? '🔈' : '🔊';

  const globalVolume = parseFloat(localStorage.getItem('globalVolume')) || 0.5;
  video.volume = globalVolume;
  volumeLevel.style.width = `${globalVolume * 100}%`;

  volumeBarContainer.addEventListener('click', (e) => {
    const rect = volumeBarContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = offsetX / width;
    video.volume = percentage;
    volumeLevel.style.width = `${percentage * 100}%`;
    localStorage.setItem('globalVolume', percentage);
    applyGlobalVolume();
  });

  volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    video.muted = isMuted;
    volumeIcon.textContent = isMuted ? '🔈' : '🔊';
    localStorage.setItem('isMuted', isMuted);
  });

  video.addEventListener('volumechange', () => {
    volumeLevel.style.width = `${video.volume * 100}%`;
  });

  video.addEventListener('play', () => {
    video.muted = isMuted;
    volumeIcon.textContent = isMuted ? '🔈' : '🔊';
    playPauseButton.textContent = '⏸️';
  });

  video.addEventListener('pause', () => {
    playPauseButton.textContent = '▶️';
  });

  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPauseButton.textContent = '⏸️';
    } else {
      video.pause();
      playPauseButton.textContent = '▶️';
    }
  });

  const controlBarContainer = document.createElement('div');
  controlBarContainer.className = 'control-bar-container';
  controlBarContainer.appendChild(playPauseButton);
  controlBarContainer.appendChild(progressBarContainer);
  controlBarContainer.appendChild(volumeIcon);
  controlBarContainer.appendChild(volumeBarContainer);

  controls.appendChild(controlBarContainer);

  video.parentElement.style.position = 'relative';
  video.parentElement.appendChild(controls);

  video.parentElement.addEventListener('mouseover', () => {
    controls.style.display = 'flex';
  });

  video.parentElement.addEventListener('mouseout', () => {
    controls.style.display = 'none';
  });

  video.addEventListener('play', () => {
    video.volume = parseFloat(localStorage.getItem('globalVolume')) || 0.5;
    video.muted = isMuted;
    volumeIcon.textContent = isMuted ? '🔈' : '🔊';
  });
}

function removeInstagramElements() {
  const interval = setInterval(() => {
    const classNames = ['_acan', '_acao', '_acas', '_aj1-', '_ap30'];
    classNames.forEach(className => {
      const elements = document.querySelectorAll(`.${className}`);
      elements.forEach(element => element.style.display = 'none');
    });
  }, 1000);
}

function applyGlobalVolume() {
  const globalVolume = parseFloat(localStorage.getItem('globalVolume')) || 0.5;
  document.querySelectorAll('video').forEach((video) => {
    video.volume = globalVolume;
  });
}

function initialize() {
  const observer = new MutationObserver(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      if (!video.parentElement.querySelector('.video-controls')) {
        createVideoControls(video);
      }
    });
    applyGlobalVolume();
    removeInstagramElements();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    createVideoControls(video);
  });
  applyGlobalVolume();
  removeInstagramElements();
}

initialize();
