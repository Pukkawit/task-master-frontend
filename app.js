import { getCurrentYear, getCurrentMonthName } from "./myModules.js";

const year = getCurrentYear();
const monthName = getCurrentMonthName();

// Append the formatted date to an element (e.g., with id="year")
document.querySelector("#year").textContent = `${monthName} ${year}`;
