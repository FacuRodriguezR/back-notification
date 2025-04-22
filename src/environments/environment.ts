// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyDFVqnVroPKJYeTM_ZqcIGWoboRwJ4rXKk",
    authDomain: "autoshopapp-a4cb1.firebaseapp.com",
    projectId: "autoshopapp-a4cb1",
    storageBucket: "autoshopapp-a4cb1.firebasestorage.app",
    messagingSenderId: "984920975373",
    appId: "1:984920975373:web:5bcdf935950ce48909cd44"
  },
  baseUrl: 'http://localhost:3000/', 
  send_notification: 'send-notification',
  send_notification_to_level: 'send-notification-to-level',
  
  subscribe_to_topic: 'subscribe-to-topic'


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
