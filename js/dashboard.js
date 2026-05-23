/**
 * It's Wesus – Portal do Investidor
 * dashboard.js – Vanilla ES6+ | No frameworks
 */

"use strict";

/* ══════════════════════════════════════════════════════════════
   THEME CONTROLLER
   Strategy: toggle class 'dark' on <html>, persist in localStorage
═══════════════════════════════════════════════════════════════ */
const ThemeController = (() => {
  const HTML = document.documentElement;
  const STORAGE_KEY = "wesus-theme";
  const SUN_PATH =
    "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
  const MOON_PATH =
    "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z";

  let isDark = true;

  function _getStrokeWidth(path) {
    return path === SUN_PATH ? "1.8" : "2";
  }

  function _buildIconSVG(path, strokeWidth) {
    return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="${strokeWidth}" d="${path}"/>`;
  }

  function _updateIcons() {
    const path = isDark ? SUN_PATH : MOON_PATH;
    const strokeWidth = _getStrokeWidth(path);
    const iconHTML = _buildIconSVG(path, strokeWidth);

    ["themeIconDesktop", "themeIconMobile"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = iconHTML;
    });
  }

  function apply(dark) {
    isDark = dark;
    if (dark) {
      HTML.classList.add("dark");
    } else {
      HTML.classList.remove("dark");
    }
    _updateIcons();
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }

  function toggle() {
    apply(!isDark);
  }

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    // Default: dark mode
    const shouldBeDark = stored ? stored === "dark" : true;
    apply(shouldBeDark);

    // Bind toggle buttons
    ["themeToggleDesktop", "themeToggleMobile"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          toggle();
        });
      }
    });
  }

  return { init, toggle, apply };
})();

/* ══════════════════════════════════════════════════════════════
   NAVIGATION CONTROLLER
   Handles active state for both sidebar and bottom nav
═══════════════════════════════════════════════════════════════ */
const NavigationController = (() => {
  function _setActive(clicked, siblings) {
    siblings.forEach((el) => el.classList.remove("active"));
    clicked.classList.add("active");
  }

  function _bindNav(selector) {
    const items = document.querySelectorAll(selector);
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        _setActive(item, items);
        // Future: route to section based on data-section attribute
        const section = item.dataset.section;
        if (section) {
          // Placeholder: section routing will be wired per screen
          console.log("[Navigation] → ", section);
        }
      });
    });
  }

  function init() {
    _bindNav(".nav-item"); // Sidebar
    _bindNav(".bottom-nav-item"); // Bottom bar
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════════
   SCROLL CONTROLLER
   Smooth scroll + iOS rubber-band prevention on body
═══════════════════════════════════════════════════════════════ */
const ScrollController = (() => {
  function init() {
    const mainContent = document.getElementById("mainContent");
    if (!mainContent) return;

    // Prevent body from capturing scroll on iOS (rubber-banding)
    document.body.addEventListener(
      "touchmove",
      (e) => {
        if (!mainContent.contains(e.target)) {
          e.preventDefault();
        }
      },
      { passive: false },
    );

    // iOS momentum scroll for main area
    mainContent.style.webkitOverflowScrolling = "touch";
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════════
   PROGRESS BARS ANIMATION
   Animates progress bars when they enter the viewport (Intersection Observer)
═══════════════════════════════════════════════════════════════ */
const ProgressAnimator = (() => {
  function init() {
    const fills = document.querySelectorAll(".progress-fill");

    if (!fills.length) return;

    // Store target widths, reset to 0 for animation
    const targets = [];
    fills.forEach((fill) => {
      const target = fill.style.width;
      targets.push(target);
      fill.style.width = "0%";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fills.forEach((fill, i) => {
              setTimeout(() => {
                fill.style.width = targets[i];
              }, i * 120);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    // Observe the first fill's parent section
    const section = document.querySelector("#assetsHeading");
    if (section) observer.observe(section);
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════════
   BALANCE VISIBILITY TOGGLE
   Masks sensitive values with dots for privacy
═══════════════════════════════════════════════════════════════ */
const BalanceVisibility = (() => {
  let isVisible = true;
  const MASK = "••••••••";

  // Selectors for all monetary values
  const SELECTORS = ["#patrimonyHeading"];

  // Store original values
  const originals = new Map();

  function _mask(el) {
    if (!originals.has(el)) originals.set(el, el.textContent.trim());
    el.textContent = MASK;
    el.style.letterSpacing = "0.15em";
  }

  function _unmask(el) {
    if (originals.has(el)) {
      el.textContent = originals.get(el);
      el.style.letterSpacing = "";
    }
  }

  function toggle() {
    isVisible = !isVisible;
    SELECTORS.forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      isVisible ? _unmask(el) : _mask(el);
    });
  }

  function init() {
    // Pre-cache originals
    SELECTORS.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) originals.set(el, el.textContent.trim());
    });

    // Bind the eye button (first header action btn)
    const eyeBtns = document.querySelectorAll(".header-action-btn");
    if (eyeBtns.length > 0) {
      eyeBtns[0].addEventListener("click", toggle);
    }
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════════
   ASSET CARD INTERACTIONS
   Tap feedback for native feel
═══════════════════════════════════════════════════════════════ */
const AssetCardController = (() => {
  function init() {
    const cards = document.querySelectorAll(".asset-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        // Future: open asset detail sheet
        console.log(
          "[Asset] Card clicked:",
          card.querySelector("h3")?.textContent,
        );
      });
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════════
   GREETING DYNAMIC (time-based)
   Replaces "Bom dia" with appropriate greeting
═══════════════════════════════════════════════════════════════ */
const GreetingController = (() => {
  function _getGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Bom dia";
    if (h >= 12 && h < 19) return "Boa tarde";
    return "Boa noite";
  }

  function init() {
    const greetings = document.querySelectorAll("h1");
    const text = `${_getGreeting()}, Alexandre.`;
    greetings.forEach((el) => {
      if (el.textContent.includes("Alexandre")) {
        el.textContent = text;
      }
    });
  }

  return { init };
})();

/* ══════════════════════════════════════════════════════════════
   DYNAMIC PLASMA CHART ENGINE (Capacitor 60 FPS Approved)
   ═══════════════════════════════════════════════════════════════ */
const DynamicPlasmaChart = (() => {
  const sampleData = {
    months: ["Mês 1", "Mês 2", "Mês 3 (Vencimento)"],
    values: [2000, 11500, 24500],
    formattedTotal: "+ € 24.500,00",
  };

  function render(data) {
    const svg = document.getElementById("dynamicPlasmaChart");
    if (!svg) return;

    const width = 1000;
    const height = 200;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const pointsCount = data.values.length;
    if (pointsCount < 2) return;

    const minVal = 0;
    const maxVal = Math.max(...data.values) * 1.02;

    // 🔥 DETECÇÃO DE BREAKPOINT NATIVO (lg = 1024px do Tailwind)
    const isMobile = window.innerWidth < 1024;

    // 1. Coordenadas X e Y da Curva (Rampa Otimizada e Responsiva)
    const coords = data.values.map((val, index) => {
      const x = (index / (pointsCount - 1)) * (width - 40) + 20;

      let y;
      if (isMobile) {
        // No mobile, a linha pode subir ao máximo porque o tooltip vai para baixo
        y = height - ((val - minVal) / (maxVal - minVal)) * (height - 20) - 6;
      } else {
        // No desktop, deixamos uma folga de ~25px no topo do contêiner para o tooltip respirar
        y = height - ((val - minVal) / (maxVal - minVal)) * (height - 25) + 5;
      }
      return { x, y };
    });

    // 2. Construção da Curva Bézier Suave Única
    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const distX = p1.x - p0.x;

      const cpX1 = p0.x + distX / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * distX) / 3;
      const cpY2 = p1.y;

      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    // 3. Aplicação do Caminho no Core do Gráfico
    const coreLine = document.getElementById("chartCoreLine");
    coreLine.setAttribute("d", pathD);

    const pathLength = coreLine.getTotalLength();
    coreLine.style.strokeDasharray = pathLength;
    coreLine.style.strokeDashoffset = pathLength;

    // 4. Fechamento Perfeito da Projeção do Sombreamento Inferior
    const lastCoord = coords[coords.length - 1];
    const firstCoord = coords[0];
    const fillD = `${pathD} L ${lastCoord.x} ${height} L ${firstCoord.x} ${height} Z`;
    document.getElementById("chartFillPath").setAttribute("d", fillD);

    // 5. Posicionamento Estático do Nó Final
    document.getElementById("chartFinalNode").setAttribute("cx", lastCoord.x);
    document.getElementById("chartFinalNode").setAttribute("cy", lastCoord.y);

    // 6. 🔥 ALINHAMENTO DINÂMICO DO TOOLTIP (60 FPS COMPOSITING)
    const tooltip = document.getElementById("chartTooltip");
    const tooltipValue = document.getElementById("tooltipValue");
    if (tooltip && tooltipValue) {
      tooltipValue.textContent = data.formattedTotal;
      tooltip.classList.remove("hidden");

      const container = document.getElementById("chartContainer");
      const rect = container.getBoundingClientRect();

      // Centralização horizontal perfeita no ponto final
      const realX = (lastCoord.x / width) * rect.width - 95;

      let realY;
      if (isMobile) {
        // 📱 No Mobile: Posiciona abaixo do ponto final (+15px de recuo)
        realY = (lastCoord.y / height) * rect.height + 55;
      } else {
        // 💻 No Desktop: Posiciona acima do ponto final (-52px de recuo)
        realY = (lastCoord.y / height) * rect.height - 60;
      }

      // Aplicação por matriz de transformação pura para manter os 60 FPS estáveis no Capacitor
      tooltip.style.transform = `translate3d(${realX}px, ${realY}px, 0)`;
    }

    // 7. Renderização do Eixo X
    const xAxis = document.getElementById("chartXAxis");
    if (xAxis) {
      xAxis.innerHTML = data.months
        .map((month, idx) => {
          const isLast = idx === data.months.length - 1;
          return `<span class="${isLast ? "text-gold font-semibold" : ""}">${month}</span>`;
        })
        .join("");
    }
  }

  function init() {
    render(sampleData);
    window.addEventListener("resize", () => {
      requestAnimationFrame(() => render(sampleData));
    });
  }

  return { init, render };
})();

/* ══════════════════════════════════════════════════════════════
   ENTRY POINT
═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  ThemeController.init();
  NavigationController.init();
  ScrollController.init();
  ProgressAnimator.init();
  BalanceVisibility.init();
  AssetCardController.init();
  GreetingController.init();
  DynamicPlasmaChart.init();

  // Log for development
  console.log("[It's Wesus] Dashboard v1.0 — Loaded");
});
