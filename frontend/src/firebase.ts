import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtkchvCH0_9CQpfSC9pSgdVQ06sJmbvo0",
    authDomain: "cookbook-pap.firebaseapp.com",
    projectId: "cookbook-pap",
    storageBucket: "cookbook-pap.firebasestorage.app",
    messagingSenderId: "944748637548",
    appId: "1:944748637548:web:cb84085bac6f1600119749"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
