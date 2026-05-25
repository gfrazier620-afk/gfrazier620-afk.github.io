// GSAP HERO ANIMATION
gsap.from(".hero-title", { opacity: 0, y: -40, duration: 1 });
gsap.from(".hero-subtitle", { opacity: 0, y: 40, duration: 1, delay: 0.3 });
gsap.from(".cta-btn", { opacity: 0, duration: 1, delay: 0.6 });

// ScrollReveal
ScrollReveal().reveal('.section-title', { delay: 200, distance: '40px', origin: 'bottom' });
ScrollReveal().reveal('.card', { interval: 150, distance: '20px', origin: 'bottom' });

// Typing Effect
const text = ["Cybersecurity Analyst", "Blue Team Defender", "SOC Operations", "Threat Hunter"];
let index = 0;
let charIndex = 0;

function type() {
    const current = text[index];
    document.getElementById("typed-text").textContent = current.substring(0, charIndex);

    charIndex++;

    if (charIndex > current.length) {
        setTimeout(() => {
            charIndex = 0;
            index = (index + 1) % text.length;
        }, 1500);
    }

    setTimeout(type, 100);
}

type();

// PARTICLE BACKGROUND
const canvas = document.getElementById("particle-canvas");
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
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3
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

        ctx.fillStyle = "rgba(255, 140, 66, 0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();

// PARALLAX EFFECT
document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    document.querySelector(".hero-overlay").style.transform =
        `translate(${moveX}px, ${moveY}px)`;
});

// NAVBAR SHRINK ON SCROLL
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 60) {
        navbar.classList.add("shrink");
    } else {
        navbar.classList.remove("shrink");
    }
});

// MOBILE MENU TOGGLE
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

// CLOSE MENU ON LINK CLICK
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});

// GSAP NAVBAR ENTRANCE
gsap.from("#navbar", {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

ScrollReveal().reveal('.about-container', {
    delay: 200,
    distance: '40px',
    origin: 'bottom',
    duration: 800
});