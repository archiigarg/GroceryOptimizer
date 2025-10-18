import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwP0VC86coqdrMORfqN1M2oexqn7gcYso",
  authDomain: "groceryoptimizer-d4c3a.firebaseapp.com",
  projectId: "groceryoptimizer-d4c3a",
  storageBucket: "groceryoptimizer-d4c3a.appspot.com",
  messagingSenderId: "771471597291",
  appId: "1:771471597291:web:919b33572be83b52daa8ae"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
