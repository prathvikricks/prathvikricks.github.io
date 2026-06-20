/* ============================================================
   Prathveesh Naik — Portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = "© " + new Date().getFullYear();

  /* ---------- Nav: shrink on scroll ---------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScrollNav();

  /* ---------- Scroll progress bar ---------- */
  const progress = document.querySelector(".scroll-progress");
  const onScrollProgress = () => {
    if (!progress) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    progress.style.width = Math.min(100, scrolled * 100) + "%";
  };
  onScrollProgress();

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollNav();
      onScrollProgress();
      ticking = false;
    });
  }, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Hero staggered title ---------- */
  const words = document.querySelectorAll(".hero__title .word");
  if (prefersReduced) {
    words.forEach((w) => (w.style.transform = "none"));
  } else {
    words.forEach((w, i) => {
      w.style.transitionDelay = 0.15 + i * 0.12 + "s";
      // next frame so the transition runs
      requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add("is-in")));
    });
  }

  /* ---------- Hero blob parallax ---------- */
  const blobs = document.querySelectorAll(".blob");
  if (!prefersReduced && blobs.length) {
    let pBlob = false;
    window.addEventListener("scroll", () => {
      if (pBlob) return;
      pBlob = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        blobs.forEach((b, i) => {
          const speed = (i + 1) * 0.04;
          b.style.transform = `translateY(${y * speed}px)`;
        });
        pBlob = false;
      });
    }, { passive: true });
  }

  /* ---------- Cursor glow (desktop only) ---------- */
  const glow = document.querySelector(".cursor-glow");
  if (glow && isFinePointer && !prefersReduced) {
    let gx = 0, gy = 0, cx = 0, cy = 0, raf = null;
    window.addEventListener("mousemove", (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.style.opacity = "1";
      if (!raf) loop();
    });
    document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
    const loop = () => {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.left = cx + "px";
      glow.style.top = cy + "px";
      if (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
  }

  /* ---------- Magnetic buttons ---------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const strength = 0.3;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if ("IntersectionObserver" in window && navLinks.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id)
          );
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Skill groups: cascading chips ---------- */
  const animChips = document.querySelectorAll(".chips--anim");
  if (animChips.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      animChips.forEach((c) => c.classList.add("is-in"));
    } else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("is-in"); cio.unobserve(e.target); }
        });
      }, { threshold: 0.2 });
      animChips.forEach((c) => cio.observe(c));
    }
  }

  /* ---------- Terminal typewriters (one per skill group) ---------- */
  document.querySelectorAll(".type[data-words]").forEach((el, idx) => {
    const words = (el.getAttribute("data-words") || "").split("|").filter(Boolean);
    if (!words.length) return;
    if (prefersReduced) { el.textContent = words[0]; return; }
    let w = 0, c = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      el.textContent = word.slice(0, c);
      if (!deleting) {
        if (c < word.length) { c++; setTimeout(tick, 70 + (c % 3) * 18); }
        else { deleting = true; setTimeout(tick, 1300); }
      } else {
        if (c > 0) { c--; setTimeout(tick, 35); }
        else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 280); }
      }
    };
    setTimeout(tick, 500 + idx * 250);
  });

  /* ---------- Boot terminal gate ---------- */
  (function () {
    const root = document.documentElement;
    const form = document.getElementById("bootForm");
    if (!form) return;
    const input = document.getElementById("bootInput");
    const log = document.getElementById("bootLog");
    const hint = document.getElementById("bootHint");
    const skip = document.getElementById("bootSkip");
    const term = document.querySelector("#boot .term");
    const bootSection = document.getElementById("boot");
    const launcher = document.getElementById("termLauncher");
    const curtain = document.getElementById("revealCurtain");
    const CMD = "docker run portfolio";
    let misses = 0, booting = false, booted = false;

    const norm = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();

    const addLine = (text, cls) => {
      const el = document.createElement("span");
      el.className = "term__line" + (cls ? " " + cls : "");
      el.textContent = text;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    };

    const reveal = () => {
      booted = true;
      root.classList.add("booted");
    };

    const goAbout = () => {
      const about = document.getElementById("about");
      if (about) about.scrollIntoView({ behavior: "auto", block: "start" });
    };

    // Reveal the site behind a cloud curtain that parts down the middle
    const cloudReveal = () => {
      const done = () => { reveal(); goAbout(); };
      if (prefersReduced || !curtain) { done(); return; }
      curtain.classList.add("is-active");                 // clouds fade in to cover the screen
      setTimeout(() => {
        done();                                            // swap to the real sections behind the clouds
        requestAnimationFrame(() => curtain.classList.add("is-parting"));
        setTimeout(() => curtain.classList.remove("is-active", "is-parting"), 2800);
      }, 650);
    };

    const BOOT_LOG = [
      ["Unable to find image 'portfolio:latest' locally"],
      ["latest: Pulling from prathveesh/portfolio"],
      ["9c1b6dd6c1e6: Pull complete", "term__line--dim"],
      ["2f3a1c0b7e21: Pull complete", "term__line--dim"],
      ["b7e4d9a0f1c2: Pull complete", "term__line--dim"],
      ["Digest: sha256:9f2e7c1a…c4b8"],
      ["Status: Downloaded newer image for portfolio:latest"],
      ["[+] Running 1/1"],
      [" ✔ Container portfolio  Started", "term__line--ok"],
      ["→ nginx serving on 0.0.0.0:80"],
      ["✔ Portfolio is live — rendering sections…", "term__line--ok"],
    ];

    const runBootLog = (done) => {
      if (prefersReduced) {
        BOOT_LOG.forEach((l) => addLine(l[0], l[1]));
        done();
        return;
      }
      let i = 0;
      const next = () => {
        if (i >= BOOT_LOG.length) { setTimeout(done, 350); return; }
        addLine(BOOT_LOG[i][0], BOOT_LOG[i][1]);
        i++;
        setTimeout(next, 150 + (i % 3) * 90);
      };
      next();
    };

    const boot = (instant) => {
      if (booting || booted) { goAbout(); return; }
      booting = true;
      if (term) term.classList.add("is-booted");
      if (instant) { cloudReveal(); return; }
      runBootLog(cloudReveal);
    };

    /* --- hidden command outputs --- */
    const OS_RELEASE = [
      ['NAME="Prathveesh Naik"', "term__line--head"],
      ['PRETTY_NAME="Prathveesh Naik — DevOps Engineer"'],
      ['ROLE="DevOps Engineer L1 @ Pace Wisdom Solutions"'],
      ['LOCATION="Mangaluru, Karnataka, India"'],
      ['VERSION="2026"  ID=devops  BUILD=cloud-native'],
      ['CERTS="AWS SAA-C03 · AWS CloudOps · AWS AI · OCI GenAI · AZ-104"'],
      ['HOME_URL="https://prathvikricks.github.io"'],
      ['GITHUB="github.com/prathvikricks"'],
      ['SUPPORT_EMAIL="prathvinaik101@gmail.com"'],
    ];
    const TREE = [
      "portfolio/",
      "├── about/            # who I am",
      "├── experience/",
      "│   ├── pace-wisdom/  # DevOps Engineer · 3 roles",
      "│   └── cognizant/    # CSD Trainee",
      "├── skills/",
      "│   ├── cloud/        # AWS · Azure · GCP · OCI · Jio",
      "│   ├── devops/       # Docker · K8s · Terraform · Ansible",
      "│   └── ai/           # Prompt Eng · GenAI · n8n",
      "├── certifications/   # 5 badges",
      "└── contact/",
      "    ├── email",
      "    ├── github",
      "    └── linkedin",
    ];
    const HELP = [
      ["Available commands:", "term__line--head"],
      ["  docker run portfolio   → start the site"],
      ["  cat /etc/os-release    → about me"],
      ["  ls                     → list sections"],
      ["  tree                   → site structure"],
      ["  whoami                 → quick intro"],
      ["  train                  → 🚂 skills express"],
      ["  clear                  → clear the screen"],
    ];

    const buildTrain = () => {
      const engine = [
        "      ____      ",
        "   __|[##]|__   ",
        "  |  DEVOPS  |  ",
        "  |__________|  ",
        "   O-O    O-O   ",
      ];
      const skills = ["AWS", "Docker", "K8s", "Azure", "Terra", "Grafana", "Ansible", "Git", "Linux", "Nginx", "CI/CD", "n8n"];
      const center = (s, w) => {
        s = s.slice(0, w);
        const t = w - s.length, l = Math.floor(t / 2);
        return " ".repeat(l) + s + " ".repeat(t - l);
      };
      const car = (skill) => [
        "  _______  ",
        " |=======| ",
        " |" + center(skill, 7) + "| ",
        " |_______| ",
        "  (o) (o)  ",
      ];
      const cars = skills.map(car);
      const lines = [];
      for (let r = 0; r < 5; r++) {
        let line = engine[r];
        cars.forEach((c) => { line += c[r]; });
        lines.push(line);
      }
      return lines.join("\n");
    };

    const runTrain = () => {
      const wrap = document.createElement("div");
      wrap.className = "term__train";
      const pre = document.createElement("pre");
      pre.textContent = buildTrain();
      wrap.appendChild(pre);
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
      if (prefersReduced) { pre.style.animation = "none"; pre.style.transform = "none"; return; }
      pre.addEventListener("animationend", () => wrap.remove());
    };

    const runCommand = (raw) => {
      const cmd = norm(raw);
      if (!cmd) { return; }
      addLine("$ " + raw.trim(), "term__line--cmd");

      if (cmd === CMD) { input.blur(); boot(false); return; }

      switch (cmd) {
        case "cat /etc/os-release":
          OS_RELEASE.forEach((l) => addLine(l[0], l[1]));
          break;
        case "ls": case "ls -a": case "ls -la": case "ll": case "dir":
          addLine("about/  experience/  skills/  certifications/  contact/", "term__line--dir");
          addLine("README.md  resume.pdf");
          break;
        case "tree":
          TREE.forEach((l) => addLine(l));
          break;
        case "whoami":
          addLine("Prathveesh Naik — DevOps Engineer, Ops & Cloud Enthusiast.");
          break;
        case "pwd":
          addLine("/home/prathveesh/portfolio");
          break;
        case "help": case "--help": case "?":
          HELP.forEach((l) => addLine(l[0], l[1]));
          break;
        case "clear": case "cls":
          log.innerHTML = "";
          break;
        case "train": case "sl": case "choo": case "choo choo":
          runTrain();
          break;
        default:
          addLine("bash: " + raw.trim() + ": command not found", "term__line--err");
          misses++;
          if (misses >= 2) addLine("hint: type 'help' to see available commands", "term__line--dim");
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value;
      input.value = "";
      runCommand(val);
      if (!booted) input.focus();
    });

    if (hint) hint.addEventListener("click", () => { input.value = CMD; input.focus(); });
    if (skip) skip.addEventListener("click", (e) => { e.preventDefault(); boot(true); });

    // Click the terminal icon to open the window, then focus the command input
    if (launcher && bootSection) {
      launcher.addEventListener("click", () => {
        bootSection.classList.add("is-open");
        launcher.setAttribute("aria-expanded", "true");
        input.focus({ preventScroll: true });
      });
    }
  })();
})();
