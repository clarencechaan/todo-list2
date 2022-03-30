import Project from "./project.js";

const projectsManager = (() => {
  let projects = [];
  let currentProjectIndex = 0;

  const addProject = (project) => {
    projects.push(project);
  };

  const getCurrentProject = () => {
    return projects[currentProjectIndex];
  };

  const addTodoToCurrentProject = (todo) => {
    getCurrentProject().addTodo(todo);
  };

  const removeProjectAtIndex = (index) => {
    projects.splice(index, 1);
    if (index === currentProjectIndex) {
      currentProjectIndex -= 1;
    }
  };

  const switchToProjectAtIndex = (index) => {
    currentProjectIndex = index;
  };

  const reconstructProjectsManager = (projectsManagerObject) => {
    projects.length = 0;
    for (let projectObject of projectsManagerObject.projects) {
      const project = new Project();
      project.reconstructProject(projectObject);
      addProject(project);
    }
  };

  const toPlainObject = () => {
    return JSON.parse(JSON.stringify({ projects }));
  };

  return {
    projects,
    addProject,
    getCurrentProject,
    addTodoToCurrentProject,
    removeProjectAtIndex,
    switchToProjectAtIndex,
    reconstructProjectsManager,
    toPlainObject,
  };
})();

export default projectsManager;
