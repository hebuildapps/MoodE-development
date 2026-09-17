/**
 * MoodE OS - Desktop Operating System Logic
 */

// =============================================================================
// 1. Digital Clock & Timestamp Formatter
// =============================================================================
function updateTime() {
    const timeElement = document.getElementById("timeElement");
    if (!timeElement) return;

    const now = new Date();
    // Shorter format on mobile, full date+time on desktop
    if (window.innerWidth <= 768) {
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } else {
        timeElement.textContent = now.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        }) + ', ' + now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
}

updateTime();
setInterval(updateTime, 1000);

// =============================================================================
// Mood State Selector (with Apple Emojis)
// =============================================================================
const moodPill = document.getElementById('mood-pill');
const moodMenu = document.getElementById('mood-menu');
const moodStatusText = document.getElementById('mood-status-text');
const moodOverlay = document.getElementById('mood-overlay');

const moodDefinitions = {
    learning: {
        html: `<img class="apple-emoji" src="OS/Assets/emojis/sun_behind_small_cloud.png" alt="🌤️"> Always Learning <img class="apple-emoji" src="OS/Assets/emojis/cloud.png" alt="☁️">`,
        tint: 'rgba(0, 0, 0, 0)'
    },
    hustling: {
        html: `<img class="apple-emoji" src="OS/Assets/emojis/sun.png" alt="☀️"> Keep Hustling! <img class="apple-emoji" src="OS/Assets/emojis/cloud.png" alt="☁️">`,
        tint: 'rgba(255, 180, 0, 0.12)'
    },
    focused: {
        html: `<img class="apple-emoji" src="OS/Assets/emojis/headphones.png" alt="🎧"> Deep Focus Mode <img class="apple-emoji" src="OS/Assets/emojis/zap.png" alt="⚡">`,
        tint: 'rgba(56, 189, 248, 0.14)'
    },
    calm: {
        html: `<img class="apple-emoji" src="OS/Assets/emojis/herb.png" alt="🌿"> Serene & Relaxed <img class="apple-emoji" src="OS/Assets/emojis/water_wave.png" alt="🌊">`,
        tint: 'rgba(34, 197, 94, 0.12)'
    },
    night: {
        html: `<img class="apple-emoji" src="OS/Assets/emojis/crescent_moon.png" alt="🌙"> Late Night Hacker <img class="apple-emoji" src="OS/Assets/emojis/laptop.png" alt="💻">`,
        tint: 'rgba(147, 51, 234, 0.16)'
    }
};

if (moodPill && moodMenu) {
    moodPill.addEventListener('click', (e) => {
        e.stopPropagation();
        moodMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!moodMenu.contains(e.target) && !moodPill.contains(e.target)) {
            moodMenu.classList.remove('active');
        }
    });

    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', () => {
            const mood = option.getAttribute('data-mood');
            if (mood && moodDefinitions[mood]) {
                if (moodStatusText) moodStatusText.innerHTML = moodDefinitions[mood].html;
                if (moodOverlay) moodOverlay.style.backgroundColor = moodDefinitions[mood].tint;
            }
            moodMenu.classList.remove('active');
        });
    });
}

// =============================================================================
// 2. Custom Cursor Transitions & Launch Effects
// =============================================================================
let rainbowCursorEl = null;
let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    if (rainbowCursorEl && rainbowCursorEl.classList.contains('active')) {
        rainbowCursorEl.style.left = `${lastMouseX}px`;
        rainbowCursorEl.style.top = `${lastMouseY}px`;
    }
}, { passive: true });

function triggerLaunchCursor() {
    if (!rainbowCursorEl) {
        rainbowCursorEl = document.createElement('div');
        rainbowCursorEl.id = 'mac-rainbow-cursor';
        rainbowCursorEl.innerHTML = `<img src="OS/Assets/rainbow_spinner.gif" alt="Spinning Rainbow Beachball" />`;
        document.body.appendChild(rainbowCursorEl);
    }

    rainbowCursorEl.style.left = `${lastMouseX}px`;
    rainbowCursorEl.style.top = `${lastMouseY}px`;
    rainbowCursorEl.classList.add('active');
    document.body.classList.add('cursor-launching');

    setTimeout(() => {
        if (rainbowCursorEl) rainbowCursorEl.classList.remove('active');
        document.body.classList.remove('cursor-launching');
    }, 650);
}

// =============================================================================
// 3. Window Management (Center-Opening, Z-Index, Dragging, Minimize/Restore)
// =============================================================================
let highestZIndex = 100;

function bringToFront(windowElement) {
    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;

    // Update active class
    document.querySelectorAll('.os-window').forEach(win => win.classList.remove('active'));
    windowElement.classList.add('active');
}

