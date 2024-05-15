// Define an empty array to store tasks
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Get references to HTML elements
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

// Initialize a variable to track the task being edited
let editIndex = -1; // -1 means no task is being edited

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to display tasks in the UI
function renderTasks() {
  // Clear the existing task list
  taskList.innerHTML = "";

  // Loop through each task and create HTML elements for display
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${
        task.completed ? "checked" : ""
      } onchange="toggleTaskCompletion(${index})">
      <span class="${task.completed ? "completed-task" : ""}">${
      task.text
    }</span>
      <div class="button-container">
        <button class="edit-btn" onclick="enableEdit(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  saveTasks();
}

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  // Check if the task text is not empty
  if (taskText !== "") {
    // Check if a task with the same name already exists
    const existingTask = tasks.find(
      (task) => task.text.toLowerCase() === taskText.toLowerCase()
    );
    if (existingTask) {
      alert(
        "A task with the same name already exists. Please use a different name."
      );
      return;
    }

    // Add a new task or update an existing task if in edit mode
    if (editIndex !== -1) {
      tasks[editIndex].text = taskText; // Update task text
      editIndex = -1; // Reset edit mode
    } else {
      tasks.push({ id: Date.now(), text: taskText, completed: false }); // Add new task
    }

    // Update UI and reset input field
    renderTasks();
    taskInput.value = "";
    addTaskBtn.textContent = "Add Task"; // Change button text
  }
}

// Function to toggle task completion status
function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed; // Toggle completed status
  renderTasks(); // Update UI
}

// Function to enable editing of a task
function enableEdit(index) {
  taskInput.value = tasks[index].text; // Fill input field with task text
  editIndex = index; // Set edit mode
  addTaskBtn.textContent = "Update"; // Change button text
  addTaskBtn.style.backgroundColor = "#28a745"; // Change button style
  addTaskBtn.style.color = "whitesmoke"; // Change button style
  taskInput.focus(); // Focus on input field
}

// Function to delete a task
function deleteTask(index) {
  tasks.splice(index, 1); // Remove task from array
  renderTasks(); // Update UI
}

// Event listener for Add Task button click
addTaskBtn.addEventListener("click", addTask);

// Event listener for Enter key press in input field
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask(); // Add task when Enter key is pressed
  }
});

// Initial rendering of tasks
renderTasks();