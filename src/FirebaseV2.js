import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBHR4BtCzgCRBKPrNiwPaAjnLk12vfFuiQ",
    authDomain: "league-management-5e38a.firebaseapp.com",
    databaseURL: "https://league-management-5e38a.firebaseio.com",
    projectId: "league-management-5e38a",
    storageBucket: "league-management-5e38a.appspot.com",
    messagingSenderId: "386730016162",
    appId: "1:386730016162:web:63365c8ff4f4ba4f8106fb"
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.firestore()
  }
}
export default Firebase;