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
  if (isUserSignedIn()) {
    console.log("user is signed in");
    projectsManager.reconstructProjectsManager(loadProjectsManager());
  }

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
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute("hidden", "true");
    userPicElement.setAttribute("hidden", "true");
    signOutButtonElement.setAttribute("hidden", "true");

    // Show sign-in button.
    signInContainer.removeAttribute("hidden");
  }
}

async function saveProjectsManager(projectsManager) {
  console.log(projectsManager.toPlainObject());
  console.log(getAuth().currentUser.uid);
  // Add a new message entry to the Firebase database.
  try {
    await setDoc(
      doc(getFirestore(), "projectsManagers", getAuth().currentUser.uid),
      projectsManager.toPlainObject()
    );
  } catch (error) {
    console.error("Error writing to Firebase Database", error);
  }
}

async function loadProjectsManager() {
  try {
    return await getDoc(
      doc(getFirestore(), "projectsManagers", getAuth().currentUser.uid)
    );
  } catch (error) {
    console.error("Error reading from Firebase Database", error);
  }
}

export {
  signIn,
  signOutUser,
  isUserSignedIn,
  initFirebaseAuth,
  saveProjectsManager,
  loadProjectsManager,
};
