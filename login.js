import { togglePasswordVisibility } from "./myModules.js";
document.querySelector(".back-btn").addEventListener("click", () => {
  window.history.back();
});

document.addEventListener("DOMContentLoaded", () => {
  togglePasswordVisibility({
    passwordInputID: "password",
    passwordConfirmInputID: null, // No confirm password on login
    hidePasswordIconID: "hidePassword",
    revealPasswordIconID: "revealPassword",
    passwordToggleIconID: "passwordToggleIcon",
  });
});