function centerWindow(win) {
    if (!win) return;

    // Ensure window is displayed to get accurate measurements
    const previousDisplay = win.style.display;
    if (previousDisplay === 'none' || getComputedStyle(win).display === 'none') {
        win.style.visibility = 'hidden';
        win.style.display = 'flex';
    }

    const rect = win.getBoundingClientRect();
    const winWidth = rect.width || win.offsetWidth || 420;
    const winHeight = rect.height || win.offsetHeight || 380;

    if (previousDisplay === 'none') {
        win.style.display = previousDisplay;
        win.style.visibility = 'visible';
    }

    const left = Math.max(10, Math.round((window.innerWidth - winWidth) / 2));
    const top = Math.max(48, Math.round((window.innerHeight - winHeight) / 2));

    win.style.transform = 'none';
    win.style.right = 'auto';
    win.style.bottom = 'auto';
    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
}

function updateDockIndicators() {
    document.querySelectorAll('.dock-item').forEach(item => {
        const targetId = item.getAttribute('data-target');
        const win = document.getElementById(targetId);
        if (win && win.style.display !== 'none' && getComputedStyle(win).display !== 'none') {
            item.classList.add('is-running');
        } else {
            item.classList.remove('is-running');
        }
    });
}

function openApp(targetId) {
    // 300ms launch cursor transition
    triggerLaunchCursor();

    const targetWin = document.getElementById(targetId);
    if (!targetWin) return;

    // Open at center only (no scattered), user can move later
    targetWin.style.display = 'flex';
    centerWindow(targetWin);
    bringToFront(targetWin);

    targetWin.classList.add('fade-in');
    setTimeout(() => targetWin.classList.remove('fade-in'), 300);

    updateDockIndicators();
}

function makeDraggable(element) {
    const header = element.querySelector('.window-header') || element;
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    // Bring to front on click
    element.addEventListener('mousedown', () => bringToFront(element));

    header.addEventListener('mousedown', dragStart);

    function dragStart(e) {
        // Prevent drag on close button
        if (e.target.classList.contains('window-close-btn') || e.target.classList.contains('closebutton')) return;

        e.preventDefault();
        isDragging = true;
        bringToFront(element);

        startX = e.clientX;
        startY = e.clientY;

        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // Clean positioning if using right/bottom css
        element.style.transform = 'none';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        element.style.left = initialLeft + 'px';
        element.style.top = initialTop + 'px';

        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newX = initialLeft + dx;
        let newY = initialTop + dy;

        // Keep inside window bounds
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const elWidth = element.offsetWidth;

        newX = Math.max(10, Math.min(newX, winWidth - elWidth - 10));
        newY = Math.max(42, Math.min(newY, winHeight - 60));

        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
    }

    function dragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    }
}

// Initialize all windows as draggable
document.querySelectorAll('.os-window').forEach(win => {
    makeDraggable(win);
});

// Close button handlers
document.querySelectorAll('.window-close-btn, .closebutton').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-close');
        const targetWin = targetId ? document.getElementById(targetId) : btn.closest('.os-window');
        if (targetWin) {
            targetWin.style.display = 'none';

            // Specifically handle who-am-i (window-intro): immediately terminate video & iframe audio
            if (targetWin.id === 'window-intro') {
                const vid = document.getElementById('intro-video-player');
                if (vid) {
                    vid.pause();
                    vid.currentTime = 0;
                }
                const iframe = document.getElementById('intro-x-iframe');
                if (iframe) {
                    const currSrc = iframe.src;
                    iframe.src = '';
                    setTimeout(() => { iframe.src = currSrc; }, 50);
                }
            }

            updateDockIndicators();
        }
    });
});

// macOS Dock click handlers
document.querySelectorAll('.dock-item').forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        if (targetId) {
            openApp(targetId);
        }
    });
});

// Initial Setup: Keep all apps closed except Welcome, open Welcome at center
document.querySelectorAll('.os-window').forEach(win => {
    if (win.id === 'window-welcome') {
        win.style.display = 'flex';
        centerWindow(win);
        bringToFront(win);
    } else {
        win.style.display = 'none';
    }
});
updateDockIndicators();

// =============================================================================
// 3. Notes Application Interactivity (Signature 2-Column Vintage Reader)
// =============================================================================
const todayDateStr = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
});

// Set Scratchpad date to present date
const scratchpadDateEl = document.getElementById('notes-scratchpad-date');
if (scratchpadDateEl) {
    scratchpadDateEl.textContent = todayDateStr;
}

