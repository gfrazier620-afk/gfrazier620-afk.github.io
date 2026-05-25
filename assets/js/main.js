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