window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    gsap.to(loader, {
        opacity: 0,
        duration: 1.2,
        delay: 2.0,
        onComplete: () => loader.classList.add('hidden')
    });

    gsap.from('.hero h1', { scale: 0.8, opacity: 0, duration: 1.5, ease: 'back.out(1.7)', delay: 0.5 });
    const photoViewer = document.getElementById('photoViewer');
    const viewerTrack = document.getElementById('viewerTrack');
    const photoSources = ['images/p1.jpeg', 'images/p2.jpeg', 'images/p3.jpeg', 'images/p4.jpeg', 'images/p5.jpeg', 'images/p6.jpeg', 'images/p7.jpeg', 'images/p8.jpeg', 'images/p9.jpeg', 'images/p10.jpeg', 'images/p11.jpeg'];
    const viewerClose = photoViewer.querySelector('.viewer-close');
    let previousFocus;
    let activePhoto = 0;

    viewerTrack.innerHTML = photoSources.map((source, index) => `
        <article class="viewer-slide">
            <figure><img src="${source}" alt="Memory photo ${index + 1}"><figcaption>Memory ${index + 1} of ${photoSources.length}</figcaption></figure>
        </article>`).join('');

    function moveToPhoto(index) {
        activePhoto = (index + photoSources.length) % photoSources.length;
        [...viewerTrack.children].forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === activePhoto);
        });
    }

    function openPhotoViewer(index = 0) {
        previousFocus = document.activeElement;
        photoViewer.classList.add('is-open');
        photoViewer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => moveToPhoto(index));
        viewerClose.focus();
    }

    function closePhotoViewer() {
        photoViewer.classList.remove('is-open');
        photoViewer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        mysteryBox.classList.remove('is-open');
        mysteryBox.setAttribute('aria-expanded', 'false');
        previousFocus?.focus();
    }

    viewerClose.addEventListener('click', closePhotoViewer);
    document.getElementById('viewerLeft').addEventListener('click', () => moveToPhoto(activePhoto - 1));
    document.getElementById('viewerRight').addEventListener('click', () => moveToPhoto(activePhoto + 1));
    document.addEventListener('keydown', (event) => {
        if (!photoViewer.classList.contains('is-open')) return;
        if (event.key === 'Escape') closePhotoViewer();
        if (event.key === 'ArrowLeft') moveToPhoto(activePhoto - 1);
        if (event.key === 'ArrowRight') moveToPhoto(activePhoto + 1);
    });

    const musicToggle = document.getElementById('musicToggle');
    let audioContext;
    let musicTimer;
    const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];

    function playChime(frequency, startTime) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.3);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + 1.35);
    }

    function playMelody() {
        const now = audioContext.currentTime;
        notes.forEach((note, index) => playChime(note, now + index * 0.42));
    }

    musicToggle.addEventListener('click', () => {
        const isPlaying = musicToggle.getAttribute('aria-pressed') === 'true';
        if (isPlaying) {
            clearInterval(musicTimer);
            musicToggle.setAttribute('aria-pressed', 'false');
            musicToggle.setAttribute('aria-label', 'Turn music on');
            musicToggle.innerHTML = '<span aria-hidden="true">♫</span> Music: Off';
            return;
        }
        audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
        audioContext.resume();
        playMelody();
        musicTimer = setInterval(playMelody, 3400);
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'Turn music off');
        musicToggle.innerHTML = '<span aria-hidden="true">♫</span> Music: On';
    });

    const mysteryBox = document.getElementById('mysteryBox');
    mysteryBox.addEventListener('click', () => {
        if (mysteryBox.classList.contains('is-open')) return;
        mysteryBox.classList.add('is-open');
        mysteryBox.setAttribute('aria-expanded', 'true');
        window.setTimeout(() => openPhotoViewer(0), 800);
    });
});
