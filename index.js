const Connection = require("mysql/lib/Connection");

document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  // const deadLine = document.getElementById("deadline-input");
  const priorityInput = document.getElementById("priority-input");
  const tags = document.getElementById("tag");
  const taskList = document.getElementById("task-list");
  const dateIn = document.getElementById("dateInput");
  const timeIn = document.getElementById("timeInput");

  const mysql = require("mysql");
  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "database pwd",
    database: "taskManage",
  });

  Connection.connect((err) => {
    if (err) {
      console.log("error connecting to mysql :", err);
      return;
    }
  });

  taskForm.addEventListener("submit", addTask);
  function addTask(e) {
    e.preventDefault();
    console.log("added successfully");

    const Lists = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = `${taskInput.value}- Due:${dateIn.value} ${timeIn.value}- Tags: ${tags.value}`;
    taskText.classList.add(`priority-${priorityInput.value}`);

    const dltBtn = document.createElement("button");
    dltBtn.textContent = "Delete";
    dltBtn.classList.add("deleteBtn");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("EditBtn");

    Lists.appendChild(taskText);
    Lists.appendChild(dltBtn);
    Lists.appendChild(editBtn);
    taskList.appendChild(Lists);

    const deadLineDate = new Date(`${dateIn.value}T${timeIn.value}`);
    const curDate = new Date().getTime();
    const timeLeft = deadLineDate.getTime() - curDate;

    if (timeLeft > 0) {
      setTimeout(() => {
        alert(`Task ${taskInput.value} is due in ${formatTimeLeft(timeLeft)}`);
      }, timeLeft);
    }

    taskInput.value = "";
    dateIn.value = "";
    timeIn.value = "";
    priorityInput.value = "low";
    tags.value = "";

    dltBtn.addEventListener("click", () => {
      taskList.removeChild(Lists);
    });
    editBtn.addEventListener("click", () => {
      const editTask = prompt(
        "new task:",
        taskText.textContent.split("-Due:")[0]
      );
      const newDate = prompt("new date:", dateIn.value);
      const newTime = prompt("new Time (HH:MM):", timeIn.value);
      const newTag = prompt("new Tag:", tags.value);

      if (editTask != null && newDate != null && newTime != null) {
        taskText.textContent = `${editTask}-Due: ${newDate}:${newTime}-Tags:${newTag}`;
      }

      const newDeadLineDate = new Date(`${newDate}T${newTime}`);
      const curDate = new Date().getTime();
      const timeRemaining = newDeadLineDate.getTime() - curDate;
      if (timeRemaining > 0) {
        setTimeout(() => {
          alert(
            ` pending task:${editTask}" due in ${formatTimeLeft(timeRemaining)}`
          );
        }, timeRemaining);
      }
    });
  }
  function formatTimeLeft(timeLeft) {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours and ${minutes} minutes`;
  }
});