const notesDatabase = {
    welcome: {
        title: "Who I am",
        image: "OS/Assets/1767941902117.jpg",
        date: "06/28/2023",
        html: `<p>I'm Heramb Salunkhe, a builder and product-minded engineer from Chiplun, India. Recently worked as an Intern shipping full-stack systems at <a href="https://autonmis.com" target="_blank" rel="noopener" class="org-mention"><img src="OS/Assets/autonmis.png" class="org-mention-icon" alt="">Autonmis</a>.</p>
<p>I've bounced through AI agents, link engines, data ops (testing different 3rd party integrations, brand-oriented visualizations), exploring different inference engines, and essentially data pipelines. Not because I couldn't pick a topic, but cause I learn fastest when the thing I'm building has to work for someone else.</p>
<p>A few rooms left fingerprints: Building community with <a href="https://github.com/hebuildapps" target="_blank" rel="noopener" class="org-mention"><img src="OS/Assets/prismlabs-07.png" class="org-mention-icon" alt="">prismlabs</a>, shipping being youngest in room at <a href="https://starknet.io" target="_blank" rel="noopener" class="org-mention"><img src="OS/Assets/starknet-logo.svg" class="org-mention-icon" alt="">Starknet</a> hackerhouse, and learning leadership through <a href="https://gdg.community.dev/" target="_blank" rel="noopener" class="org-mention"><img src="OS/Assets/emojis/globe.png" class="org-mention-icon" alt="">GDG</a>.</p>
<p>Outside the editor, I care about going on small trips to go out and touch some <span class="org-mention"><img src="OS/Assets/grass.png" class="org-mention-icon" alt="">grass</span>, long talks with lads, good chai or coffee with some local street food, and spending time with fam.</p>`
    },
    blogs: {
        title: "Published Blogs",
        image: null,
        date: "3 posts",
        html: `<div class="notes-blog-list">
            <a class="notes-blog-card" href="https://www.heramb.icu/blog/AI4MH_ISSR" target="_blank" rel="noopener">
                <div class="notes-blog-meta">
                    <span>2026-04-07</span>
                    <span>Proposal</span>
                </div>
                <h3 class="notes-blog-title">My GSoC 2026 Proposal</h3>
                <p class="notes-blog-desc">HumanAI Foundation: AI-Powered Behavioral Analysis, Crisis Signal Detection, Funding Intelligence, and Team Communication Processing.</p>
                <div class="notes-blog-tags">
                    <span class="notes-blog-tag">GSoC</span>
                    <span class="notes-blog-tag">AI / NLP</span>
                    <span class="notes-blog-tag">Signal Processing</span>
                </div>
            </a>

            <a class="notes-blog-card" href="https://www.heramb.icu/blog/analyst-agent-blog" target="_blank" rel="noopener">
                <div class="notes-blog-meta">
                    <span>2026-06-20</span>
                    <span>Systems</span>
                </div>
                <h3 class="notes-blog-title">The Context Problem</h3>
                <p class="notes-blog-desc">Dashboards show what happened. Alerts say something changed. Incidents organize investigation. But explanation is still manual work.</p>
                <div class="notes-blog-tags">
                    <span class="notes-blog-tag">Analytics</span>
                    <span class="notes-blog-tag">Incident Ops</span>
                    <span class="notes-blog-tag">Agents</span>
                </div>
            </a>

            <a class="notes-blog-card" href="https://heramb.bearblog.dev/web3/" target="_blank" rel="noopener">
                <div class="notes-blog-meta">
                    <span>2023-11-11</span>
                    <span>Essay</span>
                </div>
                <h3 class="notes-blog-title">Web 3.0, AI, and the Future of the Internet</h3>
                <p class="notes-blog-desc">An exploration of convergence between decentralized systems, open protocols, and sovereign agentic AI engines.</p>
                <div class="notes-blog-tags">
                    <span class="notes-blog-tag">Web3</span>
                    <span class="notes-blog-tag">AI</span>
                    <span class="notes-blog-tag">Protocols</span>
                </div>
            </a>
        </div>`
    },
    opencv: {
        title: "Mood Detection Architecture",
        image: "OS/Assets/1000060468.jpg",
        date: "06/28/2023",
        html: `<p>MoodE utilizes real-time facial expression analysis with OpenCV's Haar Cascade classifier and a custom deep learning emotional valence network.</p>
<p><strong>Core Emotion Classes:</strong><br>
• Happy (Warm Amber, 600nm)<br>
• Sad (Calming Golden Glow, 580nm)<br>
• Neutral (Soft daylight balanced)<br>
• Angry / Stressed (Cool Forest Emerald)</p>
<p>When prolonged fatigue or sadness is detected, the system automatically triggers ambient light transitions and tailored audio frequencies.</p>`
    },
    scratchpad: {
        title: "Hacker Scratchpad",
        image: null,
        date: todayDateStr,
        html: ""
    }
};

const notesItems = document.querySelectorAll('.notes-item');
const notesTitle = document.getElementById('notes-title');
const notesImage = document.getElementById('notes-image');
const notesMediaWrapper = document.getElementById('notes-media-wrapper');
const notesProse = document.getElementById('notes-prose');
const notesScratchpad = document.getElementById('notes-scratchpad');

// Load saved scratchpad text from localStorage
const savedScratchpad = localStorage.getItem('moode_notes_scratchpad') ||
    `// MoodE Scratchpad
// Type your ideas, hackathon logs, or thoughts here.
`;
if (notesScratchpad) {
    notesScratchpad.value = savedScratchpad;
    notesScratchpad.addEventListener('input', () => {
        localStorage.setItem('moode_notes_scratchpad', notesScratchpad.value);
    });
}

