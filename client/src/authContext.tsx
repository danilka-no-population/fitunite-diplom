import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем состояние авторизации при загрузке
    const token = localStorage.getItem('token'); // Предполагаем, что токен хранится в localStorage
    setIsAuthenticated(!!token);
  }, []);

  const login = () => {
    setIsAuthenticated(true); // Устанавливаем авторизацию
    const token = localStorage.getItem('token');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    localStorage.setItem('token', token); // Сохраняем токен (пример)
  };

  const logout = () => {
    setIsAuthenticated(false); // Убираем авторизацию
    localStorage.removeItem('token'); // Удаляем токен
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};