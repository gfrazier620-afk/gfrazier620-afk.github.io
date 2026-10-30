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

/* ---------- SOC data helpers ---------- */
const SEV = {
    critical: { cls: "sev-critical", label: "CRIT" },
    high: { cls: "sev-high", label: "HIGH" },
    med: { cls: "sev-med", label: "MED" },
    info: { cls: "sev-info", label: "INFO" }
};
const stages = window.SOC_STAGES || [];

/* ---------- Homepage SOC console ---------- */
const socFeed = document.getElementById("soc-feed");
const socDetail = document.getElementById("soc-detail");

if (socFeed && socDetail && stages.length) {
    const alerts = stages.filter(s => s.rule);        // only stages that raise a SIEM alert

    function showDetail(s) {
        socFeed.querySelectorAll(".alert-row").forEach(r => r.classList.toggle("active", r.dataset.n === String(s.n)));
        const sev = SEV[s.sev];
        socDetail.innerHTML =
            '<div class="dt-head"><h4>' + s.title + '</h4><span class="sev-tag ' + sev.cls + '">' + sev.label + '</span></div>' +
            '<div class="kv">rule <b>' + s.rule + '</b> &middot; L' + s.level + ' &middot; <b>' + s.attack + '</b> ' + s.attackName + '</div>' +
            '<div style="margin-top:6px">' + s.analyst + '</div>';
    }

    let auto = null, idx = 0;
    function startAuto() {
        auto = setInterval(() => { idx = (idx + 1) % alerts.length; showDetail(alerts[idx]); }, 3200);
    }
    function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }

    alerts.forEach((s, i) => {
        const sev = SEV[s.sev];
        const row = document.createElement("button");
        row.className = "alert-row";
        row.dataset.n = s.n;
        row.innerHTML =
            '<span class="alert-time">' + s.time + '</span>' +
            '<span class="sev-tag ' + sev.cls + '">' + sev.label + '</span>' +
            '<span class="alert-msg">' + s.siem + '</span>' +
            '<span class="alert-rule">#' + s.rule.split(" ")[0] + '</span>';
        row.addEventListener("click", () => { stopAuto(); idx = i; showDetail(s); });
        row.addEventListener("mouseenter", stopAuto);
        socFeed.appendChild(row);
        setTimeout(() => row.classList.add("in"), reduceMotion ? 0 : 180 + i * 260);
    });

    const revealDelay = reduceMotion ? 0 : 180 + alerts.length * 260;
    setTimeout(() => { showDetail(alerts[0]); if (!reduceMotion) startAuto(); }, revealDelay);
}

/* ---------- Capstone attack-chain simulator ---------- */
const chainRail = document.getElementById("chain-rail");
const chainDetail = document.getElementById("chain-detail");
const runBtn = document.getElementById("run-sim");

if (chainRail && chainDetail && stages.length) {
    function renderStage(s) {
        chainRail.querySelectorAll(".chain-stage").forEach(b => b.classList.toggle("active", b.dataset.n === String(s.n)));
        const sev = SEV[s.sev];
        const ruleRow = s.rule
            ? '<div><dt>SIEM rule</dt><dd>' + s.rule + ' &middot; L' + s.level + '</dd></div>'
            : '<div><dt>SIEM rule</dt><dd>&mdash; no host signal</dd></div>';
        chainDetail.innerHTML =
            '<p class="cd-phase">[' + s.n + '] ' + s.phase + ' &middot; <span class="sev-tag ' + sev.cls + '">' + sev.label + '</span></p>' +
            '<h3>' + s.title + '</h3>' +
            '<p class="cd-desc">' + s.desc + '</p>' +
            '<pre><code>' + s.cmd + '</code></pre>' +
            '<dl class="cd-rows">' +
                '<div><dt>Attacker action</dt><dd>' + s.attack + '</dd></div>' +
                ruleRow +
                '<div><dt>ATT&amp;CK</dt><dd>' + s.attackName + '</dd></div>' +
            '</dl>' +
            '<div class="cd-analyst"><b>Analyst response</b>' + s.analyst + '</div>';
    }

    stages.forEach(s => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className = "chain-stage";
        btn.dataset.n = s.n;
        btn.innerHTML = '<span class="stage-n">' + String(s.n).padStart(2, "0") + '</span>' +
            '<span class="stage-label">' + s.title + '<small>' + s.phase + '</small></span>';
        btn.addEventListener("click", () => renderStage(s));
        li.appendChild(btn);
        chainRail.appendChild(li);
    });

    renderStage(stages[0]);

    if (runBtn) {
        runBtn.addEventListener("click", () => {
            runBtn.disabled = true;
            chainRail.querySelectorAll(".chain-stage").forEach(b => b.classList.remove("fired"));
            let i = 0;
            const step = () => {
                if (i >= stages.length) { runBtn.disabled = false; runBtn.textContent = "▶ Replay simulation"; return; }
                const s = stages[i];
                renderStage(s);
                chainRail.querySelector('.chain-stage[data-n="' + s.n + '"]').classList.add("fired");
                i++;
                setTimeout(step, reduceMotion ? 0 : 1000);
            };
            step();
        });
    }
}

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