notesItems.forEach(item => {
    item.addEventListener('click', () => {
        notesItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const noteKey = item.getAttribute('data-note');
        const note = notesDatabase[noteKey];
        if (!note) return;

        notesTitle.textContent = note.title;

        if (noteKey === 'scratchpad') {
            notesMediaWrapper.style.display = 'none';
            notesProse.style.display = 'none';
            notesScratchpad.style.display = 'block';
            notesScratchpad.focus();
        } else {
            notesScratchpad.style.display = 'none';
            notesProse.style.display = 'block';
            notesProse.innerHTML = note.html;

            if (note.image) {
                notesMediaWrapper.style.display = 'block';
                notesImage.src = note.image;
            } else {
                notesMediaWrapper.style.display = 'none';
            }
        }
    });
});

// =============================================================================
// 5. Dynamic Grid-Reveal Wallpaper System
// =============================================================================
const DEFAULT_WALLPAPER = 'OS/Assets/justin-wolff-Macs-aqy6Ek-unsplash.jpg';
const desktop = document.getElementById('desktop');
const wallpaperCanvas = document.getElementById('wallpaper-canvas');

// Clean up stale or legacy wallpapers (like sunset-ocean.jpg)
let activeWallpaper = localStorage.getItem('moode_desktop_wall');
if (!activeWallpaper || activeWallpaper.includes('sunset-ocean.jpg') || activeWallpaper.includes('undefined')) {
    activeWallpaper = DEFAULT_WALLPAPER;
    localStorage.setItem('moode_desktop_wall', DEFAULT_WALLPAPER);
}

// Preload and immediately set default wallpaper on desktop
const initialImg = new Image();
initialImg.src = activeWallpaper;
initialImg.onload = () => {
    if (desktop) {
        desktop.style.backgroundImage = `url('${activeWallpaper}')`;
    }
};
if (desktop) {
    desktop.style.backgroundImage = `url('${activeWallpaper}')`;
}

// Grid Reveal Subdivision & Animation Engine (adapted from wallpaperreveal.tsx)
const GRID_CELLS = 140;
const GRID_OPENING = 4;
const GRID_MORPH = 0.055;
const GRID_SAMPLE = 128;
const GRID_COLOR_MS = 380;
const GRID_GUTTER_FROM = 0.35;
const GRID_GUTTER_TO = 0.75;
const GRID_PHOTO_FROM = 0.92;

