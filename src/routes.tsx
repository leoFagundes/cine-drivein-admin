import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { LayoutWithSidebar } from "./Components/Organism/LayoutWithSidebar";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LayoutWithSidebar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
