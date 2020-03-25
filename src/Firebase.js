import * as firebase from 'firebase/app';
import firebaseConfig from './Config/firebaseConfig'
// Add the Firebase products that you want to use
import 'firebase/firestore';
import 'firebase/auth'

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const fb = firebase;

export const fbconfig = firebaseConfig