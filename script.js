import Todo from "./todo.js";
import Project from "./project.js";
import projectsManager from "./projects-manager.js";
import displayController from "./display-controller.js";

const todoApp = (() => {
  const addProject = () => {
    // add project to projects manager
    const projectName = displayController.getProjectName();
    const project = new Project(projectName);
    projectsManager.addProject(project);

    // display projects
    displayController.displayProjects(projectsManager.projects);

    // add event listener to projects
    addAllEventListeners();

    // clear project form
    displayController.clearProjectForm();

    // hide project form
    displayController.toggleShowProjectForm();

    // save projects manager to local storage
    localStorage.setItem("projectsManager", JSON.stringify(projectsManager));

    // prevent page from reloading
    return false;
  };

  const addTask = () => {
    // add todo to project manager
    const todoValues = displayController.getFormValues();
    const todo = new Todo(
      todoValues.title,
      todoValues.description,
      todoValues.dueDate,
      todoValues.priority
    );
    projectsManager.addTodoToCurrentProject(todo);

    // display todos from current project
    displayController.displayTodos(projectsManager.getCurrentProject());

    // add event listener to remove todo buttons
    addAllEventListeners();

    // clear task form
    displayController.clearTaskForm();

    // hide task form
    displayController.toggleShowTaskForm();

    // save projects manager to local storage
    localStorage.setItem("projectsManager", JSON.stringify(projectsManager));

    // prevent page from reloading
    return false;
  };

  const addEventListenersToProjectItems = () => {
    const projectBtns = document.querySelectorAll(".project-button");
    for (let i = 0; i < projectBtns.length; i++) {
      projectBtns[i].onclick = () => switchToProjectAtIndex(i);
    }
  };

  const addEventListenersToRemoveProjectBtns = () => {
    const removeProjectBtns = document.querySelectorAll(".remove-project");
    for (let i = 0; i < removeProjectBtns.length; i++) {
      removeProjectBtns[i].onclick = () => removeProjectAtIndex(i);
    }
  };

  const addEventListenersToRemoveTodoBtns = () => {
    const removeTodoBtns = document.querySelectorAll(".remove-todo");
    for (let i = 0; i < removeTodoBtns.length; i++) {
      removeTodoBtns[i].onclick = () => removeTodoAtIndex(i);
    }
  };

  const switchToProjectAtIndex = (index) => {
    projectsManager.switchToProjectAtIndex(index);
    displayController.displayTodos(projectsManager.getCurrentProject());

    // add event listener to remove todo buttons
    addAllEventListeners();
  };

  const removeProjectAtIndex = (index) => {
    projectsManager.removeProjectAtIndex(index);
    displayController.displayProjects(projectsManager.projects);
    displayController.displayTodos(projectsManager.getCurrentProject());

    // save projects manager to local storage
    localStorage.setItem("projectsManager", JSON.stringify(projectsManager));

    // add event listener to projects
    addAllEventListeners();
  };

  const removeTodoAtIndex = (index) => {
    projectsManager.getCurrentProject().removeTodoAtIndex(index);
    displayController.displayTodos(projectsManager.getCurrentProject());

    // save projects manager to local storage
    localStorage.setItem("projectsManager", JSON.stringify(projectsManager));

    // add event listener to remove todo buttons
    addAllEventListeners();
  };

  const addEventListenersToDatePickers = () => {
    const datePickers = document.querySelectorAll(".todo-date");
    for (let i = 0; i < datePickers.length; i++) {
      datePickers[i].onchange = () => {
        projectsManager
          .getCurrentProject()
          .todos[i].setDueDate(datePickers[i].value);

        // save projects manager to local storage
        localStorage.setItem(
          "projectsManager",
          JSON.stringify(projectsManager)
        );
      };
    }
  };

  const addEventListenersToDetailsBtn = () => {
    const detailsBtns = document.querySelectorAll(".todo-details-btn");
    for (let i = 0; i < detailsBtns.length; i++) {
      detailsBtns[i].onclick = () => {
        displayController.toggleDetails(i);
      };
    }
  };

  const addEventListenersToCheckboxes = () => {
    const checkboxes = document.querySelectorAll(".todo-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].onclick = () => {
        projectsManager.getCurrentProject().todos[i].toggleDoneStatus();
        displayController.toggleStrikethroughTodo(i);

        // save projects manager to local storage
        localStorage.setItem(
          "projectsManager",
          JSON.stringify(projectsManager)
        );
      };
    }
  };

  const addAllEventListeners = () => {
    addEventListenersToProjectItems();
    addEventListenersToRemoveProjectBtns();
    addEventListenersToRemoveTodoBtns();
    addEventListenersToDatePickers();
    addEventListenersToDetailsBtn();
    addEventListenersToCheckboxes();
  };

  return {
    addProject,
    addTask,
    addAllEventListeners,
  };
})();

// add event listener to "Add Project" button
const addProjectBtn = document.querySelector("#add-project");
addProjectBtn.addEventListener(
  "click",
  displayController.toggleShowProjectForm
);

// add event listener to "Add Task" button
const addTaskBtn = document.querySelector("#add-task");
addTaskBtn.addEventListener("click", displayController.toggleShowTaskForm);

// add event listener to project form buttons
const projectForm = document.querySelector("#project-form");
projectForm.onsubmit = todoApp.addProject;
const projectFormCancelBtn = document.querySelector("#project-cancel");
projectFormCancelBtn.addEventListener(
  "click",
  displayController.toggleShowProjectForm
);

// add event listener to task form buttons
const taskForm = document.querySelector("#task-form");
const formCancelBtn = document.querySelector("#form-cancel");
taskForm.onsubmit = todoApp.addTask;
formCancelBtn.addEventListener("click", displayController.toggleShowTaskForm);

// get projects manager from storage
const projectsManagerJSON = localStorage.getItem("projectsManager");
const projectsManagerObject = JSON.parse(projectsManagerJSON);

if (projectsManagerObject === null) {
  // default projects and todos
  const todo = new Todo(
    "pay bills",
    "phone, rent, internet",
    "2022-03-12",
    "High"
  );
  const todo2 = new Todo(
    "get groceries",
    "eggs, milk, cheese",
    "2022-03-15",
    "Low"
  );
  const todo3 = new Todo(
    "work out",
    "back, arms, chest",
    "2022-03-12",
    "Medium"
  );
  const inbox = new Project("Inbox");
  const gymProject = new Project("Gym");
  inbox.addTodo(todo);
  inbox.addTodo(todo2);
  gymProject.addTodo(todo3);
  projectsManager.addProject(inbox);
  projectsManager.addProject(gymProject);
} else {
  projectsManager.reconstructProjectsManager(projectsManagerObject);
}

// display projects and todos
displayController.displayProjects(projectsManager.projects);
displayController.displayTodos(projectsManager.projects[0]);

todoApp.addAllEventListeners();
