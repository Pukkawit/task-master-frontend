import { getCurrentYear, getCurrentMonthName } from "./myModules.js";

const year = getCurrentYear();
const monthName = getCurrentMonthName();

// Append the formatted date to an element (e.g., with id="year")
document.querySelector("#year").textContent = `${monthName} ${year}`;

/* const API_URL = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJXaXR0eSBVbW9zdW5nIiwiaWF0IjoxNzMyNjU1NjUzLCJleHAiOjE3MzI2NTkyNTN9.McvfXO3dapvM3zF4eQsJ1ESjVZhXgrAcz5Z3DrMXzsM";

const getTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Ensure this header includes the token
        "Content-Type": "application/json", // Include content type
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
    alert("Failed to fetch tasks. Check your token or network.");
  }
};

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
    title.textContent = task.title ?? "No Title"; // Default text if title is undefined

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
    status.appendChild(document.createTextNode(task.status ?? "No Status"));

    task.status === "pending" && (status.style.color = "#317212");
    task.status === "in-progress" && (status.style.color = "#69208b");

    const priority = document.createElement("p");
    const priorityStrong = document.createElement("strong");
    priorityStrong.textContent = "Priority: "; // Create strong element for label
    priority.appendChild(priorityStrong);
    priority.appendChild(
      document.createTextNode(task.priority ?? "No Priority")
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

    // Add event listeners for delete and update commands
    deleteIcon.addEventListener("click", () => {
      const id = task.id;
      deleteTask(id);
    });
    updateIcon.addEventListener("click", () => {
      const id = task.id;

      // TODO: Implement update task functionality
    });
    // Add: a click event listener to the entire task container for updating the deadline
    taskDiv.addEventListener("click", () => {
      document.getElementById("task-title").value = task.title;
      document.getElementById("task-desc").value = task.description;
      document.getElementById("task-priority").value = task.priority;
      document.getElementById("task-deadline").value = task.deadline;
      document.getElementById("task-id").value = task.id;
    });
  });
}; */

/* document.getElementById("add-task").addEventListener("click", async () => {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const status = document.getElementById("task-status").value;
  const priority = document.getElementById("task-priority").value;
  const deadline = document.getElementById("task-deadline").value;

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, status, priority, deadline }),
    });
    if (response.ok) {
      getTasks(); // Refresh the task list
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
}); */

// Initial fetch of tasks
//getTasks();
