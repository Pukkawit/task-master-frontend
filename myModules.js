// Get the current year
export const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
};

// Get the current month name
export const getCurrentMonthName = () => {
  const date = new Date();
  const month = date.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
};

export const greetBasedOnTime = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

export const toastNotification = ({
  toastTitle,
  toastNotificationText,
  bgColor = "black", // default value
  borderColor = "black",
  color = "white", // default value
}) => {
  // Check if a toast notification element already exists in the DOM
  const existingToastNotification = document.querySelector(
    "#toast-notification"
  );
  if (existingToastNotification) {
    existingToastNotification.textContent = toastNotificationText; // Update the existing toast notification text
    existingToastNotification.style.backgroundColor = bgColor; // Update the background color as well
    existingToastNotification.style.color = color; // Update the text color as well
    existingToastNotification.classList.remove("fade-out"); // Reset any fade out effect
    existingToastNotification.style.display = "block"; // Ensure it's displayed

    // Reset the timeout if one existed
    clearTimeout(existingToastNotification.timeoutId);
    existingToastNotification.timeoutId = setTimeout(() => {
      existingToastNotification.classList.add("fade-out"); //fade out effect
      setTimeout(() => {
        existingToastNotification.remove(); // Remove after fade out
      }, 500); // Settings based on the CSS transition duration
    }, 5000);
    return;
  }

  if (toastTitle === "Success") {
    bgColor = "#276d06be"; // Green
    color = "#fff";
    borderColor = "#317212";
  } else if (toastTitle === "Error") {
    borderColor = "#cc1010"; // Red
    bgColor = "#cc1010cc";
    color = "#fff";
  }

  // Create the toast notification element
  const toastElement = document.createElement("div");
  toastElement.id = "toast-notification";
  toastElement.className = "toast-notification";
  toastElement.style.backgroundColor = bgColor;
  toastElement.style.borderColor = borderColor;
  toastElement.style.color = color;

  // Title and text setup
  const title = document.createElement("h4");
  title.className = "toast-notification-title-text";
  title.textContent = `${toTitleCase(toastTitle)}!`;

  const text = document.createElement("p");
  text.className = "toast-notification-text";
  text.textContent = toastNotificationText;

  const closeBtn = document.createElement("i");
  closeBtn.className = "notification-close-btn fas fa-times";
  closeBtn.style.cursor = "pointer";

  // Close button event listener
  closeBtn.addEventListener("click", () => {
    toastElement.classList.add("fade-out");
    setTimeout(() => {
      toastElement.remove(); // Only remove after fade out
    }, 500); // Based on CSS transition duration
  });

  // Appending elements to the toast notification
  toastElement.appendChild(closeBtn);
  toastElement.appendChild(title);
  toastElement.appendChild(text);

  // Appending the toast notification to the body
  document.body.appendChild(toastElement);

  // Setting up automatic removal after 5 seconds
  toastElement.timeoutId = setTimeout(() => {
    toastElement.classList.add("fade-out");
    setTimeout(() => {
      toastElement.remove(); // Remove after fade out
    }, 500); // Based on CSS transition duration
  }, 5000);
};

export const toTitleCase = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const toTitleCaseSentence = (sentence) => {
  return sentence
    .toLowerCase() // Convert entire string to lower case first
    .split(" ") // Split string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the array of words back into a single string
};

