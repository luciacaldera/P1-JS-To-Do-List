'use strict';

const formElement = document.querySelector('.new-task-form');
const inputElement = document.querySelector('.task-input');
const taskList = document.querySelector('.task-list');
const deleteBtn = document.querySelector('.delete-btn');
const deleteCompletedBtn = document.querySelector('#delete-completed-btn');
let currentEditField = null;

//Creating a new task
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  //getting the value (task text)
  const inputValue = inputElement.value;
  //creating the li and adding the task text
  const taskLi = document.createElement('li');
  taskLi.classList.add('task-item');
  taskLi.textContent = inputValue;
  //creating the checkbox for the new task
  const taskCheckbox = document.createElement('input');
  taskCheckbox.type = 'checkbox';
  taskCheckbox.classList.add('task-checkbox');
  //Adding the checkbox to the li element as its first child
  taskLi.insertBefore(taskCheckbox, taskLi.firstChild);
  //Appending the Li element with the checkbox to the task-list
  taskList.appendChild(taskLi);
  //adding the delete button for that specific task
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Delete';
  taskLi.insertAdjacentElement('beforeend', deleteBtn);
  //resetting the form
  formElement.reset();
});

//Edit when the task is clicked
taskList.addEventListener('click', (e) => {
  const clickedElement = e.target;

  // If the task is completed return
  if (clickedElement.classList.contains('completed')) return;

  //Checking if the clicked element is a checkbox
  if (clickedElement.matches('.task-checkbox')) {
    const taskItem = clickedElement.closest('.task-item');

    // Check if task is being edited
    const isEditing = taskItem.querySelector('.edit-input') !== null;

    // Disable checkbox if editing
    const checkbox = taskItem.querySelector('.task-checkbox');
    if (isEditing) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }

    //Marking the task as completed only if it's not in edit mode
    if (!isEditing) {
      taskItem.classList.toggle('completed');
    }
  }

  // Checking if the clicked element is a task item or deleting if it's the delete button
  if (clickedElement.matches('.task-item')) {
    //Getting the clicked task item
    const taskItem = clickedElement;
    // Checking if the task item already has an edit input
    if (taskItem.querySelector('.edit-input')) {
      return;
    }

    //if the currentEditField is not null, doesn't create new edit input fields for other targets until done
    if (currentEditField) {
      return;
    }

    // Loading the task text into the edit input as a default without the button textContent
    const taskText = taskItem.cloneNode(true);
    taskText.removeChild(taskText.querySelector('button'));
    const taskTextValue = taskText.textContent.trim();
    taskItem.innerHTML += `
      <input type="text" class="edit-input" value="${taskTextValue}">
      <button type="button" class="edit-btn">Save</button>
    `;
    // keeping track of the current task being edited
    currentEditField = clickedElement;

    //Selecting the created edit btn
    const editBtn = document.querySelector('.edit-btn');

    //managing the save button
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const editInputField = document.querySelector('.edit-input');

      taskItem.innerHTML = `<input type="checkbox" class="task-checkbox">
      ${editInputField.value}
      <button class="delete-btn">Delete</button>
      `;
      //resetting the task being edited as none
      currentEditField = null;
    });
  }

  // Check if clicked element is a delete button
  if (clickedElement.classList.contains('delete-btn')) {
    // Get the task item element that contains the delete button
    const taskItem = clickedElement.closest('.task-item');
    taskItem.remove();
  }
});

//Deleting completed tasks functionality
deleteCompletedBtn.addEventListener('click', () => {
  //selecting all the tasks that contain the completed class
  const completedTasks = taskList.querySelectorAll('.task-item.completed');
  completedTasks.forEach((task) => {
    task.remove();
  });
});