const clamp01 = (n) => (n > 0 ? (n < 1 ? n : 1) : 0);
const mix = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
function smoothstep(a, b, x) {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
}
function hash(x, y, z) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return n - Math.floor(n);
}
function makeCell(x, y, w, h, parent) {
    return {
        x, y, w, h,
        r: 0, g: 0, b: 0,
        tone: hash(x + 3.1, y + 1.7, w * 31.7),
        detail: 0, splitAt: 0,
        parent, kids: null
    };
}
function buildTree(aspect) {
    const root = makeCell(0, 0, 1, 1, null);
    const leaves = [root];
    const branches = [];
    while (leaves.length < GRID_CELLS) {
        let pick = 0;
        let widest = -1;
        for (let i = 0; i < leaves.length; i++) {
            const c = leaves[i];
            const area = c.w * aspect * c.h * (1 + 0.12 * hash(c.x, c.y, 7.3));
            if (area > widest) {
                widest = area;
                pick = i;
            }
        }
        const parent = leaves.splice(pick, 1)[0];
        const wide = parent.w * aspect >= parent.h;
        const half = wide ? parent.w / 2 : parent.h / 2;
        const a = wide
            ? makeCell(parent.x, parent.y, half, parent.h, parent)
            : makeCell(parent.x, parent.y, parent.w, half, parent);
        const b = wide
            ? makeCell(parent.x + half, parent.y, half, parent.h, parent)
            : makeCell(parent.x, parent.y + half, parent.w, half, parent);
        parent.kids = [a, b];
        branches.push(parent);
        leaves.push(a, b);
    }
    const opening = GRID_OPENING - 1;
    const rest = Math.max(1, branches.length - opening);
    branches.forEach((cell, i) => {
        cell.splitAt = i < opening ? -GRID_MORPH : (0.92 * (i - opening + 1)) / rest;
    });
    return { root, branches };
}
function coverRect(iw, ih, w, h) {
    const s = Math.max(w / iw, h / ih);
    return { dx: (w - iw * s) / 2, dy: (h - ih * s) / 2, dw: iw * s, dh: ih * s };
}
function measureTree(root, pixels, size) {
    const gather = (cell) => {
        let s;
        if (cell.kids) {
            const a = gather(cell.kids[0]);
            const b = gather(cell.kids[1]);
            s = { n: a.n + b.n, r: a.r + b.r, g: a.g + b.g, b: a.b + b.b, l: a.l + b.l, l2: a.l2 + b.l2 };
        } else {
            s = { n: 0, r: 0, g: 0, b: 0, l: 0, l2: 0 };
            const x0 = Math.round(cell.x * size);
            const y0 = Math.round(cell.y * size);
            const x1 = Math.max(x0 + 1, Math.round((cell.x + cell.w) * size));
            const y1 = Math.max(y0 + 1, Math.round((cell.y + cell.h) * size));
            for (let y = y0; y < y1; y++) {
                for (let x = x0; x < x1; x++) {
                    const i = (y * size + x) * 4;
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const l = 0.299 * r + 0.587 * g + 0.114 * b;
                    s.n++; s.r += r; s.g += g; s.b += b; s.l += l; s.l2 += l * l;
                }
            }
        }
        const n = s.n || 1;
        cell.r = s.r / n;
        cell.g = s.g / n;
        cell.b = s.b / n;
        cell.detail = Math.max(0, s.l2 / n - (s.l / n) * (s.l / n));
        return s;
    };
    gather(root);
}
function orderByDetail(branches, openedBefore) {
    const pending = branches.filter((c) => c.splitAt > openedBefore);
    if (pending.length < 2) return;
    const slots = pending.map((c) => c.splitAt).sort((a, b) => a - b);
    const queue = pending.filter((c) => !c.parent || c.parent.splitAt <= openedBefore);
    let next = 0;
    while (queue.length && next < slots.length) {
        let pick = 0;
        for (let i = 1; i < queue.length; i++) {
            if (queue[i].detail > queue[pick].detail) pick = i;
        }
        const cell = queue.splice(pick, 1)[0];
        cell.splitAt = slots[next++];
        for (const kid of cell.kids || []) {
            if (kid.kids) queue.push(kid);
        }
    }
}
function readAverages(img, root, branches, at) {
    const buffer = document.createElement('canvas');
    buffer.width = GRID_SAMPLE;
    buffer.height = GRID_SAMPLE;
    const bCtx = buffer.getContext('2d', { willReadFrequently: true });
    if (!bCtx) return false;
    const fit = coverRect(img.naturalWidth, img.naturalHeight, GRID_SAMPLE, GRID_SAMPLE);
    bCtx.drawImage(img, fit.dx, fit.dy, fit.dw, fit.dh);
    try {
        measureTree(root, bCtx.getImageData(0, 0, GRID_SAMPLE, GRID_SAMPLE).data, GRID_SAMPLE);
        orderByDetail(branches, at);
        return true;
    } catch {
        return false;
    }
}
function greyOf(tone, dark, clock) {
    return (dark ? 28 : 220) + tone * 14 + Math.sin(clock * 1.5 + tone * 6.28) * 3;
}

let activeRevealAnim = null;