export const confirmModal = ({ action, actionName, actionFunction }) => {
  const overLay = document.createElement("div");
  overLay.id = "modalOverlay";
  overLay.className = "modalOverlay";

  const confirmModal = document.createElement("div");
  confirmModal.id = "confirm-modal";
  confirmModal.className = "confirm-modal";

  // Title and text setup
  const title = document.createElement("h4");
  title.className = "title-text";
  title.textContent = `${toTitleCase(action)} ${actionName}?`;

  const text = document.createElement("p");
  text.className = "main-text";
  text.textContent = `Are you sure you want to ${action.toLowerCase()} ${actionName}? This action cannot be undone.`;

  // Button div setup
  const btnsDiv = document.createElement("div");
  btnsDiv.className = "modalBtnsDiv";

  // Confirm button setup
  const confirmBtn = document.createElement("button");
  confirmBtn.className = "confirm-btn";
  confirmBtn.textContent = toTitleCase(action);

  // Cancel button setup
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel-btn";
  cancelBtn.textContent = "Cancel";

  // Appending elements to the modal
  confirmModal.appendChild(title);
  confirmModal.appendChild(text);
  confirmModal.appendChild(btnsDiv);
  btnsDiv.appendChild(confirmBtn);
  btnsDiv.appendChild(cancelBtn);

  // Appending overlay and modal to the body
  document.body.appendChild(overLay);
  document.body.appendChild(confirmModal);

  // Confirm button action
  confirmBtn.addEventListener("click", () => {
    actionFunction(); // Call the function
    confirmModal.remove(); // Remove modal after action
    overLay.remove(); // Remove overlay after action
  });

  // Cancel button action
  cancelBtn.addEventListener("click", () => {
    confirmModal.remove(); // Remove modal when canceled
    overLay.remove(); // Remove overlay when canceled
  });
};

export const alertModal = ({
  alertTitle,
  mainText,
  actionVerb,
  actionName,
  actionFunction,
  bgColor,
}) => {
  const overLay = document.createElement("div");
  overLay.id = "modalOverlay";
  overLay.className = "modalOverlay";

  const alertModal = document.createElement("div");
  alertModal.id = "alert-modal";
  alertModal.className = "alert-modal";
  alertModal.style.backgroundColor = bgColor && bgColor;

  // Title and text setup
  const title = document.createElement("h4");
  title.className = "title-text";
  title.textContent = `${toTitleCase(alertTitle)}!`;

  const text = document.createElement("p");
  text.className = "main-text";
  text.textContent = `${actionName ? actionName : ""} ${
    mainText ? mainText : `has been successfully`
  } ${actionVerb ? actionVerb.toLowerCase() : ""}`;

  // Button div setup
  const btnsDiv = document.createElement("div");
  btnsDiv.className = "modalBtnsDiv";

  // Confirm button setup
  const confirmBtn = document.createElement("button");
  confirmBtn.className = "confirm-btn";
  confirmBtn.textContent = "Ok";

  // Appending elements to the modal
  alertModal.appendChild(title);
  alertModal.appendChild(text);
  alertModal.appendChild(btnsDiv);
  btnsDiv.appendChild(confirmBtn);

  // Appending overlay and modal to the body
  document.body.appendChild(overLay);
  document.body.appendChild(alertModal);

  // Confirm button action
  confirmBtn.addEventListener("click", () => {
    actionFunction() && actionFunction(); // Call the function
    alertModal.remove(); // Remove modal after action
    overLay.remove(); // Remove overlay after action
  });
};

export const getArticle = (word) => {
  // Convert word to lowercase for uniformity
  const lowercaseWord = word.toLowerCase();

  // Check the first letter of the word
  const firstLetter = lowercaseWord.charAt(0);

  // List of vowels
  const vowels = ["a", "e", "i", "o", "u"];

  // If the first letter is a vowel, return 'an', otherwise return 'a'
  return vowels.includes(firstLetter) ? "an" : "a";
};

export const formatDate = (date) => {
  const completeDate = new Date(date);

  // Validate the date
  if (isNaN(completeDate.getTime())) {
    throw new Error("Invalid date");
  }

  const day = completeDate.getDate().toString().padStart(2, "0"); // Pad single digits
  const month = completeDate.toLocaleString("en-US", { month: "short" }); // Another property is long. e.g. short is Dec, long is December
  const year = completeDate.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
};

