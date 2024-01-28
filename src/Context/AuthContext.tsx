import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
} from "react";
import { UserType } from "../Types/types";

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserType | null;
  login: (userData: UserType) => void;
  logout: () => void;
  updateUser: (userUpdated: SetStateAction<UserType | null>) => void;
};

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderType = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderType) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  const [user, setUser] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: UserType) => {
    setIsLoggedIn(true);
    setUser(userData);

    localStorage.setItem("auth", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);

    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  };

  const updateUser = (userUpdated: SetStateAction<UserType | null>) => {
    setUser(userUpdated);
    localStorage.setItem("user", JSON.stringify(userUpdated));
  };

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};