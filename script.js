document.addEventListener('DOMContentLoaded', () => {
    // ============ ELEMEN UTAMA ============
    const startBtn      = document.getElementById('startBtn');
    const overlay       = document.getElementById('landingOverlay');
    const gameOverlay   = document.getElementById('gameOverlay');
    const mainContent   = document.getElementById('mainContent');
    const bgMusic       = document.getElementById('bgMusic');
    const musicPlayer   = document.getElementById('musicPlayer');
    const musicToggle   = document.getElementById('musicToggle');
    const heartsLayer   = document.getElementById('heartsLayer');
    const cursorHearts  = document.getElementById('cursorHearts');
    const balloonLayer  = document.getElementById('balloonLayer');

    // ============ TANGGAL JADIAN (EDIT DI SINI) ============
    // Format: YYYY-MM-DD
    const startDate = new Date('2023-08-05');
    startDate.setHours(0, 0, 0, 0);

    // ============ EMOJI HATI ============
    const HEART_EMOJIS = ['❤', '💛', '💗', '💕', '💞', '💖'];

    // ============ REVEAL ON SCROLL ============
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // Foto galeri: beri delay berjenjang agar muncul satu per satu pop-in
    Array.from(document.querySelectorAll('.gallery-grid .photo-card')).forEach((card, i) => {
        card.style.setProperty('--pd', (i * 0.14) + 's');
    });

    // ============ LEDAKAN HATI ============
    function makeHeart(burst = false, container = heartsLayer) {
        const heart = document.createElement('span');
        heart.className = 'float-heart' + (burst ? ' burst' : '');
        heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
        heart.style.left = (Math.random() * 100) + 'vw';
        const size = 10 + Math.random() * 16;
        heart.style.fontSize = size + 'px';
        const dur = 6 + Math.random() * 6;
        heart.style.animationDuration = dur + 's';
        heart.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
        heart.style.opacity = '0.2';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), dur * 1000);
    }

    setInterval(() => makeHeart(false), 900);

    function heartBurst(count = 46, container = heartsLayer) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => makeHeart(true, container), i * 40);
        }
    }

    // ============ CONFETTI ============
    const CONF_COLORS = ['#e8b4b8', '#d4af37', '#f7e7ce', '#b76e79', '#ffffff', '#c98bb9'];

    function confettiBurst(x, y, n = 18) {
        for (let i = 0; i < n; i++) {
            const c = document.createElement('span');
            c.className = 'confetti';
            c.style.left = x + 'px';
            c.style.top = y + 'px';
            const s = 5 + Math.random() * 7;
            c.style.width = s + 'px';
            c.style.height = s * 0.6 + 'px';
            c.style.background = CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)];
            c.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
            c.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
            c.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 2000);
        }
    }

    function confettiRain(n = 100) {
        for (let i = 0; i < n; i++) {
            setTimeout(() => {
                const c = document.createElement('span');
                c.className = 'confetti';
                c.style.left = (Math.random() * 100) + 'vw';
                c.style.top = '-20px';
                const s = 6 + Math.random() * 8;
                c.style.width = s + 'px';
                c.style.height = s * 0.6 + 'px';
                c.style.background = CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)];
                c.style.setProperty('--drift', (Math.random() * 220 - 110) + 'px');
                c.style.setProperty('--spin', (Math.random() * 900 - 450) + 'deg');
                c.style.animationDuration = (2 + Math.random() * 1.6) + 's';
                document.body.appendChild(c);
                setTimeout(() => c.remove(), 4000);
            }, i * 22);
        }
    }

    function spawnEmoji(emoji, x, y) {
        const s = document.createElement('span');
        s.className = 'pop-text';
        s.textContent = emoji;
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        s.style.fontSize = '26px';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 750);
    }

    // ============ KALKULATOR WAKTU ============
    const elYears  = document.getElementById('statYears');
    const elMonths = document.getElementById('statMonths');
    const elDays   = document.getElementById('statDays');
    const elTotal  = document.getElementById('totalDays');
    const elLive   = document.getElementById('counterLive');

    const MS_DAY = 1000 * 60 * 60 * 24;

    function startOfDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function diffParts(from, to) {
        let y = to.getFullYear() - from.getFullYear();
        let m = to.getMonth() - from.getMonth();
        let d = to.getDate() - from.getDate();
        if (d < 0) {
            m--;
            d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
        }
        if (m < 0) { y--; m += 12; }
        return { y, m, d };
    }

    function updateCounter() {
        const now = new Date();
        const today = startOfDay(now);
        const soD   = startOfDay(startDate);

        let totalDays = Math.floor((today - soD) / MS_DAY);
        if (totalDays < 0) totalDays = 0;

        const { y, m, d } = diffParts(startDate, now);

        elYears.textContent  = y;
        elMonths.textContent = m;
        elDays.textContent   = d;
        elTotal.textContent  = totalDays.toLocaleString('id-ID');

        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        elLive.textContent = `Menit-menit ini kita juga sedang bersama: ${hh} : ${mm} : ${ss} 💞`;
    }

    // ============ MUSIK ============
    bgMusic.addEventListener('error', () => {
        console.warn('File musik belum tersedia. Tambahkan ke assets/music/bg-music.mp3');
    });

    function playMusic() {
        bgMusic.volume = 0;
        const p = bgMusic.play();
        if (p !== undefined) {
            p.then(() => {
                let vol = 0;
                const ramp = setInterval(() => {
                    vol += 0.05;
                    if (vol >= 1) { vol = 1; clearInterval(ramp); }
                    bgMusic.volume = vol;
                }, 90);
            }).catch((err) => console.log('Musik belum bisa diputar:', err));
        }
    }

    function pauseMusic() {
        let vol = bgMusic.volume || 1;
        const ramp = setInterval(() => {
            vol -= 0.06;
            if (vol <= 0) {
                vol = 0;
                clearInterval(ramp);
                bgMusic.pause();
            } else {
                bgMusic.volume = vol;
            }
        }, 80);
    }

    let isPlaying = false;

    // ============ LANDING → MINI GAME ============
    startBtn.addEventListener('click', () => {
        heartBurst();
        overlay.classList.add('fade-out');

        setTimeout(() => {
            overlay.style.display = 'none';
            gameOverlay.classList.remove('hidden');
            gameOverlay.classList.add('active');
        }, 850);
    });

    // ============ PLAY / PAUSE MUSIK ============
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            pauseMusic();
            musicToggle.parentElement.classList.add('paused');
            musicPlayer.classList.remove('playing');
        } else {
            playMusic();
            musicToggle.parentElement.classList.remove('paused');
            musicPlayer.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // =========================================================
    //         MINI GAME: TANGKAP HATI
    // =========================================================
    const GOAL  = 12;
    const TIME  = 40;

    const playArea    = document.getElementById('playArea');
    const playHint    = document.getElementById('playHint');
    const gameStart   = document.getElementById('gameStart');
    const scoreEl     = document.getElementById('score');
    const timerEl     = document.getElementById('timer');
    const timerBarEl  = document.getElementById('timerBar');
    const gamePanel   = document.getElementById('gamePanel');
    const winPanel    = document.getElementById('winPanel');
    const enterSite   = document.getElementById('enterSiteBtn');

    let score = 0;
    let timeLeft = TIME;
    let gameRun = false;
    let spawnInterval = null;
    let timerInterval = null;

    function updateHud() {
        scoreEl.textContent = score;
        timerEl.textContent = timeLeft + 's';
        timerBarEl.style.width = (Math.max(0, timeLeft) / TIME * 100) + '%';
    }

    function resetGame() {
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        gameRun = false;
        score = 0;
        timeLeft = TIME;
        updateHud();
        playArea.querySelectorAll('.game-heart').forEach((h) => h.remove());
        gamePanel.classList.remove('won');
        winPanel.classList.add('hidden');
    }

    function startGame() {
        resetGame();
        playHint.classList.add('hidden');
        gameRun = true;

        spawnInterval = setInterval(spawnHeart, 750);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateHud();
            if (timeLeft <= 0) endGame(false);
        }, 1000);
    }

    function spawnHeart() {
        if (!gameRun) return;
        if (playArea.querySelectorAll('.game-heart').length >= 14) return;

        const h = document.createElement('span');
        h.className = 'game-heart';
        h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
        h.style.left = (4 + Math.random() * 88) + '%';
        h.style.fontSize = (24 + Math.random() * 22) + 'px';
        const dur = 1.9 + Math.random() * 1.8;
        h.style.animationDuration = dur + 's';
        h.style.setProperty('--sway', (Math.random() * 90 - 45) + 'px');
        h.addEventListener('click', (e) => {
            e.stopPropagation();
            catchHeart(h, e.clientX, e.clientY);
        });
        playArea.appendChild(h);
        h.addEventListener('animationend', () => {
            if (h.parentNode) h.remove();
        });
    }

    function catchHeart(h, x, y) {
        if (!h.parentNode || !gameRun) return;
        h.remove();
        score++;
        updateHud();
        spawnEmoji('❤', x, y);
        if (score >= GOAL) endGame(true);
    }

    function endGame(win) {
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
        gameRun = false;

        if (win) {
            gamePanel.classList.add('won');
            winPanel.classList.remove('hidden');

            if (!isPlaying) {
                musicPlayer.classList.remove('hidden');
                playMusic();
                isPlaying = true;
                musicPlayer.classList.add('playing');
            }

            confettiRain(90);
            heartBurst(60, cursorHearts);
        } else {
            playHint.classList.remove('hidden');
            playHint.innerHTML = '⏰ Waktu habis! Coba lagi ya… 💪';
        }
    }

    gameStart.addEventListener('click', startGame);

    enterSite.addEventListener('click', () => {
        gameOverlay.classList.add('leaving');
        setTimeout(() => {
            gameOverlay.classList.add('hidden');
            gameOverlay.classList.remove('active', 'leaving');

            mainContent.classList.remove('hidden');
            updateCounter();
            setInterval(updateCounter, 1000);
            mainContent.scrollIntoView({ behavior: 'smooth' });
            confettiRain(70);
        }, 500);
    });

    // =========================================================
    //         HATI DI KURSOR & KLIK
    // =========================================================
    function heartAt(x, y) {
        const h = document.createElement('span');
        h.className = 'spark-heart';
        h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
        h.style.left = x + 'px';
        h.style.top = y + 'px';
        h.style.fontSize = (12 + Math.random() * 12) + 'px';
        h.style.setProperty('--sx', (Math.random() * 60 - 30) + 'px');
        h.style.animationDuration = (0.6 + Math.random() * 0.5) + 's';
        cursorHearts.appendChild(h);
        setTimeout(() => h.remove(), 1000);
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.balloon, .game-heart, .gift-inner, .q-no')) return;
        for (let i = 0; i < 4; i++) {
            setTimeout(() => heartAt(
                e.clientX + (Math.random() * 30 - 15),
                e.clientY + (Math.random() * 30 - 15)
            ), i * 40);
        }
    });

    let lastTrail = 0;
    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastTrail < 120) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;
        lastTrail = now;
        heartAt(e.clientX, e.clientY);
    });

    // =========================================================
    //         BALON MELAYANG
    // =========================================================
    const BALLOON_COLORS = ['#e8b4b8', '#d4af37', '#c98bb9', '#8fa3d9', '#f2a7b3', '#f7e7ce', '#9fc5a0'];

    function spawnBalloon() {
        if (balloonLayer.children.length >= 8) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'balloon';
        b.style.setProperty('--bcolor', BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]);
        b.style.left = (Math.random() * 88 + 6) + 'vw';
        const size = 55 + Math.random() * 35;
        b.style.width = size + 'px';
        b.style.height = size * 1.22 + 'px';
        const dur = 9 + Math.random() * 6;
        b.style.animationDuration = dur + 's';
        b.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');

        b.addEventListener('click', (e) => {
            e.stopPropagation();
            if (b.classList.contains('popping')) return;
            b.classList.add('popping');
            confettiBurst(e.clientX, e.clientY, 14);
            spawnEmoji('💥', e.clientX, e.clientY);
            setTimeout(() => b.remove(), 160);
        });

        balloonLayer.appendChild(b);
        setTimeout(() => { if (document.documentElement.contains(b)) b.remove(); }, dur * 1000 + 600);
    }

    setInterval(spawnBalloon, 4200);
    spawnBalloon();
    spawnBalloon();
    spawnBalloon();

    // =========================================================
    //         LIGHTBOX FOTO
    // =========================================================
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbCount   = document.getElementById('lbCount');
    const lbPrev    = document.getElementById('lbPrev');
    const lbNext    = document.getElementById('lbNext');
    const lbClose   = document.getElementById('lbClose');

    const photoCards = Array.from(document.querySelectorAll('.photo-card'));
    const slides = photoCards.map((card) => ({
        src: card.querySelector('img').src,
        date: (card.querySelector('.photo-date') || {}).textContent || '',
        caption: (card.querySelector('.photo-caption') || {}).textContent || '',
    }));

    let lbIndex = 0;

    function renderLb() {
        const s = slides[lbIndex];
        lbImg.src = s.src;
        lbImg.alt = s.caption;
        lbCaption.textContent = s.date ? `${s.date} — ${s.caption}` : s.caption;
        lbCount.textContent = `${lbIndex + 1} / ${slides.length}`;
    }

    function openLb(i) {
        lbIndex = (i + slides.length) % slides.length;
        renderLb();
        lightbox.classList.add('show');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function closeLb() {
        lightbox.classList.remove('show');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    photoCards.forEach((card, i) => {
        card.querySelector('.photo-wrap').addEventListener('click', () => openLb(i));
    });

    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); openLb(lbIndex - 1); });
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); openLb(lbIndex + 1); });
    lbClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLb();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') openLb(lbIndex - 1);
        if (e.key === 'ArrowRight') openLb(lbIndex + 1);
    });

    // =========================================================
    //         LILIN → TIUP → HADIAH BUNGA
    // =========================================================
    const candles   = Array.from(document.querySelectorAll('.candle'));
    const candlesBox = document.getElementById('candles');
    const blowBtn   = document.getElementById('blowBtn');
    const breathBar = document.getElementById('breathBar');
    const cakeHint  = document.getElementById('cakeHint');
    const gift      = document.getElementById('gift');
    const giftBox   = document.getElementById('giftBox');
    const giftHint  = document.getElementById('giftHint');
    const flowers   = document.getElementById('flowers');

    const BLOW_MS = 1500;
    let blown = false;
    let holdInterval = null;
    let holdStart = 0;
    let blowTriggered = false;

    function candleWind(on) {
        candlesBox.classList.toggle('wind', on);
    }

    function startHold(e) {
        if (blown || e.button !== undefined && e.button !== 0) return;
        e.preventDefault();
        blowTriggered = false;
        holdStart = Date.now();
        holdInterval = setInterval(() => {
            const pct = Math.min(100, (Date.now() - holdStart) / BLOW_MS * 100);
            breathBar.style.width = pct + '%';
            candleWind(true);
            if (pct >= 100) {
                clearInterval(holdInterval);
                holdInterval = null;
                if (!blowTriggered) {
                    blowTriggered = true;
                    blowOut();
                }
            }
        }, 16);
    }

    function endHold() {
        clearInterval(holdInterval);
        holdInterval = null;
        breathingBar(0);
        candleWind(false);
        if (blowTriggered) return;
        if (Date.now() - holdStart >= BLOW_MS) blowOut();
    }

    function breathingBar(pct) {
        breathBar.style.width = pct + '%';
    }

    function puffAt(el) {
        const r = el.getBoundingClientRect();
        spawnEmoji('💨', r.left + r.width / 2, r.top - 6);
    }

    function blowOut() {
        blown = true;
        blowBtn.classList.add('hidden');
        breathingBar(0);
        candleWind(false);

        candles.forEach((c, i) => {
            setTimeout(() => {
                c.classList.add('out');
                puffAt(c);
            }, 250 + i * 320);
        });

        setTimeout(() => {
            cakeHint.textContent = 'Semua lilin sudah padam… dan hadiah turun! 🎉';
            heartBurst(50, cursorHearts);
            confettiRain(60);
            gift.classList.remove('hidden');
            gift.classList.add('drop-in');
            gift.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1350);
    }

    blowBtn.addEventListener('pointerdown', startHold);
    blowBtn.addEventListener('pointerup', endHold);
    blowBtn.addEventListener('pointerleave', endHold);
    blowBtn.addEventListener('pointercancel', endHold);

    let giftOpened = false;
    giftBox.addEventListener('click', () => {
        if (giftOpened) return;
        giftOpened = true;

        gift.classList.add('opened');
        giftHint.textContent = 'Hadiah untukmu sudah terbuka… 🌹';
        giftHint.style.display = 'none';

        setTimeout(() => {
            flowers.classList.remove('hidden');
            flowers.classList.add('pop-in');
            flowers.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const r = giftBox.getBoundingClientRect();
            confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 40);
            heartBurst(40, cursorHearts);

            // Kilau estetik mengelilingi buket saat bangkit
            const SPARKLES = ['✨', '🌟', '💫', '✨'];
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    const bx = window.innerWidth / 2 + (Math.random() * 220 - 110);
                    const by = window.innerHeight * 0.4 + (Math.random() * 140 - 70);
                    spawnEmoji(SPARKLES[Math.floor(Math.random() * SPARKLES.length)], bx, by);
                }, 350 + i * 110);
            }

            setTimeout(() => gift.classList.add('hidden'), 750);
        }, 600);
    });
});