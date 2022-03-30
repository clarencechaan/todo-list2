import Todo from "./todo.js";
import Project from "./project.js";
import projectsManager from "./projects-manager.js";
import displayController from "./display-controller.js";
import defaultProjectsManager from "./default-projects-manager.json";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "./firebase-config.js";

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

    // save projectsManager to database if signed in, localStorage if signed out
    saveProjectsManager();

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

    // save projectsManager to database if signed in, localStorage if signed out
    saveProjectsManager();

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

    // save projectsManager to database if signed in, localStorage if signed out
    saveProjectsManager();

    // add event listener to projects
    addAllEventListeners();
  };

  const removeTodoAtIndex = (index) => {
    projectsManager.getCurrentProject().removeTodoAtIndex(index);
    displayController.displayTodos(projectsManager.getCurrentProject());

    // save projectsManager to database if signed in, localStorage if signed out
    saveProjectsManager();

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

        // save projectsManager to database if signed in, localStorage if signed out
        saveProjectsManager();
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

        // save projectsManager to database if signed in, localStorage if signed out
        saveProjectsManager();
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

async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || "/images/profile_placeholder.png";
}

// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}

function isUserSignedIn() {
  return !!getAuth().currentUser;
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  const userPicElement = document.querySelector("#user-pic");
  const userNameElement = document.querySelector("#user-name");
  const signOutButtonElement = document.querySelector("#sign-out");
  const signInContainer = document.querySelector("#sign-in-container");

  function addSizeToGoogleProfilePic(url) {
    if (
      url.indexOf("googleusercontent.com") !== -1 &&
      url.indexOf("?") === -1
    ) {
      return url + "?sz=150";
    }
    return url;
  }

  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute("hidden");
    userPicElement.removeAttribute("hidden");
    signOutButtonElement.removeAttribute("hidden");

    // Hide sign-in button.
    signInContainer.setAttribute("hidden", "true");

    // load projectsManager from firebase and set it if found
    // otherwise set it to defaultProjectsManager and upload it to firebase
    loadProjectsManager().then((x) => {
      console.log(x);
      if (x) {
        projectsManager.reconstructProjectsManager(x);
      } else {
        saveProjectsManager();
      }
      displayController.displayProjects(projectsManager.projects);
      displayController.displayTodos(projectsManager.projects[0]);
      todoApp.addAllEventListeners();
    });
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute("hidden", "true");
    userPicElement.setAttribute("hidden", "true");
    signOutButtonElement.setAttribute("hidden", "true");

    // Show sign-in button.
    signInContainer.removeAttribute("hidden");

    // get projects manager from localStorage
    const projectsManagerJSON = localStorage.getItem("projectsManager");
    const projectsManagerObject = JSON.parse(projectsManagerJSON);

    // set and display projectsManager
    if (projectsManagerObject === null) {
      // projectsManager not found in localStorage
      projectsManager.reconstructProjectsManager(defaultProjectsManager);
    } else {
      // projectsManager found in localStorage
      projectsManager.reconstructProjectsManager(projectsManagerObject);
    }

    // display projects and todos
    displayController.displayProjects(projectsManager.projects);
    displayController.displayTodos(projectsManager.projects[0]);

    // add all event listeners
    todoApp.addAllEventListeners();
  }
}

// saves projectManager to firebase if signed in
// saves projectManager to localStorage if signed out
async function saveProjectsManager() {
  if (isUserSignedIn()) {
    // save projectsManager to the Firebase database.
    try {
      await setDoc(
        doc(getFirestore(), "projectsManagers", getAuth().currentUser.uid),
        projectsManager.toPlainObject()
      );
    } catch (error) {
      console.error("Error writing to Firebase Database", error);
    }
  } else {
    // save projectsManager to local storage
    localStorage.setItem("projectsManager", JSON.stringify(projectsManager));
  }
}

async function loadProjectsManager() {
  // get projectsManager from firebase
  try {
    const docSnap = await getDoc(
      doc(getFirestore(), "projectsManagers", getAuth().currentUser.uid)
    );
    return docSnap.data();
  } catch (error) {
    console.error("Error reading from Firebase Database", error);
  }
}

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

// add event listener to sign-in button
const signInBtn = document.querySelector("#sign-in");
signInBtn.addEventListener("click", signIn);

// add event listener to sign-out button
const signOutBtn = document.querySelector("#sign-out");
signOutBtn.addEventListener("click", signOutUser);

// initialize Firebase
const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

initFirebaseAuth();
