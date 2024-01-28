import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Inicializa o estado de autenticação com base no localStorage
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  const [user, setUser] = useState(() => {
    // Inicializa o estado do usuário com base no localStorage
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);

    // Atualiza o localStorage com as informações do usuário
    localStorage.setItem("auth", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);

    // Remove as informações do usuário do localStorage ao fazer logout
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  };

  const updateUser = (userUpdated) => {
    setUser(userUpdated);
    localStorage.setItem("user", JSON.stringify(userUpdated));
  };

  useEffect(() => {
    // Atualiza o localStorage sempre que o estado de autenticação muda
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
