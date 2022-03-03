const displayController = (() => {

    const todosDOM = document.querySelector('#todos');
    const projectsDOM = document.querySelector('#projects');

    const addTodo = (todo) => {
        const todoElement = document.createElement('div');
        const todoTitle = document.createElement('div');
        const todoDescription = document.createElement('div');
        const todoDate = document.createElement('input');
        const todoPriority = document.createElement('div');
        const removeTodoBtn = document.createElement('button')

        todoElement.classList.add('todo');
        todoTitle.classList.add('todo-title')
        todoDescription.classList.add('todo-description')
        todoDate.classList.add('todo-date')
        todoDate.setAttribute('type', 'date');
        todoPriority.classList.add('todo-priority');
        removeTodoBtn.classList.add('remove-todo');

        todoTitle.innerText = todo.getTitle();
        todoDescription.innerText = todo.getDescription();
        todoDate.value = todo.getDueDate();
        todoPriority.innerText = todo.getPriority();
        removeTodoBtn.innerText = '✘';

        todoElement.appendChild(todoTitle);
        todoElement.appendChild(todoDescription);
        todoElement.appendChild(todoDate);
        todoElement.appendChild(todoPriority);
        todoElement.appendChild(removeTodoBtn);
        todosDOM.appendChild(todoElement);
    }

    const addProject = (project) => {
        const projectElement = document.createElement('div')
        const projectBtn = document.createElement('button');
        const removeProjectBtn = document.createElement('button');
        
        projectElement.classList.add('project');
        projectBtn.classList.add('project-button')
        projectBtn.setAttribute('type','button');
        projectBtn.innerText = project.getName();
        removeProjectBtn.classList.add('remove-project');
        removeProjectBtn.setAttribute('type', 'button');
        removeProjectBtn.innerText = '✘';

        projectElement.appendChild(projectBtn);
        projectElement.appendChild(removeProjectBtn);
        projectsDOM.appendChild(projectElement);
    }

    const clearTodos = () => {
        while (todosDOM.firstChild) {
            todosDOM.removeChild(todosDOM.lastChild);
        }
    }

    const clearProjects = () => {
        while (projectsDOM.firstChild) {
            projectsDOM.removeChild(projectsDOM.lastChild);
        }
    }

    const populateProjects = (projectsList) => {
        for (let i = 0; i < projectsList.length; i++) {
            addProject(projectsList[i]);
        }
    }

    const populateTodos = (project) => {
        for (let todo of project.todos) {
            addTodo(todo);
        }
    }

    const toggleShowProjectForm = () => {
        const projectForm = document.querySelector('#project-form');
        const addProjectBtn = document.querySelector('#add-project');

        if (projectForm.classList.contains('hidden')) {
            projectForm.classList.remove('hidden');
            addProjectBtn.classList.add('hidden');
            // focus on project name input field
            document.getElementById("project-name").focus();
        } else {
            projectForm.classList.add('hidden');
            addProjectBtn.classList.remove('hidden');
        }
    }

    const toggleShowTaskForm = () => {
        const taskForm = document.querySelector('#task-form');
        const addTaskBtn = document.querySelector('#add-task');

        if (taskForm.classList.contains('hidden')) {
            taskForm.classList.remove('hidden');
            addTaskBtn.classList.add('hidden');
        } else {
            taskForm.classList.add('hidden');
            addTaskBtn.classList.remove('hidden');
        }
    }

    const getProjectName = () => {
        const projectName = document.querySelector('#project-name').value;
        return projectName;
    }

    const getFormValues = () => {
        const title = document.querySelector('#task-title').value;
        const description = document.querySelector('#task-description').value;
        const dueDate = document.querySelector('#task-date').value;
        const priority = document.querySelector('#task-priority').value;

        return { title, description, dueDate, priority };
    }

    const displayProjects = (projectsList) => {
        clearProjects();
        populateProjects(projectsList);
    }

    const displayTodos = (project) => {
        clearTodos();
        populateTodos(project);
    }

    const clearTaskForm = () => {
        const taskForm = document.querySelector('#task-form');
        taskForm.reset();
    }

    const clearProjectForm = () => {
        const projectForm = document.querySelector('#project-form');
        projectForm.reset();
    }

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
        clearProjectForm
    };
})();

export default displayController;