/* ./frontend/dashboard.js */

import {
  toastNotification,
  alertModal,
  confirmModal,
  toTitleCase,
  greetBasedOnTime,
  getArticle,
  toTitleCaseSentence,
} from "./myModules.js";

const token = localStorage.getItem("token");

const overviewTab = document.querySelector(".overview");
const createTab = document.querySelector(".create");
/* const updateTab = document.querySelector(".update"); */
const overview = document.querySelector("#task-list");
const createTask = document.querySelector("#createTasks");
const updateTask = document.querySelector("#updateTasks");
const pageTitle = document.querySelector(".pageTitle");

const loggedInUser = () => {
  // Retrieve the token from localStorage (or sessionStorage)
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token is found, user is not logged in
    console.log("No user is logged in.");
    return null;
  }

  try {
    // Decode the token payload (assuming it's a JWT)
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      console.log("Token has expired.");
      localStorage.removeItem("token"); // Clear the expired token
      return null;
    }

    // Return the user details from the decoded payload
    console.log("Logged-in user:", decodedPayload);
    return decodedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

//& Login a User
const login = async () => {
  const emailOrUsername = document.getElementById("emailOrUsername").value;
  const password = document.getElementById("password").value;

  const BASE_URL =
    "https://taskmaster-roan.vercel.app" || "http://localhost:3000";

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login successful:", data.token);
      localStorage.setItem("token", data.token); // Store token in localStorage
      window.location.href = "./user-dashboard.html"; // Redirect
    } else {
      toastNotification({
        toastTitle: "Error",
        toastNotificationText: `${data.message} || Login failed. Please try again.`,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    toastNotification({
      toastTitle: "Error",
      toastNotificationText: "An error occurred. Please try again later.",
    });
  }
};
// Attach the function to the global `window` object explicitly
window.login = login;

//^ USER DASHBOARD
if (window.location.href.includes("/user-dashboard.html")) {
  const overviewTasksDisplay = () => {
    pageTitle.textContent = "Overview";
    overview.style.display = "block";
    overviewTab.classList.add("active");
    createTab.classList.remove("active");
    createTask.style.display = "none";
    updateTask.style.display = "none";
    getTasks();
    /*   updateTab.classList.remove("active"); */
  };
  function createTaskFormDisplay() {
    pageTitle.textContent = "Create Tasks";
    createTask.style.display = "block";
    createTab.classList.add("active");
    overview.style.display = "none";
    overviewTab.classList.remove("active");
    updateTask.style.display = "none";
    /*   updateTab.classList.remove("active"); */
  }

  const updateTaskFormDisplay = () => {
    pageTitle.textContent = "Update Tasks";
    updateTask.style.display = "block";
    /*  updateTab.classList.add("active"); */
    overview.style.display = "none";
    overviewTab.classList.remove("active");
    createTask.style.display = "none";
    createTab.classList.remove("active");
  };
  // Validate user on page load
  const validateUser = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "./login.html";
      return;
    }

    console.log("User is authenticated");
  };
  const cancelUpdateTask = document.getElementById("cancel-update-task");
  const cancelCreateTask = document.getElementById("cancel-add-task");

  cancelUpdateTask.addEventListener("click", () => {
    overviewTasksDisplay();
  });
  cancelCreateTask.addEventListener("click", () => {
    overviewTasksDisplay();
  });

  //& Delete Tasks
  const deleteTask = async (id, title) => {
    const token = localStorage.getItem("token"); // Retrieve the token from storage

    try {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alertModal({
          actionName: title,
          alertTitle: "Success",
          mainText: "has been successfully",
          actionVerb: "deleted",
          actionFunction: () => getTasks(),
        });
        // Refresh the task list after deletion
        /* getTasks(); */
      } else {
        const errorData = await response.json();

        // Show an alert modal with the error message
        alertModal({
          actionName: title,
          alertTitle: "Error",
          mainText: "could not be",
          actionVerb: "deleted",
          actionFunction: () => getTasks(),
        });
        console.error(`Failed to delete task: ${errorData.message}`);
        /*   alert(`Failed to delete task: ${errorData.message}`); */
      }
    } catch (error) {
      console.error("Error deleting task:", error);

      alertModal({
        actionName: title,
        alertTitle: "Error",
        mainText: "could not be",
        actionVerb: "deleted",
        actionFunction: () => getTasks(),
      });
      /*    alert("An error occurred. Please try again."); */
    }
  };

  //& Fetch Tasks
  const getTasks = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tasks = await response.json();
      console.log("Fetched tasks:", tasks);
      displayTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toastNotification({
        toastTitle: "Error",
        toastNotificationText:
          "Failed to fetch tasks. Check your token or network.",
      });
      /* alert("Failed to fetch tasks. Check your token or network."); */
    }
  };

  //& Display Tasks
  const displayTasks = (tasks) => {
    const taskList = document.querySelector(".task-list-container");

    // Format deadline to display well
    const formattedTasks = tasks.map((task) => {
      const deadlineDate = new Date(task.deadline);
      const formattedDeadline = `${deadlineDate.getDate()} ${deadlineDate.toLocaleString(
        "default",
        { month: "short" }
      )} ${deadlineDate.getFullYear()}`;
      return { ...task, deadline: formattedDeadline };
    });

    // Clear existing task list
    taskList.innerHTML = "";

    // Create task elements and append them to the task list
    formattedTasks.forEach((task) => {
      // Create a new task container for each task
      const taskDiv = document.createElement("div");
      taskDiv.className = "task"; // set class name for individual styling

      // Create and populate task elements
      const title = document.createElement("h3");
      title.textContent = toTitleCaseSentence(task.title) ?? "No Title"; // Default text if title is undefined

      const description = document.createElement("p");
      const descriptionStrong = document.createElement("strong");
      descriptionStrong.textContent = "Description: "; // Create strong element for label
      description.appendChild(descriptionStrong);
      description.appendChild(
        document.createTextNode(task.description ?? "No Description")
      );

      const status = document.createElement("p");
      const statusStrong = document.createElement("strong");
      statusStrong.textContent = "Status: "; // Create strong element for label

      status.appendChild(statusStrong);
      status.appendChild(
        document.createTextNode(toTitleCase(task.status) ?? "No Status")
      );

      task.status === "completed" && (status.style.color = "#317212");
      task.status === "in-progress" && (status.style.color = "#69208b");
      task.status === "pending" && (status.style.color = "#F79A00");

      const priority = document.createElement("p");
      const priorityStrong = document.createElement("strong");
      priorityStrong.textContent = "Priority: "; // Create strong element for label
      priority.appendChild(priorityStrong);
      priority.appendChild(
        document.createTextNode(toTitleCase(task.priority) ?? "No Priority")
      );

      const deadline = document.createElement("p");
      const deadlineStrong = document.createElement("strong");
      deadlineStrong.textContent = "Deadline: "; // Create strong element for label
      deadline.appendChild(deadlineStrong);
      deadline.appendChild(document.createTextNode(task.deadline));

      // Append task elements to the task container
      taskDiv.appendChild(title);
      taskDiv.appendChild(description);
      taskDiv.appendChild(status);
      taskDiv.appendChild(priority);
      taskDiv.appendChild(deadline);

      // Append the task container to the task list
      taskList.appendChild(taskDiv);

      // Create a Div to Hold the Icons for Delete, Update Commands
      const iconsDiv = document.createElement("div");
      iconsDiv.className = "icons";
      taskDiv.appendChild(iconsDiv);
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "far fa-trash-alt delete";
      const updateIcon = document.createElement("i");
      updateIcon.className = "fas fa-edit edit";
      iconsDiv.appendChild(deleteIcon);
      iconsDiv.appendChild(updateIcon);

      //~ Add event listeners for delete and update commands
      deleteIcon.addEventListener("click", () => {
        const id = task.id;
        const name = task.title;

        confirmModal({
          action: "DElete", // The action to perform
          actionName: name, // The name of the task
          actionFunction: () => deleteTask(id), // The function to call when confirmed
        });
      });

      updateIcon.addEventListener("click", () => {
        const id = task.id;
        // Populate form fields with current task details
        document.getElementById("updateTask-title").value = task.title || "";
        document.getElementById("updateTask-desc").value =
          task.description || "";
        document.getElementById("updateTask-status").value = task.status || "";
        document.getElementById("updateTask-priority").value =
          task.priority || "";
        document.getElementById("updateTask-deadline").value = task.deadline
          ? new Date(task.deadline).toISOString().split("T")[0]
          : "";

        // Show the update form
        updateTaskFormDisplay();

        // Attach the update handler
        document.getElementById("update-task").onclick = () => updateTask(id);
      });
    });

    //& Update Tasks
    const updateTask = async (id, title) => {
      const token = localStorage.getItem("token");

      const updatedTask = {
        title: document.getElementById("updateTask-title").value,
        description: document.getElementById("updateTask-desc").value,
        status: document.getElementById("updateTask-status").value,
        priority: document.getElementById("updateTask-priority").value,
        deadline: document.getElementById("updateTask-deadline").value,
      };

      try {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
          const updatedTaskData = await response.json();
          alertModal({
            alertTitle: "Success",
            actionName: updatedTaskData.title,
            actionFunction: () => getTasks,
            actionVerb: "updated",
          });

          overviewTasksDisplay();
        } else {
          const errorData = await response.json();
          console.log(errorData.message);
          alertModal({
            alertTitle: "Error",
            actionName: updatedTask.title,
            actionFunction: () => getTasks,
            actionVerb: "updated",
            mainText: "but",
            secondaryText: "failed to update",
          });
          /*    alert(`Failed to update task: ${errorData.message}`); */
        }
      } catch (error) {
        console.error("Error updating task:", error);
        toastNotification({
          toastTitle: "Error",
          toastNotificationText: "Failed to update task. Check your network.",
        });
      }
    };
  };

  pageTitle.textContent = "Overview";
  overviewTab.addEventListener("click", () => {
    overviewTasksDisplay();
  });
  createTab.addEventListener("click", () => {
    createTaskFormDisplay();
  });

  /*  updateTab.addEventListener("click", () => {
    updateTaskFormDisplay();
  }); */

  const user = loggedInUser();
  if (user) {
    console.log(`Welcome, ${user.username}!`);
    document.getElementById("loggedInUserName").textContent = user.username;
  } else {
    console.log("Please log in.");
  }

  document.getElementById("greetings").textContent = greetBasedOnTime();

  //& Create new tasks
  document.getElementById("add-task").addEventListener("click", async () => {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const status = document.getElementById("task-status").value;
    const priority = document.getElementById("task-priority").value;
    const deadline = document.getElementById("task-deadline").value;

    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          deadline,
        }),
      });

      // Clear the all fields
      document.getElementById("task-title").value = "";
      document.getElementById("task-desc").value = "";
      document.getElementById("task-status").value = "";
      document.getElementById("task-priority").value = "";
      document.getElementById("task-deadline").value = "";

      if (response.ok) {
        toastNotification({
          toastTitle: "Success",
          toastNotificationText: "A new task has been successfully added.",
        });
        getTasks(); // Refresh the task list
      } else {
        // Handle errors more explicitly
        const errorData = await response.json(); // Parses the JSON response for error details
        toastNotification({
          toastTitle: "Error",
          toastNotificationText:
            errorData.message || "An unexpected error occurred.", // Use the error message if it exists, or a fallback
        });
      }
    } catch (error) {
      // Network error or other issues out of the ordinary
      toastNotification({
        toastTitle: "Error",
        toastNotificationText: "Error adding task: " + error.message, // Show the error message directly
      });
      console.error("Error adding task:", error);
    }
  });

  //& Logout function
  const logout = () => {
    localStorage.removeItem("token"); // Clear the token
    window.location.href = "./login.html"; // Redirect to login page
  };

  // Attach logout functionality to the logout div
  document.getElementById("logout").addEventListener("click", logout);

  document.addEventListener("DOMContentLoaded", () => {
    const priorityBtn = document.getElementById("filter-by-priority");
    const taskListControls = document.querySelector(".task-list-controls");
    const tasksList = document.querySelector(".task-list-container");
    if (!priorityBtn || !taskListControls) {
      console.error("Required elements not found in the DOM.");
      return;
    }

    priorityBtn.addEventListener("click", () => {
      // Check if the input already exists
      if (!document.querySelector(".priority-input")) {
        // Create a Div Element to Hold the input and the icon
        const priorityFilterDiv = document.createElement("div");
        priorityFilterDiv.className = "filter-div";
        priorityFilterDiv.id = "priority-filter";
        taskListControls.appendChild(priorityFilterDiv);

        // Create input element
        const prioritySelect = document.createElement("select");
        prioritySelect.className = "filter-input";
        prioritySelect.setAttribute("placeholder", "Enter priority");
        prioritySelect.id = "priority-select";
        // create and append the options - low, medium, high
        const selectOption = document.createElement("option");
        selectOption.value = "";
        selectOption.text = "Select Priority";
        selectOption.setAttribute("selected", true);
        prioritySelect.add(selectOption);
        const pendingStatusOption = document.createElement("option");
        pendingStatusOption.value = "low";
        pendingStatusOption.text = "Low";
        prioritySelect.add(pendingStatusOption);
        const mediumPriorityOption = document.createElement("option");
        mediumPriorityOption.value = "medium";
        mediumPriorityOption.text = "Medium";
        prioritySelect.add(mediumPriorityOption);
        const completedStatusOption = document.createElement("option");
        completedStatusOption.value = "high";
        completedStatusOption.text = "High";
        prioritySelect.add(completedStatusOption);
        priorityFilterDiv.appendChild(prioritySelect);

        // Create filter button
        const filterSearchBtn = document.createElement("div");
        filterSearchBtn.className = "filter-search-btn";
        const searchIcon = document.createElement("i");
        searchIcon.className = "fas fa-search";
        filterSearchBtn.appendChild(searchIcon);
        filterSearchBtn.id = "filter-search-btn";

        const priorityDivSection = document.querySelector(
          ".priority-div-section"
        );
        // Create close button
        const closeIcon = document.createElement("i");
        closeIcon.className = "fas fa-times";
        const closeBtn = document.createElement("div");
        closeBtn.className = "filter-close-btn";
        closeBtn.appendChild(closeIcon);
        closeBtn.id = "filter-close-btn";
        closeBtn.addEventListener("click", () => {
          priorityFilterDiv.remove();
          priorityBtn.style.backgroundColor = "";
          priorityBtn.removeAttribute("disabled", "true");

          priorityBtn.style.cursor = "";
          getTasks();
          closeBtn.remove();
        });
        // Append close button to controls
        priorityDivSection.appendChild(closeBtn);

        // Append input to controls
        priorityFilterDiv.appendChild(prioritySelect);
        priorityFilterDiv.appendChild(filterSearchBtn);

        // Remove filter button when the input is empty
        prioritySelect.addEventListener("input", () => {
          if (prioritySelect.value.trim() === "") {
            filterSearchBtn.remove();
          }
        });

        priorityBtn.style.backgroundColor = "#ccc";
        priorityBtn.setAttribute("disabled", "true");
        priorityBtn.style.cursor = "not-allowed";

        // Attach filter search click event to filter tasks by priority
        filterSearchBtn.addEventListener("click", async () => {
          const priority = prioritySelect.value.trim();
          if (priority) {
            try {
              // Make the request to the backend to filter tasks with status "completed"
              const response = await fetch(
                `${BASE_URL}/tasks/filter?priority=${priority}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                const errorData = await response.json();

                toastNotification({
                  toastTitle: "Error",
                  toastNotificationText: `Error: ${errorData.message}`,
                });

                return;
              }

              // Parse the response JSON
              const tasks = await response.json();

              if (tasks.length === 0) {
                alertModal({
                  alertTitle: "Oops!",
                  mainText: `There is no task with a ${priority} priority`,
                  actionFunction: () => getTasks(),
                });
              } else {
                displayTasks(tasks);
              }
            } catch (error) {
              console.error("Error fetching tasks' by Due dates :", error);

              toastNotification({
                toastTitle: "Error",
                toastNotificationText:
                  "An error occurred. Please try again later.",
              });
            }
          } else {
            toastNotification({
              toastTitle: "Error",
              toastNotificationText: "There is an error",
            });
          }
        });
      } else {
        console.log("Priority input already exists.");
      }
    });

    //^ ===================================================
    //^ Filter by Status */
    const statusBtn = document.getElementById("filter-by-status");

    if (!statusBtn || !taskListControls) {
      console.error("Required elements not found in the DOM.");
      return;
    }

    statusBtn.addEventListener("click", () => {
      // Check if the input already exists
      if (!document.querySelector(".status-input")) {
        // Create a Div Element to Hold the input and the icon
        const statusFilterDiv = document.createElement("div");
        statusFilterDiv.className = "filter-div";
        statusFilterDiv.id = "status-filter";
        taskListControls.appendChild(statusFilterDiv);

        // Create input element
        const statusSelect = document.createElement("select");
        statusSelect.className = "filter-input";
        statusSelect.setAttribute("placeholder", "Enter status");
        statusSelect.id = "status-input";

        // create and append the options - pending, in-progress, completed
        const selectOption = document.createElement("option");
        selectOption.value = "";
        selectOption.text = "Select Status";
        selectOption.setAttribute("selected", true);
        statusSelect.add(selectOption);
        const pendingStatusOption = document.createElement("option");
        pendingStatusOption.value = "pending";
        pendingStatusOption.text = "Pending";
        statusSelect.add(pendingStatusOption);
        const inProgressStatusOption = document.createElement("option");
        inProgressStatusOption.value = "in-progress";
        inProgressStatusOption.text = "In Process";
        statusSelect.add(inProgressStatusOption);
        const completedStatusOption = document.createElement("option");
        completedStatusOption.value = "completed";
        completedStatusOption.text = "Completed";
        statusSelect.add(completedStatusOption);
        statusFilterDiv.appendChild(statusSelect);

        // Create filter button
        const filterSearchBtn = document.createElement("div");
        filterSearchBtn.className = "filter-search-btn";
        const searchIcon = document.createElement("i");
        searchIcon.className = "fas fa-search";
        filterSearchBtn.appendChild(searchIcon);
        filterSearchBtn.id = "filter-search-btn";

        const statusDivSection = document.querySelector(".status-div-section");
        // Create close button
        const closeIcon = document.createElement("i");
        closeIcon.className = "fas fa-times";
        const closeBtn = document.createElement("div");
        closeBtn.className = "filter-close-btn";
        closeBtn.appendChild(closeIcon);
        closeBtn.id = "filter-close-btn";
        closeBtn.addEventListener("click", () => {
          statusFilterDiv.remove();
          statusBtn.style.backgroundColor = "";
          statusBtn.style.cursor = "";
          statusBtn.removeAttribute("disabled", "true");
          getTasks();

          closeBtn.remove();
        });
        // Append close button to controls
        statusDivSection.appendChild(closeBtn);

        // Append input to controls
        statusFilterDiv.appendChild(statusSelect);
        statusFilterDiv.appendChild(filterSearchBtn);

        // Remove filter button when the input is empty
        statusSelect.addEventListener("input", () => {
          if (statusSelect.value.trim() === "") {
            filterSearchBtn.remove();
          }
        });

        statusBtn.style.backgroundColor = "#ccc";
        statusBtn.style.cursor = "not-allowed";
        statusBtn.setAttribute("disabled", "true");

        // Attach filter search click event to filter tasks by status
        filterSearchBtn.addEventListener("click", async () => {
          const status = statusSelect.value.trim();
          if (status) {
            try {
              // Make the request to the backend to filter tasks with status "completed"
              const response = await fetch(
                `${BASE_URL}/tasks/filter?status=${status}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                toastNotification({
                  toastTitle: "Error",
                  toastNotificationText: `Error: ${errorData.message}`,
                });

                return;
              }

              // Parse the response JSON
              const tasks = await response.json();
              if (tasks.length === 0) {
                alertModal({
                  alertTitle: "Oops!",
                  mainText: `There is no task with "${getArticle(
                    status
                  )}" status`,
                  actionFunction: () => getTasks(),
                });
              } else {
                displayTasks(tasks);
              }
            } catch (error) {
              console.error("Error fetching tasks' by Due dates :", error);
              toastNotification({
                toastTitle: "Error",
                toastNotificationText: `An error occurred. Please try again later.`,
              });
            }
          } else {
            toastNotification({
              toastTitle: "Error",
              toastNotificationText: `Please select status`,
            });
          }
        });
      } else {
        console.log("Status input already exists.");
      }
    });
    //^ ===================================================

    //^ Filter by Due Date */
    const dueDateBtn = document.getElementById("filter-by-dueDate");

    if (!dueDateBtn || !taskListControls) {
      console.error("Required elements not found in the DOM.");
      return;
    }

    dueDateBtn.addEventListener("click", () => {
      // Check if the input already exists
      if (!document.querySelector(".dueDate-input")) {
        // Create a Div Element to Hold the input and the icon
        const dueDateFilterDiv = document.createElement("div");
        dueDateFilterDiv.className = "filter-div ";
        dueDateFilterDiv.id = "dueDate-filter";
        taskListControls.appendChild(dueDateFilterDiv);

        // Create input element
        const dueDateInput = document.createElement("input");
        dueDateInput.className = "filter-input dueDate";
        dueDateInput.setAttribute("placeholder", "Choose Due Date");
        dueDateInput.setAttribute("type", "date");
        dueDateInput.id = "dueDate-input";

        // Create filter button
        const filterSearchBtn = document.createElement("div");
        filterSearchBtn.className = "filter-search-btn";
        const searchIcon = document.createElement("i");
        searchIcon.className = "fas fa-search";
        filterSearchBtn.appendChild(searchIcon);
        filterSearchBtn.id = "filter-search-btn";

        const dueDateDivSection = document.querySelector(
          ".dueDate-div-section"
        );
        // Create close button
        const closeIcon = document.createElement("i");
        closeIcon.className = "fas fa-times";
        const closeBtn = document.createElement("div");
        closeBtn.className = "filter-close-btn";
        closeBtn.appendChild(closeIcon);
        closeBtn.id = "filter-close-btn";
        closeBtn.addEventListener("click", () => {
          dueDateFilterDiv.remove();
          dueDateBtn.style.backgroundColor = "";
          dueDateBtn.style.cursor = "";
          dueDateBtn.removeAttribute("disabled", "true");
          getTasks();
          closeBtn.remove();
        });
        // Append close button to controls
        dueDateDivSection.appendChild(closeBtn);

        // Append input to controls
        dueDateFilterDiv.appendChild(dueDateInput);
        dueDateFilterDiv.appendChild(filterSearchBtn);

        // Remove filter button when the input is empty
        dueDateInput.addEventListener("input", () => {
          if (dueDateInput.value.trim() === "") {
            filterSearchBtn.remove();
          }
        });

        dueDateBtn.style.backgroundColor = "#ccc";
        dueDateBtn.style.cursor = "not-allowed";
        dueDateBtn.setAttribute("disabled", "true");

        // Attach filter search click event to filter tasks by dueDate
        filterSearchBtn.addEventListener("click", async () => {
          const dueDate = document.getElementById("dueDate-input").value.trim();
          if (dueDate) {
            /* filterTasksBydueDate(dueDate); */

            try {
              // Make the request to the backend to filter tasks with status "completed"
              const response = await fetch(
                `${BASE_URL}/tasks/filter?due_date=${dueDate}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                toastNotification({
                  toastTitle: "Error",
                  toastNotificationText: `Error: ${errorData.message}`,
                });

                return;
              }

              // Parse the response JSON
              const tasks = await response.json();

              if (tasks.length === 0) {
                alertModal({
                  alertTitle: "Oop! There is no completed tasks found.",
                });
              } else {
                displayTasks(tasks);
              }
            } catch (error) {
              console.error("Error fetching tasks' by Due dates :", error);
              toastNotification({
                toastTitle: "Error",
                toastNotificationText:
                  "An error occurred. Please try again later.",
              });
            }
          } else {
            toastNotification({
              toastTitle: "Error",
              toastNotificationText: "Please set a new date",
            });
          }
        });
      } else {
        console.log("Date input already exists.");
      }
    });

    //^ ===================================================
    //^ Filter by Completed Tasks */
    const completedBtn = document.getElementById("show-completed-tasks");

    if (!completedBtn || !taskListControls) {
      console.error("Required elements not found in the DOM.");
      return;
    }

    completedBtn.addEventListener("click", async () => {
      // Check if the input already exists
      if (!document.querySelector(".completed-input")) {
        const completedDivSection = document.querySelector(
          ".completed-div-section"
        );
        // Create close button
        const closeIcon = document.createElement("i");
        closeIcon.className = "fas fa-times";
        const closeBtn = document.createElement("div");
        closeBtn.className = "filter-close-btn";
        closeBtn.appendChild(closeIcon);
        closeBtn.id = "filter-close-btn";
        closeBtn.addEventListener("click", () => {
          completedBtn.style.backgroundColor = "";
          completedBtn.style.cursor = "";
          completedBtn.removeAttribute("disabled", "true");
          getTasks();

          closeBtn.remove();
        });
        // Append close button to controls
        completedDivSection.appendChild(closeBtn);
        completedBtn.style.backgroundColor = "#ccc";
        completedBtn.style.cursor = "not-allowed";
        completedBtn.setAttribute("disabled", "true");

        try {
          // Make the request to the backend to filter tasks with status "completed"
          const response = await fetch(
            `${BASE_URL}/tasks/filter?status=completed`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            toastNotification({
              toastTitle: "Error",
              toastNotificationText: `Error: ${errorData.message}`,
            });

            return;
          }

          // Parse the response JSON
          const tasks = await response.json();
          if (tasks.length === 0) {
            tasksList.innerHTML = "<p>No completed tasks found.</p>";
          } else {
            displayTasks(tasks);
          }
        } catch (error) {
          console.error("Error fetching completed tasks:", error);
          toastNotification({
            toastTitle: "Error",
            toastNotificationText: "An error occurred. Please try again later.",
          });
        }
      } else {
        console.log("Date input already exists.");
      }
    });

    //^ ===================================================
    //^ Search Tasks using Keywords */
    const searchedInput = document.getElementById("task-search");
    const searchedbtn = document.getElementById("search-task");

    searchedInput.addEventListener("input", () => {
      // Check if the input field is empty
      if (searchedInput.value.trim() === "") {
        // Call the getTasks function if the input is empty
        getTasks();
      }
    });

    if (!searchedInput || !searchedbtn) {
      console.error("Required elements not found in the DOM.");
      return;
    }

    searchedbtn.addEventListener("click", async () => {
      // Get the value of the keyword to search for
      const searchedKeyword = searchedInput.value.trim();

      // Check if the searched keyword is empty
      if (searchedKeyword === "") {
        toastNotification({
          toastTitle: "Error",
          toastNotificationText: "Please enter your desired keyword.",
        });
        return; // Exit early if there's no keyword
      }

      try {
        // Make the request to the backend to filter tasks with the provided searchedKeyword
        const response = await fetch(
          `${BASE_URL}/tasks/search?keyword=${encodeURIComponent(
            searchedKeyword
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Log the searched keyword
        console.log(searchedKeyword);

        // Check if the response was successful
        if (!response.ok) {
          const errorData = await response.json();
          toastNotification({
            toastTitle: "Error",
            toastNotificationText: `Error: ${
              errorData.message || "An unknown error occurred"
            }`,
          });
          return;
        }

        // Parse the response JSON
        const tasks = await response.json();

        // Check if tasks are found or not
        if (tasks.length === 0) {
          alertModal({
            alertTitle: "Oops!",
            mainText: `There are no task with the keyword: "${searchedKeyword}"`,
            actionFunction: () => getTasks(),
          });
        } else {
          displayTasks(tasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toastNotification({
          toastTitle: "Error",
          toastNotificationText: `An error occurred. Please try again later.`,
        });
      }
    });
  });

  validateUser();
  getTasks();
}
