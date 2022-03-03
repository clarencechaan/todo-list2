import Todo from './todo.js';
import Project from './project.js';
import projectsManager from './projects-manager.js'
import displayController from './display-controller.js';

const todoApp = (() => {

    const addProject = () => {
        const projectName = displayController.getProjectName();
        const project = new Project(projectName);
        projectsManager.addProject(project);
        
        // display projects
        displayController.displayProjects(projectsManager.projects);

        // add event listener to projects
        addAllEventListeners()

        // clear project form
        displayController.clearProjectForm();

        // hide project form
        displayController.toggleShowProjectForm();

        // prevent page from reloading
        return false;
    }

    const addTask = () => {
        // add todo to project manager
        const todoValues = displayController.getFormValues();
        const todo = new Todo(todoValues.title, todoValues.description, todoValues.dueDate, todoValues.priority);
        projectsManager.addTodoToCurrentProject(todo);

        // display todos from current project
        displayController.displayTodos(projectsManager.getCurrentProject());

        // add event listener to remove todo buttons
        addAllEventListeners()

        // clear task form
        displayController.clearTaskForm();

        // hide task form
        displayController.toggleShowTaskForm();

        // prevent page from reloading
        return false;
    }

    const addEventListenersToProjectItems = () => {
        const projectBtns = document.querySelectorAll('.project-button');
        for (let i = 0; i < projectBtns.length; i++) {
            projectBtns[i].onclick = () => switchToProjectAtIndex(i);
        }
    }

    const addEventListenersToRemoveProjectBtns = () => {
        const removeProjectBtns = document.querySelectorAll('.remove-project');
        for (let i = 0; i < removeProjectBtns.length; i++) {
            removeProjectBtns[i].onclick = () => removeProjectAtIndex(i);
        }
    }

    const addEventListenersToRemoveTodoBtns = () => {
        const removeTodoBtns = document.querySelectorAll('.remove-todo');
        for (let i = 0; i < removeTodoBtns.length; i++) {
            removeTodoBtns[i].onclick = () => removeTodoAtIndex(i);
        }
    }

    const switchToProjectAtIndex = (index) => {
        projectsManager.switchToProjectAtIndex(index);
        displayController.displayTodos(projectsManager.getCurrentProject());

        // add event listener to remove todo buttons
        addAllEventListeners();
    }

    const removeProjectAtIndex = (index) => {
        projectsManager.removeProjectAtIndex(index);
        displayController.displayProjects(projectsManager.projects);
        displayController.displayTodos(projectsManager.getCurrentProject());

        // add event listener to projects
        addAllEventListeners();
    }

    const removeTodoAtIndex = (index) => {
        projectsManager.getCurrentProject().removeTodoAtIndex(index);
        displayController.displayTodos(projectsManager.getCurrentProject());

        // add event listener to remove todo buttons
        addAllEventListeners();
    }

    const addAllEventListeners = ()  => {
        addEventListenersToProjectItems();
        addEventListenersToRemoveProjectBtns();
        addEventListenersToRemoveTodoBtns();
    }

    return {
        addProject,
        addTask,
        addAllEventListeners
    }
})();

// default project and todo
const todo = new Todo("brush teeth", "description", "2022-03-12", "High");
const defaultProject = new Project("Inbox");
defaultProject.addTodo(todo);
defaultProject.addTodo(todo);
projectsManager.addProject(defaultProject);

// add event listener to "Add Project" button
const addProjectBtn = document.querySelector('#add-project')
addProjectBtn.addEventListener('click', displayController.toggleShowProjectForm);

// add event listener to "Add Task" button
const addTaskBtn = document.querySelector('#add-task');
addTaskBtn.addEventListener('click', displayController.toggleShowTaskForm);

// add event listener to project form buttons
const projectForm = document.querySelector('#project-form');
projectForm.onsubmit = todoApp.addProject;
const projectFormCancelBtn = document.querySelector('#project-cancel');
projectFormCancelBtn.addEventListener('click', displayController.toggleShowProjectForm);

// add event listener to task form buttons
const taskForm = document.querySelector('#task-form');
const formCancelBtn = document.querySelector('#form-cancel');
taskForm.onsubmit = todoApp.addTask;
formCancelBtn.addEventListener('click', displayController.toggleShowTaskForm);

displayController.addProject(projectsManager.projects[0]);
displayController.displayTodos(projectsManager.projects[0]);

todoApp.addAllEventListeners();