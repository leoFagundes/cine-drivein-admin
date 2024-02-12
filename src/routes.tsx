import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import AppPage from "./Pages/AppPage";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
