/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });



    const [token, setToken] = useState(() => {

        return localStorage.getItem("token");

    });



    const login = (data) => {

        const { token, user } = data;


        localStorage.setItem(
            "token",
            token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        setToken(token);

        setUser(user);

    };



    const logout = () => {


        localStorage.removeItem("token");

        localStorage.removeItem("user");


        setToken(null);

        setUser(null);

    };



    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};



export const useAuth = () => {

    return useContext(AuthContext);

};