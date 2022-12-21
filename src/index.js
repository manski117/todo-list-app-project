import _ from 'lodash';
import './style.css';

///////global vars
let selectedProject = undefined;
let currentTask = undefined;
let projectToEdit = undefined;

///////modules
const Validation = (() => {
  //this module assesses the validity of form content before it is passed into javascript
  //all regular functions take strings as args and return a boolean
  //the functions that take no arguments add event listeners that should always be running

  function isValidDate(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      return false;
    }

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
      return false;
    }

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
      monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  }
  function clearAllErrorFeedback() {
    //vars
    let taskEditNameError = document.querySelector("#task-title-edit-error");
    let taskEditDateError = document.querySelector("#date-edit-error");
    let taskEditDescriptionError = document.querySelector(
      "#description-edit-error"
    );
    let taskTitleError = document.querySelector("#task-title-error");
    let taskDateError = document.querySelector("#task-date-error");
    let taskDescriptionError = document.querySelector(
      "#task-description-error"
    );
    let projectEditNameError = document.querySelector(
      "#project-edit-name-error"
    );
    let projectNameError = document.querySelector("#project-name-error");

    //action
    taskEditDescriptionError.innerText = "";
    taskEditDateError.innerText = "";
    taskEditNameError.innerText = "";
    taskDescriptionError.innerText = "";
    taskDateError.innerText = "";
    taskTitleError.innerText = "";
    projectEditNameError.innerText = "";
    projectNameError.innerText = "";
  }

  //the following functions require strings as args
  function newProjectValidity(projectName) {
    let isValid = true;

    //grab DOM elements' content via inpupt.value
    const projectNameError = document.querySelector("#project-name-error");
    const allProjects = Projects.allProjects;

    //make sure projectName is between 1-18 characters
    if (projectName === "") {
      projectNameError.innerText = "Please type in your project name.";
      isValid = false;
      return isValid;
    } else {
      projectNameError.innerText = "";
    }
    //make sure projectName not ONLY spaces
    //the regex test here returns false if spaces are the ONLY character in a string
    if (/.*\S.*/.test(projectName) === false) {
      projectNameError.innerText = "Project name cannot be all spaces";
      isValid = false;
      return isValid;
    } else {
      projectNameError.innerText = "";
    }

    if (projectName.length > 18) {
      projectNameError.innerText = "Please type a name less than 18 characters";
      isValid = false;
    }
    //make sure project does not already exist
    if (allProjects.hasOwnProperty(projectName) === true) {
      projectNameError.innerText = "A project with this name already exists!";
      isValid = false;
    } else {
      projectNameError.innerText = "";
    }

    return isValid;
  }

  function editProjectValidity(projectName) {
    let isValid = true;

    //grab DOM elements' content via inpupt.value
    const projectEditNameError = document.querySelector(
      "#project-edit-name-error"
    );
    const allProjects = Projects.allProjects;

    //make sure projectName is between 1-18 characters
    if (projectName === "") {
      projectEditNameError.innerText = "Project name cannot be blank";
      isValid = false;
      return isValid;
    } else {
      projectEditNameError.innerText = "";
    }
    //make sure projectName not ONLY spaces
    //the regex test here returns false if spaces are the ONLY character in a string
    if (/.*\S.*/.test(projectName) === false) {
      projectEditNameError.innerText = "Project name cannot be all spaces";
      isValid = false;
      return isValid;
    } else {
      projectEditNameError.innerText = "";
    }

    if (projectName.length > 18) {
      projectEditNameError.innerText =
        "Please type a name less than 18 characters";
      isValid = false;
    }
    //make sure project does not already exist
    if (allProjects.hasOwnProperty(projectName) === true) {
      projectEditNameError.innerText = "Project already exists";
      isValid = false;
    } else {
      projectEditNameError.innerText = "";
    }

    return isValid;
  }

  function newTaskValidity(title, date, details, project) {
    //local var = true/false
    let isValid = true;
    //grab .value of DOM elements

    const taskTitleError = document.querySelector("#task-title-error");
    const taskDateError = document.querySelector("#task-date-error");
    const taskDescriptionError = document.querySelector(
      "#task-description-error"
    );
    const allProjects = Projects.allProjects;

    //make sure title is not blank
    if (title === "") {
      taskTitleError.innerText = "Task title cannot be blank";
      isValid = false;
    } else {
      taskTitleError.innerText = "";
    }
    //make sure taskName not ONLY spaces
    //the regex test here returns false if spaces are the ONLY character in a string
    if (/.*\S.*/.test(title) === false) {
      taskTitleError.innerText = "Project name cannot be all spaces";
      isValid = false;
      return isValid;
    } else {
      taskTitleError.innerText = "";
    }

    //make sure title is within 1-20 characters
    if (title.length > 18) {
      taskTitleError.innerText = "Please type a name less than 20 characters";
      isValid = false;
    }
    //make sure task does not yet exist
    if (allProjects[project].tasks.hasOwnProperty(title)) {
      taskTitleError.innerText = "A task with this name already exists";
      isValid = false;
    }

    //make sure date is in proper format
    //if false, update var and set display: block
    let dateValidity = isValidDate(date);
    if (dateValidity === false) {
      taskDateError.innerText =
        'Dates must be in "mm/dd/yyyy" format \nDate cannot be blank \nDates must not be impossible';
      isValid = false;
    } else if (dateValidity === true) {
      taskDateError.innerText = "";
    }

    //make sure description is between 0-180 characters
    //if false, update var and set display: block
    if (details.length > 180) {
      taskDescriptionError.innerText =
        "Please type a name less than 180 characters";
      isValid = false;
    } else {
      taskDescriptionError.innerText = "";
    }

    return isValid;
  }

  function editTaskValidity(title, date, details, project) {
    //local var = true/false
    let isValid = true;
    //grab .value of DOM elements
    const taskEditNameError = document.querySelector("#task-title-edit-error");
    const taskEditDateError = document.querySelector("#date-edit-error");
    const taskEditDescriptionError = document.querySelector(
      "#description-edit-error"
    );
    const allProjects = Projects.allProjects;

    //make sure title is not blank
    if (title === "") {
      taskEditNameError.innerText = "Task title cannot be blank";
      isValid = false;
      return isValid;
    } else {
      taskEditNameError.innerText = "";
    }
    //make sure taskName not ONLY spaces
    //the regex test here returns false if spaces are the ONLY character in a string
    if (/.*\S.*/.test(title) === false) {
      taskEditNameError.innerText = "Project name cannot be all spaces";
      isValid = false;
      return isValid;
    } else {
      taskEditNameError.innerText = "";
    }

    //make sure title is within 1-20 characters
    if (title === "") {
      taskEditNameError.innerText = "Task name cannot be blank";
      isValid = false;
      return isValid;
    } else {
      taskEditNameError.innerText = "";
    }
    if (title.length > 18) {
      taskEditNameError.innerText =
        "Please type a name less than 20 characters";
      isValid = false;
    }

    //make sure task does not already exist
    if (allProjects[project].tasks.hasOwnProperty(title)) {
      taskEditNameError.innerText = "Task already exists";
      isValid = false;
    } else {
      taskEditNameError.innerText = "";
    }

    //make sure date is in proper format
    //if false, update var and set display: block
    let dateValidity = isValidDate(date);
    if (dateValidity === false) {
      taskEditDateError.innerText =
        'Dates must be in "mm/dd/yyyy" format \nDate cannot be blank \nDates must not be impossible';
      isValid = false;
    } else if (dateValidity === true) {
      taskEditDateError.innerText = "";
    }

    //make sure description is between 0-180 characters
    //if false, update var and set display: block
    if (details.length > 180) {
      taskEditDescriptionError.innerText =
        "Please type a name less than 180 characters";
      isValid = false;
    } else {
      taskEditDescriptionError.innerText = "";
    }

    return isValid;
  }

  return {
    newProjectValidity,
    newTaskValidity,
    editProjectValidity,
    editTaskValidity,
    clearAllErrorFeedback,
  };
})();

