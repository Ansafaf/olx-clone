import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { auth } from "../services/firebase";
import { UserAuth } from "./AuthCreate";


const AuthProvider = ({children} :{children: ReactNode})=>{
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            setAuthenticated(Boolean(user));
            setLoading(false);
        });
        return unsubscribe;
    },[])

    const login = async(email: string, password: string)=>{
        const userFirebase = signInWithEmailAndPassword(auth, email, password);
        console.log(userFirebase);
        return (await userFirebase).user;      
    }

    const register = async(email: string, password: string)=>{
        const userFirebase = createUserWithEmailAndPassword(auth, email , password);
        console.log(userFirebase);
        return (await userFirebase).user;
    }

    const logout = async()=>{
        await signOut(auth);
    }
    return <UserAuth.Provider value={{isAuthenticated, login, register, logout, isLoading}}> {children} </UserAuth.Provider>
}
export default AuthProvider;