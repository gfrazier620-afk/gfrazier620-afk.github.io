/* =========================================================
   Garret Frazier — Cybersecurity Portfolio
   Small, dependency-free behaviour shared by every page.
   ========================================================= */
document.documentElement.classList.add("js");

/* ---------- Mobile menu ---------- */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* ---------- Operator theme: CRT sweep + boot sequence ---------- */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
    const sweep = document.createElement("div");
    sweep.className = "crt-sweep";
    document.body.appendChild(sweep);
}

(function bootSequence() {
    if (reduceMotion) return;
    try {
        if (sessionStorage.getItem("gf-booted")) return;
        sessionStorage.setItem("gf-booted", "1");
    } catch (e) { /* private mode: still play once this load */ }

    const lines = [
        "[ BOOT ] garret-frazier // security portfolio v2.0",
        "[  <span class='ok'>OK</span>  ] loading operator profile ........ done",
        "[  <span class='ok'>OK</span>  ] mounting /projects /labs /resume .. done",
        "[  <span class='ok'>OK</span>  ] establishing SIEM uplink ......... done",
        "[ <span class='ok'>READY</span> ] welcome, operator"
    ];

    const boot = document.createElement("div");
    boot.className = "boot";
    boot.innerHTML = '<div class="boot-inner" id="boot-text"></div><div class="skip">press any key to skip</div>';
    document.body.appendChild(boot);

    const screen = boot.querySelector("#boot-text");
    let i = 0;
    let done = false;

    function finish() {
        if (done) return;
        done = true;
        boot.classList.add("hide");
        setTimeout(() => boot.remove(), 450);
        window.removeEventListener("keydown", finish);
        window.removeEventListener("pointerdown", finish);
    }

    function next() {
        if (done) return;
        if (i >= lines.length) { setTimeout(finish, 550); return; }
        screen.innerHTML += (i ? "\n" : "") + lines[i];
        i++;
        setTimeout(next, 230);
    }

    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);
    setTimeout(next, 260);
})();

/* ---------- Footer year ---------- */
document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
});

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(el => revealObserver.observe(el));
} else {
    revealEls.forEach(el => el.classList.add("in"));
}

/* ---------- Lab filters (labs/index.html) ---------- */
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));

        document.querySelectorAll("[data-category]").forEach(card => {
            card.hidden = filter !== "all" && card.dataset.category !== filter;
        });
    });
});

/* ---------- Table of contents highlight (write-up pages) ---------- */
const tocLinks = document.querySelectorAll(".toc a");

if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = new Map();
    tocLinks.forEach(link => byId.set(link.getAttribute("href").slice(1), link));

    const tocObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            tocLinks.forEach(link => link.classList.remove("active"));
            const link = byId.get(entry.target.id);
            if (link) link.classList.add("active");
        });
    }, { rootMargin: "-20% 0px -70% 0px" });

    byId.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) tocObserver.observe(section);
    });
}