const Projects = (() => {
  //this obj contains all projects the user is working on
  let allProjects = {};
  getFromLocalStorage();

  //save the project obj to local storage
  function saveToLocalStorage() {
    //convert the project list from an obj to string so it can be saved
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
  }

  //load the project list from local storage
  function getFromLocalStorage() {
    let allProjectsRaw = localStorage.getItem("allProjects");
    if ((allProjectsRaw === null) === false) {
      allProjects = JSON.parse(allProjectsRaw);
    }
  }

  //object constructors
  function Project(title) {
    this.title = title;
    this.tasks = {};
  }

  function Task(title, date, details) {
    this.title = title;
    this.date = date;
    this.details = details;
    this.complete = false;
  }

  /////////the following functions require strings as args

  function addTaskToProject(title, date, details, project) {
    let newTask = new Task(title, date, details);
    allProjects[`${project}`].tasks[`${title}`] = newTask;
  }

  function addProject(projectTitle) {
    //make a new instance of Project and send it to global container obj
    let newProject = new Project(projectTitle);
    allProjects[`${projectTitle}`] = newProject;
  }

  function getProject(key) {
    return allProjects[key];
  }

  function getTaskFromProject(task, project) {
    let requestedTask = allProjects[`${project}`].tasks[`${task}`];
    return requestedTask; //returns task object
  }

  function listAllProjects() {
    // iterate over the allProjects object
    // show us what is in there
    for (const key in allProjects) {
      console.log(`${key}: ${allProjects[key]}`);
    }
  }

  function deleteProject(key) {
    delete allProjects[key];
  }

  function deleteTask(task, project) {
    delete allProjects[`${project}`].tasks[`${task}`];
  }

  function modifyTaskProperty(project, task, property, newValue) {
    allProjects[project].tasks[task][property] = newValue;
  }

  return {
    addTaskToProject,
    addProject,
    getProject,
    getTaskFromProject,
    listAllProjects,
    allProjects,
    deleteProject,
    deleteTask,
    modifyTaskProperty,
    saveToLocalStorage,
    getFromLocalStorage,
  };
})();

