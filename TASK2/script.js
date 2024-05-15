const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
let editIndex = -1;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  // Sort tasks by priority before rendering
  const sortedTasks = tasks.sort((a, b) => a.priority - b.priority);

  sortedTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${
        task.completed ? "checked" : ""
      } onchange="toggleTaskCompletion(${index})">
      <span class="${task.completed ? "completed-task" : ""}">${task.text}</span>
      <span class="task-date">Created: ${new Date(task.createdAt).toLocaleString()}</span>
      <span class="task-priority">Priority: ${task.priority}</span>
      <div class="button-container">
        <button class="edit-btn" onclick="enableEdit(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  saveTasks();
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const existingTask = tasks.find(
      (task) => task.text.toLowerCase() === taskText.toLowerCase()
    );
    if (existingTask) {
      alert("A task with the same name already exists. Please use a different name.");
      return;
    }

    const taskPriority = prompt("Enter priority (1-10) for the task:");
    if (!taskPriority || isNaN(taskPriority) || taskPriority < 1 || taskPriority > 10) {
      alert("Priority must be a number between 1 and 10.");
      return;
    }

    if (editIndex !== -1) {
      tasks[editIndex].text = taskText;
      tasks[editIndex].priority = parseInt(taskPriority);
      editIndex = -1;
    } else {
      tasks.push({ id: Date.now(), text: taskText, completed: false, createdAt: Date.now(), priority: parseInt(taskPriority) });
    }

    renderTasks();
    taskInput.value = "";
    addTaskBtn.textContent = "Add Task";
  }
}

function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function enableEdit(index) {
  taskInput.value = tasks[index].text;
  editIndex = index;
  addTaskBtn.textContent = "Update";
  addTaskBtn.style.backgroundColor = "#28a745";
  addTaskBtn.style.color = "whitesmoke";
  taskInput.focus();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();
