import { createContext, useContext } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../services/firebase";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  async function loginGoogle() {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  }

  return (
    <AuthContext.Provider
      value={{
        loginGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};