function triggerWallpaperGridReveal(newWallUrl) {
    if (!wallpaperCanvas || !desktop) return;

    if (activeRevealAnim) {
        cancelAnimationFrame(activeRevealAnim);
        activeRevealAnim = null;
    }

    const ctx = wallpaperCanvas.getContext('2d');
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    wallpaperCanvas.width = w;
    wallpaperCanvas.height = h;
    wallpaperCanvas.classList.add('active');

    const aspect = w / h;
    const { root, branches } = buildTree(aspect);

    const scene = {
        ctx, root, width: w, height: h, scale: Math.min(w, h) / 100,
        dark: true, clock: 0, split: 0, fade: 0, hasColors: false, image: null
    };

    const targetImg = new Image();
    let loadedAt = 0;
    targetImg.crossOrigin = 'anonymous';

    targetImg.onload = () => {
        scene.image = targetImg;
        loadedAt = performance.now();
        scene.hasColors = readAverages(targetImg, root, branches, scene.split);
    };
    targetImg.onerror = () => {
        targetImg.removeAttribute('crossOrigin');
        targetImg.onload = () => {
            scene.image = targetImg;
            loadedAt = performance.now();
        };
        targetImg.src = newWallUrl;
    };
    targetImg.src = newWallUrl;

    let last = 0;
    let elapsed = 0;
    let eased = 0;
    let split = 0;
    let fired = false;

    function renderScene(s) {
        const tint = s.hasColors ? s.fade : 0;
        const shade = (grey, target) => Math.round(mix(grey, target, tint));
        const base = greyOf(s.root.tone, s.dark, s.clock);

        s.ctx.fillStyle = `rgb(${Math.round(shade(base, s.root.r) * 0.92)},${Math.round(shade(base, s.root.g) * 0.92)},${Math.round(shade(base, s.root.b) * 0.92)})`;
        s.ctx.fillRect(0, 0, s.width, s.height);

        const soft = 1 - smoothstep(GRID_GUTTER_FROM, GRID_GUTTER_TO, s.split);
        const gutter = s.scale * soft;
        const rounded = soft > 0.01 && typeof s.ctx.roundRect === 'function';

        const paint = (p) => {
            const px = Math.round(p.x);
            const py = Math.round(p.y);
            const pw = Math.round(p.x + p.w) - px;
            const ph = Math.round(p.y + p.h) - py;
            const onLeft = px <= 0;
            const onTop = py <= 0;
            const onRight = px + pw >= s.width;
            const onBottom = py + ph >= s.height;
            const left = onLeft ? 0 : gutter;
            const top = onTop ? 0 : gutter;
            const innerW = pw - left - (onRight ? 0 : gutter);
            const innerH = ph - top - (onBottom ? 0 : gutter);
            if (innerW <= 0 || innerH <= 0) return;

            const grey = greyOf(p.tone, s.dark, s.clock);
            s.ctx.fillStyle = `rgb(${shade(grey, p.r)},${shade(grey, p.g)},${shade(grey, p.b)})`;

            if (rounded) {
                const radius = Math.min(innerW, innerH) * 0.12 * soft;
                s.ctx.beginPath();
                s.ctx.roundRect(px + left, py + top, innerW, innerH, [
                    !onLeft && !onTop ? radius : 0,
                    !onRight && !onTop ? radius : 0,
                    !onRight && !onBottom ? radius : 0,
                    !onLeft && !onBottom ? radius : 0,
                ]);
                s.ctx.fill();
            } else {
                s.ctx.fillRect(px + left, py + top, innerW, innerH);
            }
        };

        const walk = (cell, p) => {
            if (!cell.kids || s.split < cell.splitAt) {
                paint(p);
                return;
            }
            const t = easeOut(clamp01((s.split - cell.splitAt) / GRID_MORPH));
            for (const kid of cell.kids) {
                walk(kid, {
                    x: mix(p.x, kid.x * s.width, t),
                    y: mix(p.y, kid.y * s.height, t),
                    w: mix(p.w, kid.w * s.width, t),
                    h: mix(p.h, kid.h * s.height, t),
                    r: mix(p.r, kid.r, t),
                    g: mix(p.g, kid.g, t),
                    b: mix(p.b, kid.b, t),
                    tone: mix(p.tone, kid.tone, t),
                });
            }
        };

        walk(s.root, { x: 0, y: 0, w: s.width, h: s.height, r: s.root.r, g: s.root.g, b: s.root.b, tone: s.root.tone });

        if (!s.image) return;
        const photo = s.hasColors ? smoothstep(GRID_PHOTO_FROM, 1, s.split) * s.fade : s.fade;
        if (photo <= 0.002) return;
        const fit = coverRect(s.image.naturalWidth, s.image.naturalHeight, s.width, s.height);
        s.ctx.globalAlpha = photo;
        s.ctx.drawImage(s.image, fit.dx, fit.dy, fit.dw, fit.dh);
        s.ctx.globalAlpha = 1;
    }

    const tick = (now) => {
        activeRevealAnim = requestAnimationFrame(tick);
        if (!last) last = now;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        elapsed += dt;
        scene.clock = elapsed;

        const ready = scene.image !== null;
        const target = ready ? 1 : Math.min(elapsed * 0.6, 0.72);
        eased += (target - eased) * (1 - Math.exp(-dt * 6));
        split += (eased - split) * (1 - Math.exp(-dt * 4.5));
        scene.split = split;

        if (loadedAt > 0) {
            scene.fade = clamp01((now - loadedAt) / GRID_COLOR_MS);
        }

        renderScene(scene);

        if (!fired && ready && split > 0.985) {
            fired = true;
            desktop.style.backgroundImage = `url('${newWallUrl}')`;
            localStorage.setItem('moode_desktop_wall', newWallUrl);
        }

        if (fired && split > 0.998) {
            cancelAnimationFrame(activeRevealAnim);
            activeRevealAnim = null;
            wallpaperCanvas.classList.remove('active');
            setTimeout(() => {
                ctx.clearRect(0, 0, w, h);
            }, 250);
        }
    };

    activeRevealAnim = requestAnimationFrame(tick);
}

document.querySelectorAll('.wallpaper-thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
        const wallUrl = thumb.getAttribute('data-wall');
        if (wallUrl) {
            triggerWallpaperGridReveal(wallUrl);
        }
    });
});

// =============================================================================
// 6. X Intro Video Frame & Upward Morphing Iframe
// =============================================================================
const windowIntro = document.getElementById('window-intro');
const introVideoContainer = document.getElementById('intro-video-container');
const introXContainer = document.getElementById('intro-x-container');
const elongateBtn = document.getElementById('elongate-toggle-btn');
const compressBtn = document.getElementById('compress-toggle-btn');
const introWinTitle = document.getElementById('intro-win-title');
const introVideoPlayer = document.getElementById('intro-video-player');