export const togglePasswordVisibility = ({
  passwordInputID,
  hidePasswordIconID,
  revealPasswordIconID,
  passwordToggleIconID,
}) => {
  const passwordInput = document.getElementById(passwordInputID);
  const hidePasswordIcon = document.getElementById(hidePasswordIconID);
  const revealPasswordIcon = document.getElementById(revealPasswordIconID);
  const passwordToggleIcon = document.getElementById(passwordToggleIconID);

  // Initialize the toggle icon state
  hidePasswordIcon.style.opacity = "1"; // Show hide icon
  revealPasswordIcon.style.opacity = "0"; // Hide reveal icon

  // Password toggle event listener
  if (!passwordToggleIcon.dataset.listenerAdded) {
    passwordToggleIcon.dataset.listenerAdded = true;

    passwordToggleIcon.addEventListener("click", () => {
      console.log("Password toggle clicked"); // Debugging statement

      // Determine visibility state
      const isPasswordVisible = passwordInput.type === "text";

      // Toggle password visibility
      passwordInput.type = isPasswordVisible ? "password" : "text";

      // Toggle icon visibility
      hidePasswordIcon.style.opacity = isPasswordVisible ? "1" : "0"; // Show/Hide eye slash icon
      revealPasswordIcon.style.opacity = isPasswordVisible ? "0" : "1"; // Show/Hide reveal icon
    });
  }
};

export const toggleConfirmPasswordVisibility = ({
  passwordConfirmInputID,
  hideConfirmPasswordIconID,
  revealConfirmPasswordIconID,
  passwordConfirmToggleIconID,
}) => {
  const passwordConfirmInput = document.getElementById(passwordConfirmInputID);
  const hideConfirmPasswordIcon = document.getElementById(
    hideConfirmPasswordIconID
  );
  const revealConfirmPasswordIcon = document.getElementById(
    revealConfirmPasswordIconID
  );
  const passwordConfirmToggleIcon = document.getElementById(
    passwordConfirmToggleIconID
  );

  // Initialize the toggle icon state
  hideConfirmPasswordIcon.style.opacity = "1"; // Show hide icon
  revealConfirmPasswordIcon.style.opacity = "0"; // Hide reveal icon

  // Confirm password toggle event listener
  if (!passwordConfirmToggleIcon.dataset.listenerAdded) {
    passwordConfirmToggleIcon.dataset.listenerAdded = true;

    passwordConfirmToggleIcon.addEventListener("click", () => {
      console.log("Confirm password toggle clicked"); // Debugging statement

      // Determine visibility state
      const isConfirmPasswordVisible = passwordConfirmInput.type === "text";

      // Toggle confirm password visibility
      passwordConfirmInput.type = isConfirmPasswordVisible
        ? "password"
        : "text";

      // Toggle icon visibility
      hideConfirmPasswordIcon.style.opacity = isConfirmPasswordVisible
        ? "1"
        : "0"; // Show/Hide eye slash icon
      revealConfirmPasswordIcon.style.opacity = isConfirmPasswordVisible
        ? "0"
        : "1"; // Show/Hide reveal icon
    });
  }
};

// Usage in the Login Page
document.addEventListener("DOMContentLoaded", () => {
  togglePasswordVisibility({
    passwordInputID: "password",
    hidePasswordIconID: "hidePassword",
    revealPasswordIconID: "revealPassword",
    passwordToggleIconID: "passwordToggleIcon",
  });
});

// Usage in the Signup Page
document.addEventListener("DOMContentLoaded", () => {
  togglePasswordVisibility({
    passwordInputID: "password",
    hidePasswordIconID: "hidePassword",
    revealPasswordIconID: "revealPassword",
    passwordToggleIconID: "passwordToggleIcon",
  });

  toggleConfirmPasswordVisibility({
    passwordConfirmInputID: "confirmPassword",
    hideConfirmPasswordIconID: "hideConfirmPassword",
    revealConfirmPasswordIconID: "revealConfirmPassword",
    passwordConfirmToggleIconID: "passwordConfirmToggleIcon",
  });
});
