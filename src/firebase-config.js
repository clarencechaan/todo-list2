/**
 * To find your Firebase config object:
 *
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
  apiKey: "AIzaSyAm3WV5Czl1Xj1NF4VqDOu0kozQ4fhivl0",
  authDomain: "todo-list-8b345.firebaseapp.com",
  projectId: "todo-list-8b345",
  storageBucket: "todo-list-8b345.appspot.com",
  messagingSenderId: "369508381104",
  appId: "1:369508381104:web:68554ab8df37cddb472675",
  measurementId: "G-7581VEG8JR",
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return config;
  }
}
