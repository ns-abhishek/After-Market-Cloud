// Firebase configuration for Notification Center
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
  authDomain: "notification-center-app.firebaseapp.com",
  projectId: "notification-center-app",
  storageBucket: "notification-center-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
function initializeFirebase() {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Analytics if available
  if (firebase.analytics) {
    firebase.analytics();
  }

  // Initialize Firestore
  const db = firebase.firestore();

  // Initialize Authentication
  const auth = firebase.auth();
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  // Initialize Cloud Messaging if available
  let messaging = null;
  if (firebase.messaging) {
    messaging = firebase.messaging();

    // Request permission for notifications
    messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return messaging.getToken();
      })
      .then((token) => {
        console.log('FCM Token:', token);
        // Here you would send this token to your server
      })
      .catch((err) => {
        console.log('Unable to get permission for notifications.', err);
      });
  }

  // Initialize Calendar API integration
  initializeGoogleCalendar();

  return {
    db,
    auth,
    googleAuthProvider,
    messaging
  };
}

// Initialize Google Calendar API
function initializeGoogleCalendar() {
  // This function would be called after the Google API client is loaded
  // and the user is authenticated
  window.initGoogleCalendar = function() {
    gapi.client.init({
      apiKey: firebaseConfig.apiKey,
      clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your client ID
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
    }).then(function() {
      // Listen for sign-in state changes
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  };
}

// Update UI based on sign-in status
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // User is signed in, load calendar data
    loadCalendarEvents();
  } else {
    // User is not signed in, update UI accordingly
    console.log('User not signed in to Google Calendar');
  }
}

// Load calendar events
function loadCalendarEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    const events = response.result.items;
    if (events.length > 0) {
      console.log('Upcoming events:', events);
      // Here you would update your UI with the events
    } else {
      console.log('No upcoming events found.');
    }
  });
}

// Instructions:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Register your app in the Firebase console
// 3. Replace the placeholder values above with your actual Firebase configuration
// 4. Enable Authentication, Firestore, and Cloud Messaging in the Firebase console
// 5. Set up Google Calendar API in the Google Cloud Console and get a client ID
