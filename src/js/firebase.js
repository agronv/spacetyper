import firebase from 'firebase';
import 'firebase/firestore';

// Firebase Configuration
const config = {
  apiKey: "AIzaSyDRD73V-iDgjeBF8klUTiI15RGeFr5XSkE",
  authDomain: "hack-attack-1ee3f.firebaseapp.com",
  databaseURL: "https://hack-attack-1ee3f.firebaseio.com",
  projectId: "hack-attack-1ee3f",
  storageBucket: "hack-attack-1ee3f.appspot.com",
  messagingSenderId: "881691454607"
};

const fb = firebase.initializeApp(config);
const highscores = fb.firestore().collection("highscores");

export const addHighscore = (name, time) => {
  highscores.add({
    name,
    time
  });
};

export const getHighscores = () => {
  return highscores.orderBy("time", "desc").limit(5).get();
}