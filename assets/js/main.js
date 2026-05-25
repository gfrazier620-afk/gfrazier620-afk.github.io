// GSAP NAVBAR ENTRANCE
gsap.from("#navbar", {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// HERO ENTRANCE
gsap.from(".hero-left", {
    x: -40,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".hero-right", {
    x: 40,
    opacity: 0,
    duration: 1,
    delay: 0.1,
    ease: "power3.out"
});

// TERMINAL SCRIPT
const terminalLines = [
    "[09:14:03] initializing soc-environment...",
    "[09:14:04] loading log sources: ok",
    "[09:14:05] ingesting events (last 60s): 1,284 records",
    "[09:14:06] parsing events... complete",
    "[09:14:07] correlating signals across sources...",
    "[09:14:09] correlation score: 0.03 (low)",
    "[09:14:10] no critical alerts detected",
    "[09:14:12] monitoring for anomalies...",
    "",
    "[09:14:18] new event stream received",
    "[09:14:18] running detection ruleset v2.4...",
    "[09:14:19] matched 2 medium-severity patterns",
    "[09:14:20] generating summary...",
    "",
    "[09:14:22] summary:",
    "    - auth_failures: 3",
    "    - geo_anomaly: none",
    "    - suspicious_processes: none",
    "    - network_spikes: low",
    "",
    "[09:14:23] status: stable",
    "[09:14:24] awaiting next event batch..."
];

const terminalOutput = document.getElementById("terminal-output");
const terminalCursor = document.getElementById("terminal-cursor");

let termIndex = 0;
let charIndex = 0;
let currentLine = "";
let typing = false;

function formatTerminalLine(line) {
    const tsMatch = line.match(/^

\[(.*?)\]

/);
    let formatted = line;

    if (tsMatch) {
        formatted = formatted.replace(
            tsMatch[0],
            `<span class="terminal-timestamp">${tsMatch[0]}</span>`
        );
    }

    formatted = formatted
        .replace(/(initializing|loading|ingesting|parsing|correlating|monitoring|running|generating|summary|status)/g,
            '<span class="terminal-keyword">$1</span>')
        .replace(/\b(ok|complete|low|stable|none)\b/g,
            '<span class="terminal-status-ok">$1</span>')
        .replace(/\b(\d[\d,\.]*)\b/g,
            '<span class="terminal-metric">$1</span>');

    return formatted;
}

function typeTerminal() {
    if (!typing) {
        typing = true;
        currentLine = terminalLines[termIndex];
        charIndex = 0;
    }

    const visible = currentLine.substring(0, charIndex);
    const existing = terminalOutput.innerHTML.split("\n");
    existing[existing.length - 1] = formatTerminalLine(visible);
    terminalOutput.innerHTML = existing.join("\n");

    charIndex++;

    if (charIndex > currentLine.length) {
        typing = false;
        termIndex++;

        if (termIndex >= terminalLines.length) {
            setTimeout(() => {
                terminalOutput.innerHTML = "";
                termIndex = 0;
                typing = false;
                currentLine = "";
                charIndex = 0;
                terminalOutput.innerHTML = "\n";
                setTimeout(typeTerminal, 600);
            }, 1500);
            return;
        }

        terminalOutput.innerHTML += "\n";
        setTimeout(typeTerminal, 400);
        return;
    }

    setTimeout(typeTerminal, 70 + Math.random() * 40);
}

if (terminalOutput) {
    terminalOutput.innerHTML = "\n";
    setTimeout(typeTerminal, 800);
}

// PARTICLE BACKGROUND (subtle)
const canvas = document.getElementById("particle-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function createParticles() {
        particles = [];
        const count = 24;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.8 + 0.6,
                speedX: (Math.random() - 0.5) * 0.15,
                speedY: (Math.random() - 0.5) * 0.15
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            ctx.fillStyle = "rgba(136, 192, 208, 0.7)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    createParticles();
    animateParticles();
}

// NAVBAR SHRINK ON SCROLL
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    if (window.scrollY > 60) {
        navbar.classList.add("shrink");
    } else {
        navbar.classList.remove("shrink");
    }
});

// MOBILE MENU TOGGLE
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}

// ScrollReveal for sections
if (typeof ScrollReveal !== "undefined") {
    ScrollReveal().reveal('.section-inner', {
        delay: 150,
        distance: '40px',
        origin: 'bottom',
        duration: 700,
        easing: 'ease-out',
        interval: 80
    });
}

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}