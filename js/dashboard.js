/**
 * It's Wesus – Portal do Investidor
 * dashboard.js – Vanilla ES6+ | PURE STATIC PERFORMANCE ENGINE
 */

"use strict";

/* ── THEME CONTROLLER ─────────────────────────────────────── */
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
    dark ? HTML.classList.add("dark") : HTML.classList.remove("dark");
    _updateIcons();
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }

  function toggle() {
    apply(!isDark);
  }

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    apply(stored ? stored === "dark" : true);
    ["themeToggleDesktop", "themeToggleMobile"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn)
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          toggle();
        });
    });
  }

  return { init };
})();

/* ── NAVIGATION CONTROLLER ────────────────────────────────── */
const NavigationController = (() => {
  function _setActive(clicked, siblings) {
    siblings.forEach((el) => el.classList.remove("active"));
    clicked.classList.add("active");
  }

  function init() {
    [".nav-item", ".bottom-nav-item"].forEach((selector) => {
      const items = document.querySelectorAll(selector);
      items.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          _setActive(item, items);
        });
      });
    });
  }
  return { init };
})();

/* ── SCROLL CONTROLLER ────────────────────────────────────── */
const ScrollController = (() => {
  function init() {
    const mainContent = document.getElementById("mainContent");
    if (mainContent) mainContent.style.webkitOverflowScrolling = "touch";
  }
  return { init };
})();

/* ── BALANCE VISIBILITY TOGGLE ────────────────────────────── */
const BalanceVisibility = (() => {
  let isVisible = true;
  const MASK = "••••••••";
  const SELECTORS = ["#patrimonyHeading"];
  const originals = new Map();

  function toggle() {
    isVisible = !isVisible;
    SELECTORS.forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      if (isVisible) {
        if (originals.has(el)) {
          el.textContent = originals.get(el);
          el.style.letterSpacing = "";
        }
      } else {
        if (!originals.has(el)) originals.set(el, el.textContent.trim());
        el.textContent = MASK;
        el.style.letterSpacing = "0.15em";
      }
    });
  }

  function init() {
    SELECTORS.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) originals.set(el, el.textContent.trim());
    });
    document
      .querySelectorAll(".header-action-btn")
      .forEach((btn) => btn.addEventListener("click", toggle));
  }
  return { init };
})();

/* ── GREETING DYNAMIC ─────────────────────────────────────── */
const GreetingController = (() => {
  function _getGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Bom dia";
    if (h >= 12 && h < 19) return "Boa tarde";
    return "Boa noite";
  }
  function init() {
    const text = `${_getGreeting()}, Alexandre.`;
    document.querySelectorAll("h1").forEach((el) => {
      if (el.textContent.includes("Alexandre")) el.textContent = text;
    });
  }
  return { init };
})();

/* ── CONTRACT DATA CONTROLLER (Otimizado) ─────────────────── */
const ChartDataController = (() => {
  const clientData = {
    months: 3,
    roiTotal: "+ € 24.500,00",
  };

  function init() {
    const tooltipValue = document.getElementById("tooltipValue");
    if (tooltipValue) {
      tooltipValue.textContent = clientData.roiTotal;
    }
  }

  return { init };
})();

/* ── ENTRY POINT ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  ThemeController.init();
  NavigationController.init();
  ScrollController.init();
  BalanceVisibility.init();
  GreetingController.init();
  ChartDataController.init();
});