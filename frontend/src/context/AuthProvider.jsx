import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [academicYear, setAcademicYear] = useState("");
  return (
    <AuthContext.Provider
      value={{ auth, setAuth, academicYear, setAcademicYear }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
