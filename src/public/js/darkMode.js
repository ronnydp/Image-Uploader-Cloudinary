const buttonTheme = document.getElementById("button-theme");
const modeIcon = document.getElementById("mode-icon");

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    modeIcon.src = "/img/Sun_fill.svg";
    localStorage.setItem("dark-mode", "enabled");
  } else {
    modeIcon.src = "/img/Moon_fill.svg";
    localStorage.setItem("dark-mode", "disabled");
  }
}

if (localStorage.getItem("dark-mode") === "enabled") {
  document.body.classList.toggle("dark-mode");
  modeIcon.src = "/img/Sun_fill.svg";
}

buttonTheme.addEventListener("click", toggleDarkMode);