/////load page from local storage if possible
function loadPage() {
  updateProjectSidebar();
}

//////Add initial event listeners
//make a form pop up to add a new task on click
const taskForm = document.querySelector(".task-form");
const addButton = document.getElementById("add-new-task");
addButton.classList.add("hidden");
addButton.addEventListener("click", () => {
  taskForm.classList.toggle("form-active");
});

//make a form pop up to add a new project on click
const projectForm = document.querySelector(".project-form");
const projectEditForm = document.getElementById("project-edit-form");
const addProjectButton = document.getElementById("add-new-project");
addProjectButton.addEventListener("click", () => {
  projectForm.classList.toggle("form-active");
});

///////Functions that erase things
//give us a way to clear the forms
function clearForms() {
  projectForm.reset();
  taskForm.reset();
  projectEditForm.reset();
  Validation.clearAllErrorFeedback();
}

//give us a way to clear the sidebar and content areas
const tasksList = document.querySelector(".project-tasks");
const projectsMenu = document.querySelector(".projects-menu");

function clearSidebar() {
  projectsMenu.textContent = "";
}
function clearTasks() {
  tasksList.textContent = "";
}

///////Functions that get data from user and update page
//populate project from project form
//the submit button calls a function that gets the form data when it is clicked.
const submitProject = document.querySelector("#add-project-button");
submitProject.addEventListener("click", getProjectFormData);

//override default behavior of submitProject to send data to server
//this enables your data to be free to be sent to the javascript
submitProject.addEventListener("click", function (event) {
  event.preventDefault();
});

function addToSidebar(projectTitle) {
  let projectIcon = document.createElement("img");
  projectIcon.classList.add("icon");
  projectIcon.setAttribute(
    "src",
    "https://img.icons8.com/ios-glyphs/30/null/tasklist.png"
  );

  let projectTitleDiv = document.createElement("div");
  projectTitleDiv.classList.add("project-title");
  projectTitleDiv.innerText = projectTitle; //change this later to reflect the proj obj

  let editIcon = document.createElement("i");
  editIcon.classList.add(
    "fa-solid",
    "fa-ellipsis-vertical",
    "edit",
    "edit-project"
  );
  let editOption = document.createElement("div");
  editOption.classList.add("edit-option");
  let renameBtn = document.createElement("button");
  renameBtn.innerText = "Rename";
  renameBtn.classList.add("rename-option");
  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("delete-option");

  //create the hidden edit option menu too
  editOption.appendChild(renameBtn);
  editOption.appendChild(deleteBtn);
  editIcon.appendChild(editOption);

  //now send them to their div container button
  let editButtonDiv = document.createElement("div");
  editButtonDiv.classList.add("edit-button", "edit", "icon");
  editButtonDiv.appendChild(editIcon);

  let projectMenuItem = document.createElement("div");
  projectMenuItem.classList.add("project-menu-item", "flexbox");

  //now add all children
  projectMenuItem.appendChild(projectIcon);
  projectMenuItem.appendChild(projectTitleDiv);
  projectMenuItem.appendChild(editButtonDiv);

  projectsMenu.appendChild(projectMenuItem);
}

