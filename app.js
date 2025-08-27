import { getCurrentYear, getCurrentMonthName } from "./myModules.js";

const dashboardToggleButton = document.querySelector(".toggle-button");

const sidebarItems = document.querySelectorAll("aside ul li");

dashboardToggleButton &&
  dashboardToggleButton.addEventListener("click", () => {
    document.querySelector("aside").classList.toggle("active");
    dashboardToggleButton.classList.toggle("active");

    const toggleButtonIcon =
      dashboardToggleButton.childElementCount > 0
        ? dashboardToggleButton.children[0]
        : null;
    if (toggleButtonIcon) {
      toggleButtonIcon.classList.toggle("fa-bars");
      toggleButtonIcon.classList.toggle("fa-xmark");
    }
  });

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector("aside").classList.remove("active");
    dashboardToggleButton.classList.remove("active");

    const toggleButtonIcon =
      dashboardToggleButton.childElementCount > 0
        ? dashboardToggleButton.children[0]
        : null;
    if (toggleButtonIcon) {
      toggleButtonIcon.classList.remove("fa-xmark");
      toggleButtonIcon.classList.add("fa-bars");
    }
  });
});

const year = getCurrentYear();
const monthName = getCurrentMonthName();

// Append the formatted date to an element (e.g., with id="year")
document.querySelector("#year").textContent = `${monthName} ${year}`;
