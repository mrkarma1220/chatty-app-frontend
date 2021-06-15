import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyB_ZGk1AsM8mzyCF1LEnD2PiHtVGSkh_Sk",
    authDomain: "chatty-app-f3362.firebaseapp.com",
    projectId: "chatty-app-f3362",
    storageBucket: "chatty-app-f3362.appspot.com",
    messagingSenderId: "302197869507",
    appId: "1:302197869507:web:481bf792a6d5a72b994b76",
    measurementId: "G-42K222E7JH"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};