function updateProjectSidebar() {
  //add projects to DOM
  clearSidebar();
  for (const key in Projects.allProjects) {
    let projToAdd = `${key}`;
    addToSidebar(projToAdd);
  }

  addProjectTitleListeners();
  addListnersToEditButtons();
}

function getProjectFormData() {
  //eventually add logic/function to validate form here
  let projectName = document.getElementById("project-name").value;
  let formValid = Validation.newProjectValidity(projectName);

  //use domElement.value to get what user has typed in project title box and make a new obj with it.

  if (formValid) {
    Projects.addProject(projectName);
    Projects.saveToLocalStorage();
    updateProjectSidebar();
    clearForms();
  } else {
    alert("error");
  }
}

//update which project the user is working on.
//let them click ANY project title in the sidebar to select it.
function selectProject(projectName) {
  //take a string of the project name the user clicked on as arg

  //find the DOM element to change
  const projectHeader = document.querySelector(".project-header");

  //update title with project name
  projectHeader.innerText = projectName;

  //update global var for what project you are working on
  selectedProject = projectName;

  //NOW the add task button can appear
  displayAddTaskButton();

  //populate content page with the tasks inside this obj
  updateTaskList(projectName);
}

function addProjectTitleListeners() {
  //enables user to click on projects to interact with them
  const projectTitles = projectsMenu.querySelectorAll(".project-title");
  projectTitles.forEach((title) => {
    title.addEventListener("click", () => {
      let project = title.innerText;
      selectProject(project);
    });
  });
}

function displayAddTaskButton() {
  addButton.classList.remove("hidden");
}

//make task obj from task form
//the submit button calls a function that gets the form data when it is clicked.
const submitTask = document.querySelector("#submit-button");
submitTask.addEventListener("click", getTaskFormData);

//override default behavior of submitProject to send data to server
//this enables your data to be free to be sent to the javascript
submitTask.addEventListener("click", function (event) {
  event.preventDefault();
});

function getTaskFormData() {
  //use global var to know what project you are adding to.
  let toProject = selectedProject;

  //use domElement.value to get what user has typed in project title box and make a new obj with it.
  let taskName = document.getElementById("task-title-input").value;
  let dueDate = document.getElementById("date-input").value;
  let details = document.getElementById("description-input").value;
  let formValid = Validation.newTaskValidity(
    taskName,
    dueDate,
    details,
    toProject
  );
  if (formValid) {
    //take in all form data by vars via .value

    //send task to project obj
    Projects.addTaskToProject(taskName, dueDate, details, toProject);

    //call function that clears and repopulates the dom
    updateTaskList(toProject);

    //clear the form
    clearForms();
  } else {
    alert("error");
  }
}

//update and render the task list for a selected project
function updateTaskList(ofProject) {
  //add projects to DOM
  clearTasks();
  for (const key in Projects.allProjects[ofProject].tasks) {
    //for each task object in the project, use that obj to populate the DOM
    let taskToAdd = Projects.allProjects[ofProject].tasks[key];
    renderTask(taskToAdd);
  }
  //elements just got rendered so now they must have their listeners re-written
  addListnersToTaskButtons();
  addListenersToCheckboxes();
}

