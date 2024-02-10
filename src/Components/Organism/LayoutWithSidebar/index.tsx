import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../Context/AuthContext";
import { Sidebar } from "../Sidebar";
import styles from './AdminTemplate.module.scss';
import { ReactNode, useEffect, useState } from "react";
import Alert from "../../Molecules/Alert";
import Home from "../../../Pages/Home";
import Users from "../../../Pages/Users";

type AdminTemplateType = {
  isAdminPage?: ReactNode;
}

export const LayoutWithSidebar = ({ isAdminPage = false }: AdminTemplateType) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showLoginSuccessAlert, setShowLoginSuccessAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { from } = location.state || { from: { pathname: "/" } };

  const closeAlert = () => {
    setShowLoginSuccessAlert(false);
  };

  useEffect(() => {

    const checkAuthentication = async () => {

      if (from === "200:LoginSuccess") {
        setShowLoginSuccessAlert(true);
        navigate("/", { replace: true });
      }

      if (!isLoggedIn) {
        const queryParams = { from: "401:UnauthorizedPageAccess" };
        navigate("/login", { state: queryParams });
      }
    };

    checkAuthentication();
  }, [from, navigate, isLoggedIn]);

  const renderContent = () => {
    if (currentPage === "home") {
      return <Home />;
    }
    if (currentPage === "profile") {
      // return <Profile />;
      return 'profile'
    }
    if (currentPage === "order") {
      // return <Orders />;
      return 'order'
    }
    if (currentPage === "stock") {
      // return <Stock />;
      return 'stock'
    }
    if (currentPage === "register") {
      // return <Register />;
      return 'register'
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
          <Alert
            isAlertOpen={showLoginSuccessAlert}
            setIsAlertOpen={setShowLoginSuccessAlert}
            message={`Bem-Vindo(a), ${user?.username}.`}
            alertDisplayTime={5000}
            onClose={closeAlert}
            type="success"
          />
          {renderContent()}
        </div>
      </div>
    </>
  )
}