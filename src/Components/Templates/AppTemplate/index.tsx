import { LayoutWithSidebar } from '../../Organism/LayoutWithSidebar'
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../Context/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import styles from './AppTemplate.module.scss'
import Alert from '../../Molecules/Alert';

type AppTemplate = {
  children?: ReactNode
}

export default function AppTemplate({ children }: AppTemplate) {
  const storedPage = localStorage.getItem('currentPage');
  const [currentPage, setCurrentPage] = useState(storedPage || 'home');
  const [showLoginSuccessAlert, setShowLoginSuccessAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

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

  return (
    <LayoutWithSidebar currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {children}
      <Alert
        isAlertOpen={showLoginSuccessAlert}
        setIsAlertOpen={setShowLoginSuccessAlert}
        message={`Bem-Vindo(a), ${user?.username}.`}
        alertDisplayTime={5000}
        onClose={closeAlert}
        type="success"
      />
    </LayoutWithSidebar>
  )
}
