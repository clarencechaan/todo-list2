const displayController = (() => {
  const todosDOM = document.querySelector("#todos");
  const projectsDOM = document.querySelector("#projects");

  const addTodo = (todo) => {
    const todoExpanded = document.createElement("div");
    const todoElement = document.createElement("div");
    const todoCheckbox = document.createElement("input");
    const todoTitle = document.createElement("div");
    const detailsBtn = document.createElement("button");
    const todoDate = document.createElement("input");
    const removeTodoBtn = document.createElement("button");
    const todoDetails = document.createElement("div");
    const todoDescription = document.createElement("div");
    const todoPriority = document.createElement("div");

    todoExpanded.classList.add("todo-expanded");
    todoElement.classList.add("todo");
    todoCheckbox.classList.add("todo-checkbox");
    todoCheckbox.setAttribute("type", "checkbox");
    todoCheckbox.setAttribute("autocomplete", "off");
    todoTitle.classList.add("todo-title");
    detailsBtn.classList.add("todo-details-btn");
    detailsBtn.innerText = "Details";
    todoDate.classList.add("todo-date");
    todoDate.setAttribute("type", "date");
    todoDate.setAttribute("autocomplete", "off");
    removeTodoBtn.classList.add("remove-todo");
    todoDetails.classList.add("todo-details");
    todoDetails.classList.add("hidden");
    todoDescription.classList.add("todo-description");
    todoPriority.classList.add("todo-priority");

    if (todo.getDoneStatus()) {
      todoTitle.classList.add("strikethrough");
    }

    todoCheckbox.checked = todo.getDoneStatus();
    todoTitle.innerText = todo.getTitle();
    todoDate.value = todo.getDueDate();
    removeTodoBtn.innerText = "✘";
    todoDescription.innerText = todo.getDescription();
    todoPriority.innerText = "Priority: " + todo.getPriority();

    todoElement.appendChild(todoCheckbox);
    todoElement.appendChild(todoTitle);
    todoElement.appendChild(detailsBtn);
    todoElement.appendChild(todoDate);
    todoElement.appendChild(removeTodoBtn);
    todoDetails.appendChild(todoDescription);
    todoDetails.appendChild(todoPriority);
    todoExpanded.appendChild(todoElement);
    todoExpanded.appendChild(todoDetails);
    todosDOM.appendChild(todoExpanded);
  };

  const addProject = (project) => {
    const projectElement = document.createElement("div");
    const projectBtn = document.createElement("button");
    const removeProjectBtn = document.createElement("button");

    projectElement.classList.add("project");
    projectBtn.classList.add("project-button");
    projectBtn.setAttribute("type", "button");
    projectBtn.innerText = project.getName();
    removeProjectBtn.classList.add("remove-project");
    removeProjectBtn.setAttribute("type", "button");
    removeProjectBtn.innerText = "✘";

    projectElement.appendChild(projectBtn);
    projectElement.appendChild(removeProjectBtn);
    projectsDOM.appendChild(projectElement);
  };

  const clearTodos = () => {
    while (todosDOM.firstChild) {
      todosDOM.removeChild(todosDOM.lastChild);
    }
  };

  const clearProjects = () => {
    while (projectsDOM.firstChild) {
      projectsDOM.removeChild(projectsDOM.lastChild);
    }
  };

  const populateProjects = (projectsList) => {
    for (let i = 0; i < projectsList.length; i++) {
      addProject(projectsList[i]);
    }
  };

  const populateTodos = (project) => {
    for (let todo of project.todos) {
      addTodo(todo);
    }
  };

  const toggleShowProjectForm = () => {
    const projectForm = document.querySelector("#project-form");
    const addProjectBtn = document.querySelector("#add-project");

    if (projectForm.classList.contains("hidden")) {
      projectForm.classList.remove("hidden");
      addProjectBtn.classList.add("hidden");
      // focus on project name input field
      document.getElementById("project-name").focus();
    } else {
      projectForm.classList.add("hidden");
      addProjectBtn.classList.remove("hidden");
    }
  };

  const toggleShowTaskForm = () => {
    const taskForm = document.querySelector("#task-form");
    const addTaskBtn = document.querySelector("#add-task");

    if (taskForm.classList.contains("hidden")) {
      taskForm.classList.remove("hidden");
      addTaskBtn.classList.add("hidden");
      // focus on project task title field
      document.getElementById("task-title").focus();
    } else {
      taskForm.classList.add("hidden");
      addTaskBtn.classList.remove("hidden");
    }
  };

  const getProjectName = () => {
    const projectName = document.querySelector("#project-name").value;
    return projectName;
  };

  const getFormValues = () => {
    const title = document.querySelector("#task-title").value;
    const description = document.querySelector("#task-description").value;
    const dueDate = document.querySelector("#task-date").value;
    const priority = document.querySelector("#task-priority").value;

    return { title, description, dueDate, priority };
  };

  const displayProjects = (projectsList) => {
    clearProjects();
    populateProjects(projectsList);
  };

  const displayTodos = (project) => {
    clearTodos();
    addTodosHeader(project);
    populateTodos(project);
  };

  const clearTaskForm = () => {
    const taskForm = document.querySelector("#task-form");
    taskForm.reset();
  };

  const clearProjectForm = () => {
    const projectForm = document.querySelector("#project-form");
    projectForm.reset();
  };

  const toggleDetails = (index) => {
    const todoDetails = document.querySelectorAll(".todo-details");
    if (todoDetails[index].classList.contains("hidden")) {
      todoDetails[index].classList.remove("hidden");
    } else {
      todoDetails[index].classList.add("hidden");
    }
  };

  const addTodosHeader = (project) => {
    const todosHeader = document.querySelector("#todos-header");
    todosHeader.innerText = project.getName();
  };

  const toggleStrikethroughTodo = (index) => {
    const todoTitles = document.querySelectorAll(".todo-title");
    if (todoTitles[index].classList.contains("strikethrough")) {
      todoTitles[index].classList.remove("strikethrough");
    } else {
      todoTitles[index].classList.add("strikethrough");
    }
  };

  return {
    addTodo,
    addProject,
    clearProjects,
    displayTodos,
    toggleShowProjectForm,
    toggleShowTaskForm,
    getProjectName,
    getFormValues,
    displayProjects,
    displayTodos,
    clearTaskForm,
    clearProjectForm,
    toggleDetails,
    toggleStrikethroughTodo,
  };
})();

export default displayController;