function renderTask(TaskObject) {
  //get data from obj
  let title = TaskObject["title"];
  let date = TaskObject["date"];
  let details = TaskObject["details"];
  let complete = TaskObject["complete"];

  //make individual DOM elements
  //checkbox
  let checkbox = document.createElement("input");
  checkbox.classList.add("task-checkbox");
  checkbox.setAttribute("type", "checkbox");
  //set checkbox in accordance with task progress
  if (complete) {
    checkbox.checked = true;
  } else if (!complete) {
    checkbox.checked = false;
  }

  //title
  let taskTitle = document.createElement("h4");
  taskTitle.classList.add("task-title");
  taskTitle.innerText = title;
  //date
  let taskDate = document.createElement("h4");
  taskDate.classList.add("task-date");
  taskDate.innerText = date;
  //completion
  let taskStatus = document.createElement("h4");
  taskStatus.classList.add("task-date");
  if (complete === true) {
    taskStatus.innerText = "Complete";
  } else {
    taskStatus.innerText = "Incomplete";
  }
  //icon
  let taskEditIcon = document.createElement("i");
  taskEditIcon.classList.add(
    "fa-solid",
    "fa-ellipsis-vertical",
    "edit",
    "edit-task"
  );

  //add edit submenu to icon
  taskEditIcon.appendChild(addEditSubmenu());

  //details
  let taskDetails = document.createElement("div");
  taskDetails.classList.add("task-details");
  taskDetails.innerText = details;

  //make parent container
  let taskData = document.createElement("div");
  taskData.classList.add("task-data", "flexbox");
  //add all children to parent container
  taskData.appendChild(checkbox);
  taskData.appendChild(taskTitle);
  taskData.appendChild(taskDate);
  taskData.appendChild(taskStatus);
  taskData.appendChild(taskEditIcon);

  //append to grandparent container
  let taskContent = document.createElement("div");
  taskContent.classList.add("task", "flexbox");
  taskContent.appendChild(taskData);
  taskContent.appendChild(taskDetails);

  //make them actually appear on the DOM
  let projectTasks = document.querySelector(".project-tasks");
  projectTasks.appendChild(taskContent);
}

function addListnersToTaskButtons() {
  const taskEditButtons = document.querySelectorAll(".edit-task");
  taskEditButtons.forEach((button) => {
    //get the data attribute in the html which will be the correct modal ID

    button.addEventListener("click", () => {
      //add toggle function to make the options appear visible
      button.classList.toggle("active");
    });
  });
  //now add event listeners to the rename and delete buttons
  const contentArea = document.getElementById("current-project");
  const taskRenameBtns = contentArea.querySelectorAll(".rename-option");
  const taskDeleteBtns = contentArea.querySelectorAll(".delete-option");
  let project = selectedProject;

  taskRenameBtns.forEach((btn) => {
    //climb the dom tree to a grandparent and then search down to find the project to refer to.
    let selectedTask = btn
      .closest(".task-data")
      .querySelector(".task-title").innerText;

    btn.addEventListener("click", () => {
      openTaskEditModal(selectedTask);
    });
  });

  taskDeleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      //find the name of the task in the DOM tree to use as arg
      let selectedTask = btn
        .closest(".task-data")
        .querySelector(".task-title").innerText;
      Projects.deleteTask(selectedTask, project);

      //update DOM to reflect change visually
      updateTaskList(project);
    });
  });
}

function addListenersToCheckboxes() {
  //grabb all checkboxes by class tastk0checkbox
  const checkboxes = document.querySelectorAll(".task-checkbox");
  checkboxes.forEach((box) => {
    box.addEventListener("click", () => {
      //task name should be the immidate sibling
      let taskName = box.nextElementSibling.innerText;

      if (box.checked) {
        markTaskComplete(taskName);
      } else if (!box.checked) {
        markTaskIncomplete(taskName);
      } else {
        return "error";
      }
    });
  });
}

//update task objects to synchronize with the status of their checkboxes
function markTaskComplete(task) {
  Projects.allProjects[selectedProject].tasks[`${task}`].complete = true;
}

function markTaskIncomplete(task) {
  Projects.allProjects[selectedProject].tasks[`${task}`].complete = false;
}

//to streamline process of adding edit submenus
function addEditSubmenu() {
  let editOption = document.createElement("div");
  editOption.classList.add("edit-option");
  let renameBtn = document.createElement("button");
  renameBtn.innerText = "Edit";
  renameBtn.classList.add("rename-option");
  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("delete-option");

  //create the hidden edit option menu too
  editOption.appendChild(renameBtn);
  editOption.appendChild(deleteBtn);

  return editOption;
}

