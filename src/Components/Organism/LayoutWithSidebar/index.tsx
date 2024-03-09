import { Sidebar } from "../Sidebar";
import styles from "./AdminTemplate.module.scss";
import { ReactNode } from "react";
import Home from "../../../Pages/Home";
import Users from "../../../Pages/Users";
import Profile from "../../../Pages/Profile";
import Stock from "../../../Pages/Stock";
import Register from "../../../Pages/Register";

type LayoutWithSidebarType = {
  children?: ReactNode;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
};

export const LayoutWithSidebar = ({
  children,
  currentPage,
  setCurrentPage,
}: LayoutWithSidebarType) => {
  const renderContent = () => {
    if (currentPage === "home") {
      return <Home />;
    }
    if (currentPage === "profile") {
      return <Profile />;
    }
    if (currentPage === "order") {
      // return <Orders />;
      return "order";
    }
    if (currentPage === "stock") {
      return <Stock />;
    }
    if (currentPage === "register") {
      return <Register />;
    }
    if (currentPage === "users") {
      return <Users />;
    }

    return <Home />;
  };

  return (
    <>
      <Sidebar page={currentPage} setPage={setCurrentPage} />
      <div className={styles.container}>
        <div className={styles.elementsContainer}>
          {children}
          {renderContent()}
        </div>
      </div>
    </>
  );
};