if (elongateBtn && windowIntro) {
    elongateBtn.addEventListener('click', () => {
        if (introVideoPlayer) introVideoPlayer.pause();

        const rect = windowIntro.getBoundingClientRect();
        const currentHeight = rect.height;
        const targetHeight = 520;
        const heightDiff = targetHeight - currentHeight;

        // Increase height upwards: adjust top coordinate so bottom stays at same position
        windowIntro.style.top = Math.max(45, (rect.top - heightDiff)) + 'px';
        windowIntro.style.width = '380px';

        introVideoContainer.style.display = 'none';
        introXContainer.style.display = 'block';
        if (introWinTitle) introWinTitle.textContent = 'Post on X';
        bringToFront(windowIntro);
    });

    if (compressBtn) {
        compressBtn.addEventListener('click', () => {
            const rect = windowIntro.getBoundingClientRect();
            const currentHeight = rect.height;
            const targetHeight = 230;
            const heightDiff = currentHeight - targetHeight;

            windowIntro.style.top = (rect.top + heightDiff) + 'px';
            windowIntro.style.width = '330px';

            introXContainer.style.display = 'none';
            introVideoContainer.style.display = 'block';
            if (introWinTitle) introWinTitle.textContent = 'who-am-i.mp4';
            if (introVideoPlayer) introVideoPlayer.play().catch(() => { });
            bringToFront(windowIntro);
        });
    }
}

// =============================================================================
// 7. Mac Image Viewer (>Club work< with Mini Carousel)
// =============================================================================
const clubMainImg = document.getElementById('club-main-img');
const clubThumbs = document.querySelectorAll('.club-thumb');
const clubPrevBtn = document.getElementById('club-prev-btn');
const clubNextBtn = document.getElementById('club-next-btn');

if (clubThumbs.length > 0) {
    let currentClubIndex = 0;
    const clubImages = Array.from(clubThumbs).map(t => t.getAttribute('data-src'));

    function setClubImage(index) {
        if (index < 0) index = clubImages.length - 1;
        if (index >= clubImages.length) index = 0;
        currentClubIndex = index;

        if (clubMainImg) {
            clubMainImg.style.opacity = '0.3';
            setTimeout(() => {
                clubMainImg.src = clubImages[currentClubIndex];
                clubMainImg.style.opacity = '1';
            }, 120);
        }

        clubThumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentClubIndex);
        });
    }

    clubThumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => setClubImage(i));
    });

    if (clubPrevBtn) {
        clubPrevBtn.addEventListener('click', () => setClubImage(currentClubIndex - 1));
    }
    if (clubNextBtn) {
        clubNextBtn.addEventListener('click', () => setClubImage(currentClubIndex + 1));
    }
}

// =============================================================================
// 8. Contact Window Interactive AI Chatbot (Groq + Discord Omnichannel Sync)
// =============================================================================
const contactInput = document.getElementById('contact-message-input');
const contactSendBtn = document.getElementById('contact-send-button');
const contactChatStream = document.getElementById('contact-chat-stream');
const contactStarterChips = document.querySelectorAll('.starter-chip');
const contactModeBadge = document.getElementById('contact-mode-badge');
const contactModeText = document.getElementById('contact-mode-text');

// Persistent Chat Session ID (uses sessionStorage to match i-201 and isolate tabs)
function getOrCreateSessionId() {
    const STORAGE_KEY = 'porto_chat_session_id';
    let sid = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem('moode_chat_session_id');
    if (!sid) {
        const randomPart = Math.random().toString(36).substring(2, 8);
        const timestampPart = Date.now().toString(36).slice(-4);
        sid = `visitor-${randomPart}-${timestampPart}`;
        sessionStorage.setItem(STORAGE_KEY, sid);
        localStorage.setItem('moode_chat_session_id', sid);
    } else {
        sessionStorage.setItem(STORAGE_KEY, sid);
        localStorage.setItem('moode_chat_session_id', sid);
    }
    return sid;
}

let chatSessionId = getOrCreateSessionId();
console.log('[MoodE Chat] Initialized session ID:', chatSessionId);

const chatHistory = [];
let isChatLoading = false;
let currentChatMode = 'ai'; // 'ai' or 'human'

// Determine API Base:
// When running locally, port 5174 provides the CORS proxy that safely communicates with heramb.icu.
// If the page is hosted on localhost/127.0.0.1 (even on IDE preview ports), route through http://127.0.0.1:5174.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal
    ? (window.location.port === '5174' ? '' : 'http://127.0.0.1:5174')
    : 'https://heramb.icu';
const CHAT_API_URL = `${API_BASE}/api/chat`;
const RELAY_API_URL = `${API_BASE}/api/chat/relay`;