////////Modal stuff//////////////////

//set up modal vars so that we can opperate on our modals weather there is one or many

const modalEditProject = document.getElementById("modal-edit-project");
const modalEditTask = document.getElementById("modal-edit-task");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    //since the button is INSIDE our modal, we won't use query selector
    //instead we access the parent modal of this button
    //use .closest() to get the CLOSEST parent with class 'modal'
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function closeModal(modal) {
  //check and make sure it didn't get called without a modal
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
  clearForms();
}

//make it so that the modal closes if you click out of it
overlay.addEventListener("click", () => {
  //grab any active modals you can find
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

//////////////edit PROJECT stuff
//loop over buttons and add event listners
function addListnersToEditButtons() {
  const openModalProjectEditButtons = document.querySelectorAll(".edit-button");
  openModalProjectEditButtons.forEach((button) => {
    //get the data attribute in the html which will be the correct modal ID

    button.addEventListener("click", () => {
      //add toggle function to make the options appear visible
      button.classList.toggle("active");
    });
  });
  //now add event listeners to the rename and delete buttons
  const sidebarContent = document.getElementById("projects-sidebar");
  const projRenameBtns = sidebarContent.querySelectorAll(".rename-option");
  const projDeleteBtns = sidebarContent.querySelectorAll(".delete-option");
  projRenameBtns.forEach((btn) => {
    //climb the dom tree to a grandparent and then search down to find the project to refer to.
    let project = btn
      .closest(".project-menu-item")
      .querySelector(".project-title").innerText;
    btn.addEventListener("click", () => {
      openProjectEditModal(project);
    });
  });
  projDeleteBtns.forEach((btn) => {
    let project = btn
      .closest(".project-menu-item")
      .querySelector(".project-title").innerText;
    btn.addEventListener("click", () => {
      Projects.deleteProject(project);
      Projects.saveToLocalStorage();
      updateProjectSidebar();

      //dis for quick testing purposes TODO delete this before push
    });
  });
}

function openProjectEditModal(project) {
  //make the input box already have the current project name in it by default
  projectToEdit = project;
  let editBox = document.getElementById("new-project-name");
  editBox.value = project;

  //then actually open up the modal and grey out the rest of the background
  modalEditProject.classList.add("active");
  overlay.classList.add("active");
}

//make sure that project names are updated when the rename form is complete
//find rename project button and give it an event listener
const renameProject = document.querySelector("#rename-project");
renameProject.addEventListener("click", getProjectRenameData);

//override default behavior to send data to server
//this enables your data to be free to be sent to the javascript
renameProject.addEventListener("click", function (event) {
  event.preventDefault();
});

function getProjectRenameData() {
  //when 'rename' is clicked, update the name of the project
  //TODO eventually add logic/function to validate form here
  let newProjectName = document.getElementById("new-project-name").value;
  let formValid = Validation.editProjectValidity(newProjectName);
  //use domElement.value to get what user has typed and edit the obj key with it.

  if (formValid) {
    Projects.allProjects[newProjectName] = Projects.allProjects[projectToEdit];
    delete Projects.allProjects[projectToEdit];
    //update the name of the obj title inside itself too
    Projects.allProjects[newProjectName].title = newProjectName;

    //update the project bar and close the modal
    Projects.saveToLocalStorage();
    updateProjectSidebar();
    clearForms();
    selectProject(newProjectName);
    projectToEdit = undefined;
    let modal = renameProject.closest(".modal");
    closeModal(modal);
  } else {
    alert("error");
  }
}

///////similar modal code for task editing
function openTaskEditModal(task) {
  let taskObj = Projects.getTaskFromProject(task, selectedProject);

  //populate the boxes with what the user already has in them
  let titleBox = document.getElementById("edit-task-title-input");
  titleBox.value = taskObj["title"];

  let dateBox = document.getElementById("edit-date-input");
  dateBox.value = taskObj["date"];

  let descriptionBox = document.getElementById("edit-description-input");
  descriptionBox.value = taskObj["details"];

  //then actually open up the modal and grey out the rest of the background
  currentTask = task;
  modalEditTask.classList.add("active");
  overlay.classList.add("active");
}

//use edit submit button to get data from user to update tasks
const submitEditTask = document.querySelector("#edit-submit-button");
submitEditTask.addEventListener("click", getTaskEditData);

//override default behavior to send data to server
//this enables your data to be free to be sent to the javascript
submitEditTask.addEventListener("click", function (event) {
  event.preventDefault();
});

function getTaskEditData() {
  //when 'add task' is clicked, take user data, modify existing task object, and re-render
  let toProject = selectedProject;
  let newTaskTitle = document.getElementById("edit-task-title-input").value;
  let newDate = document.getElementById("edit-date-input").value;
  let newDescription = document.getElementById("edit-description-input").value;
  let formValid = Validation.editTaskValidity(
    newTaskTitle,
    newDate,
    newDescription,
    toProject
  );

  //use domElement.value to get what user has typed and edit the obj key with it.

  if (formValid) {
    //update the task object with the new information
    Projects.modifyTaskProperty(
      selectedProject,
      currentTask,
      "title",
      newTaskTitle
    );
    Projects.modifyTaskProperty(selectedProject, currentTask, "date", newDate);
    Projects.modifyTaskProperty(
      selectedProject,
      currentTask,
      "details",
      newDescription
    );

    //rename the key for the task by copying the task and deleting the old one
    Projects.allProjects[toProject].tasks[newTaskTitle] =
      Projects.allProjects[toProject].tasks[currentTask];
    delete Projects.allProjects[toProject].tasks[currentTask];

    //update the project bar, reset vars and close the modal
    updateTaskList(selectedProject);
    clearForms();
    currentTask = undefined;
    let modal = submitEditTask.closest(".modal");
    closeModal(modal);
  } else {
    alert("error");
  }
}

///////live validation feedback listeners
(function projectValidityLiveFeedback() {
  const projectNameInput = document.querySelector("#project-name");
  const projectNameError = document.querySelector("#project-name-error");
  projectNameInput.addEventListener("input", function (event) {
    //as the user types, the function will listen for validity
    if (projectNameInput.value === "") {
      projectNameError.innerText = "Project name cannot be blank";
    }
    if (projectNameInput.value.length > 18) {
      projectNameError.innerText = "Please type a name less than 18 characters";
    }

    if (
      projectNameInput.value.length > 18 ||
      (projectNameInput.value === "") === false
    ) {
      projectNameError.innerText = "";
    }
  });
})();

(function taskValidityLiveFeedback() {
  const taskNameInput = document.querySelector("#task-title-input");
  const taskNameError = document.querySelector("#task-title-error");
  const taskDateInput = document.querySelector("#date-input");
  const taskDateError = document.querySelector("#task-date-error");
  taskNameInput.addEventListener("input", function (event) {
    if (taskNameInput.value === "") {
      taskNameError.innerText = "Task cannot be blank";
    }
    if (taskNameInput.value.length > 20) {
      taskNameError.innerText = "Please type a name less than 20 characters";
    }

    if (
      taskNameInput.value.length > 18 ||
      (taskNameInput.value === "") === false
    ) {
      taskNameError.innerText = "";
    }
  });
  taskDateInput.addEventListener("input", function (event) {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(taskDateInput.value) === true) {
      taskDateError.innerText = "";
    }
    if (taskDateInput.value === "") {
      taskDateError.innerText = "Date cannot be blank";
    }
    if (
      /^\d{2}\/\d{2}\/\d{4}$/.test(taskDateInput.value) === false &&
      (taskDateInput.value === "") === false
    ) {
      taskDateError.innerText = "Date must be mm/dd/yyyy format";
    }
  });
})();

///////hide / show sidebar hamburger icon listeners
const navToggle = document.querySelector(".menu-toggle");
const sidebarContent = document.getElementById("projects-sidebar");
const navIcon = document.querySelectorAll(".navIcon");
const navClosed = document.getElementById("navClosed");

navToggle.addEventListener("click", () => {
  sidebarContent.classList.toggle("hidden");
  navIcon.forEach((icon) => {
    //because they are hard-coded in html to have one hidden, this will act as a switch and flip back/forth
    icon.classList.toggle("hidden");
  });
});

///execute when page is loaded
loadPage();
