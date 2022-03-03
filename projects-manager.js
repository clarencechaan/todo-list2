const projectsManager = (() => {

    let projects = [];
    let currentProjectIndex = 0;

    const addProject = (project) => {
        projects.push(project);
    }

    const getCurrentProject = () => {
        return projects[currentProjectIndex];
    }

    const addTodoToCurrentProject = (todo) => {
        getCurrentProject().addTodo(todo);
    }

    const removeProjectAtIndex = (index) => {
        projects.splice(index, 1);
        if (index === currentProjectIndex) {
            currentProjectIndex -= 1;
        }
    }

    const switchToProjectAtIndex = (index) => {
        currentProjectIndex = index;
    }

    return {
        projects,
        addProject,
        getCurrentProject,
        addTodoToCurrentProject,
        removeProjectAtIndex,
        switchToProjectAtIndex
    }
})();

export default projectsManager;