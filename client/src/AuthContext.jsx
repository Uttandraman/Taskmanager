import { createContext, useState, useContext} from "react";

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const[user, setUser] = useState(null);

    const login = (user) => {
        setUser(user)
        //alert(user.name)
        //setUserpassword(userPassword);
    }

    return(
        <AuthContext.Provider value = {{user, setUser, login}}>
        {children}
        </AuthContext.Provider>
    );
};

//export const useAuth = () => useContext(AuthContext);