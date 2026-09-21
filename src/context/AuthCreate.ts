import type { User } from "firebase/auth";
import { createContext, useContext } from "react";

export type AuthContext = {
    isAuthenticated: boolean
    isLoading: boolean
    login: (email:string, password: string)=> Promise<User>
    register: (email: string, password: string)=> Promise<User>
    logout: ()=> Promise<void>
}
export const UserAuth = createContext<AuthContext | null>(null);

export const useAuth = () => useContext(UserAuth);