// Update mode indicator in header (matches i-201 styling: 'Technically Online' stays, color/border/icon changes)
function setModeBadge(mode) {
    currentChatMode = mode;
    const badge = document.getElementById('contact-mode-badge');
    const text = document.getElementById('contact-mode-text');
    if (!badge) return;

    if (mode === 'human') {
        badge.classList.add('human');
    } else {
        badge.classList.remove('human');
    }
    if (text) {
        text.textContent = 'Technically Online';
    }
}

// Append message bubbles to chat UI
function appendChatBubble(role, text) {
    const stream = document.getElementById('contact-chat-stream');
    if (!stream) return;
    const bubble = document.createElement('div');
    bubble.className = role === 'user' ? 'my_message' : 'thomas_message';
    bubble.textContent = text;
    stream.appendChild(bubble);
    stream.scrollTop = stream.scrollHeight;
    return bubble;
}

// Show typing indicator
function showTypingIndicator() {
    const stream = document.getElementById('contact-chat-stream');
    if (!stream) return null;
    const indicator = document.createElement('div');
    indicator.className = 'thomas_message bot-typing-container';
    indicator.innerHTML = '<div class="bot-typing-dots"><span></span><span></span><span></span></div>';
    stream.appendChild(indicator);
    stream.scrollTop = stream.scrollHeight;
    return indicator;
}

// Poll relay endpoint for operator messages and mode switches (every 1.5 seconds)
async function pollRelay() {
    try {
        const res = await fetch(`${RELAY_API_URL}?sessionId=${encodeURIComponent(chatSessionId)}&t=${Date.now()}`, {
            cache: 'no-store'
        });
        if (!res.ok) return;
        const data = await res.json();

        if (data.mode) {
            setModeBadge(data.mode);
        }

        if (Array.isArray(data.pendingMessages) && data.pendingMessages.length > 0) {
            console.log('[MoodE Chat] Received operator messages:', data.pendingMessages);
            data.pendingMessages.forEach(m => {
                appendChatBubble('bot', m.content);
                chatHistory.push({ role: 'assistant', content: m.content });
            });
            const typingIndicator = document.querySelector('.bot-typing-container');
            if (typingIndicator) typingIndicator.remove();
            isChatLoading = false;
        }
    } catch (e) {
        console.warn('[MoodE Chat] Poll error:', e);
    }
}

// Start polling relay every 1.5 seconds
setInterval(pollRelay, 1500);
pollRelay();

// Send message
async function handleSendContactMessage(overrideText) {
    if (!contactInput || !contactChatStream || isChatLoading) return;
    const textToSend = (overrideText || contactInput.value).trim();
    if (!textToSend) return;

    // Reset input
    if (!overrideText) {
        contactInput.value = '';
    }

    // Hide starter chips after first user action
    const starterChipsContainer = document.getElementById('contact-starter-chips');
    if (starterChipsContainer) {
        starterChipsContainer.style.display = 'none';
    }

    // Append user message
    appendChatBubble('user', textToSend);
    chatHistory.push({ role: 'user', content: textToSend });
    isChatLoading = true;

    // Show typing placeholder
    const typingIndicator = showTypingIndicator();

    try {
        // First try the unified omnichannel endpoint at https://heramb.icu/api/chat
        const res = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: textToSend,
                history: chatHistory.slice(-6).map(m => ({
                    role: m.role === 'user' ? 'user' : 'bot',
                    content: m.content
                })),
                sessionId: chatSessionId,
                chatMode: currentChatMode
            })
        });

        if (res.headers.get('X-Chat-Mode') === 'human' || currentChatMode === 'human') {
            setModeBadge('human');
            if (typingIndicator) typingIndicator.remove();
            isChatLoading = false;
            return;
        }

        if (res.ok) {
            const aiText = await res.text();
            if (typingIndicator) typingIndicator.remove();
            if (aiText && aiText !== 'OK_WAITING_FOR_OPERATOR') {
                appendChatBubble('bot', aiText);
                chatHistory.push({ role: 'assistant', content: aiText });
            }
            isChatLoading = false;
            return;
        }

    } catch (err) {
        console.warn('Network error reaching chat endpoint:', err);
        if (typingIndicator) typingIndicator.remove();
        appendChatBubble('bot', "Thanks for reaching out! You can also connect directly via email at salunkheheramb@gmail.com.");
    } finally {
        isChatLoading = false;
    }
}

if (contactSendBtn && contactInput) {
    contactSendBtn.addEventListener('click', () => handleSendContactMessage());
    contactInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendContactMessage();
        }
    });
}

// Starter chips click handler
contactStarterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) {
            handleSendContactMessage(query);
        }
    });
});

// Initial window centering after layout is ready
window.addEventListener('DOMContentLoaded', () => {
    const welcome = document.getElementById('window-welcome');
    if (welcome) {
        welcome.style.display = 'flex';
        centerWindow(welcome);
        bringToFront(welcome);
    }
});

window.addEventListener('load', () => {
    const welcome = document.getElementById('window-welcome');
    if (welcome) {
        centerWindow(welcome);
    }
});

