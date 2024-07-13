import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCR6AWu4qdleogF_0DlBPkhNAlIpwRJGu0",
    authDomain: "task-manager-8e686.firebaseapp.com",
    projectId: "task-manager-8e686",
    storageBucket: "task-manager-8e686.appspot.com",
    messagingSenderId: "141509948128",
    appId: "1:141509948128:web:f1533a0550b2fc99219685"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, onAuthStateChanged, collection };
