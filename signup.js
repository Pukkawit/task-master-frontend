import { toastNotification } from "./myModules.js";
document.querySelector(".back-btn").addEventListener("click", () => {
  window.history.back();
});

const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirmPassword");
const emailField = document.getElementById("email");
const usernameField = document.getElementById("username");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const usernameError = document.getElementById("usernameError");

// Password validation regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate password on change
passwordField.addEventListener("change", () => {
  const password = passwordField.value;
  if (!password) {
    passwordError.style.display = "none";
  } else if (!passwordRegex.test(password)) {
    passwordError.style.display = "block";
    passwordError.textContent =
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  } else {
    passwordError.style.display = "none";
  }
});

// Validate confirm password on change
confirmPasswordField.addEventListener("change", () => {
  const password = passwordField.value;
  const confirmPassword = confirmPasswordField.value;
  if (!confirmPassword || password !== confirmPassword) {
    confirmPasswordError.style.display = "block";
    confirmPasswordError.textContent = "Passwords don't match";
  } else {
    confirmPasswordError.style.display = "none";
  }
});

// Validate email on change
emailField.addEventListener("change", () => {
  const email = emailField.value;
  if (!email) {
    emailError.style.display = "none";
  } else if (!emailRegex.test(email)) {
    emailError.style.display = "block";
    emailError.textContent = "Invalid email format.";
  } else {
    emailError.style.display = "none";
  }
});

// Validate and submit form on button click
document.getElementById("signupButton").addEventListener("click", async (e) => {
  e.preventDefault();

  // Fetch the latest values
  const username = usernameField.value;
  const email = emailField.value;
  const password = passwordField.value;
  const confirmPassword = confirmPasswordField.value;

  // Clear previous error messages
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";

  // Validate inputs
  let isValid = true;

  if (!username) {
    usernameError.textContent = "Username is required.";
    isValid = false;
  }

  if (!email || !emailRegex.test(email)) {
    emailError.textContent = "Valid email is required.";
    isValid = false;
  }

  if (!password || !passwordRegex.test(password)) {
    passwordError.textContent =
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    isValid = false;
  }

  if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords don't match.";
    isValid = false;
  }

  if (!isValid) {
    return; // Exit if validation fails
  }

  // Submit the form via fetch
  try {
    const response = await fetch(
      "https://task-master-backend-gpe8.onrender.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );

    if (response.ok) {
      // Check if the response is successful (status in the range 200-299)
      const data = await response.json();
      toastNotification({
        toastTitle: "Success",
        toastNotificationText:
          /* data.message || */ "Congratulations! Registration is successful",
      });
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 5000);
    } else {
      // Handle errors (status outside the range 200-299)
      const contentType = response.headers.get("content-type");
      let errorMessage;

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          "Registration is unsuccessful due to an unknown error.";
      } else {
        errorMessage = await response.text(); // Fallback to plain text error
      }

      toastNotification({
        toastTitle: "Error",
        toastNotificationText: `Registration is unsuccessful because ${errorMessage}`,
      });

      /* Clear in the input fields */
      usernameField.value = "";
      emailField.value = "";
      passwordField.value = "";
      confirmPasswordField.value = "";

      // Optionally, set timeout to redirect user only on specific errors if needed
      if (response.status === 409) {
        // Handle a redirect or take a specific action for this specific error
        // Example: setTimeout(() => { /* your action here */ }, 5000);
      } else {
        // Set timeout of 5 seconds to redirect user to the login page
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 5000);
      }
    }

    if (response.ok) {
      // Reset form fields on success
      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("confirmPassword").value = "";
    }
  } catch (error) {
    console.error("Error during registration:", error);
    toastNotification({
      toastTitle: "Error",
      toastNotificationText: "Failed to register. Please try again later.",
    });
  }
});
