document.addEventListener("DOMContentLoaded", loadNavbar);

async function loadNavbar() {
  try {
    const response = await fetch("components/navbar.html");
    const navbarHTML = await response.text();
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);
    initializeNavbar();
  } catch (err) {
    console.error("Navbar load failed:", err);
  }
}

function initializeNavbar() {
  setupSettings();
  loadSavedPreferences();
}

/* ======================
   SETTINGS + DROPDOWN
====================== */
function setupSettings() {
  const tray = document.getElementById("settingsTray");
  const btn = document.getElementById("settingsBtn");
  const modeToggle = document.getElementById("modeToggle");
  const themeSelect = document.getElementById("themeSelect");

  // Toggle tray visibility
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent document click
    tray.style.display = tray.style.display === "flex" ? "none" : "flex";
  });

  // Prevent tray from closing when clicking inside it (like select)
  tray.addEventListener("click", (e) => e.stopPropagation());

  // Close tray when clicking outside
  document.addEventListener("click", () => {
    tray.style.display = "none";
  });

  /* ======================
     DARK / LIGHT TOGGLE
  ===================== */
  modeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-mode") || "dark";
    const newMode = current === "dark" ? "light" : "dark";
    html.setAttribute("data-mode", newMode);
    localStorage.setItem("mode", newMode);
  });

  /* ======================
     COLOR THEME SELECT
  ===================== */
const themes = {
  blue:   { primary: "#020a3a", bg: "#024b99", text: "#ffffff", light: "#0a3cd1" },
  green:  { primary: "#04d17c", bg: "#03a152", text: "#ffffff", light: "#28e29b" },
  pink:   { primary: "#ff0482", bg: "#fa74b5", text: "#000000", light: "#ff7ac4" },
  purple: { primary: "#430357", bg: "#aa05f7", text: "#000000", light: "#7a05ff" },
};

themeSelect.addEventListener("change", (e) => {
  const selected = e.target.value;
  if (!selected) return;

  const root = document.documentElement;
  const theme = themes[selected];

  // Animate transition
  root.style.transition = "background 0.8s ease, color 0.8s ease";

  // Apply radial gradient: center light, outer dark
  document.body.style.background = `radial-gradient(circle at center, ${theme.light} 0%, ${theme.bg} 100%)`;
  root.style.setProperty("--primary-color", theme.primary);
  root.style.setProperty("--text-color", theme.text);

  localStorage.setItem("themeColor", selected);
});
}
/* ======================
   LOAD SAVED PREFERENCES
====================== */
function loadSavedPreferences() {
  const savedMode = localStorage.getItem("mode");
  if (savedMode) {
    document.documentElement.setAttribute("data-mode", savedMode);
  }

  const savedTheme = localStorage.getItem("themeColor");
  if (savedTheme) {
    document.documentElement.style.setProperty("--primary-color", themes[savedTheme].primary);
    document.documentElement.style.setProperty("--bg-color", themes[savedTheme].bg);
    document.documentElement.style.setProperty("--text-color", themes[savedTheme].text);
    document.body.classList.add("shimmer");
  }
}
  