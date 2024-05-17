import { LayoutWithSidebar } from "../../Organism/LayoutWithSidebar";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../Context/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import Alert from "../../Molecules/Alert";
import ItemRepositories from "../../../Services/repositories/ItemRepositories";
import { Item } from "../../../Types/types";

type AppTemplateType = {
  children?: ReactNode;
};

export default function AppTemplate({ children }: AppTemplateType) {
  const storedPage = localStorage.getItem("currentPage");
  const [currentPage, setCurrentPage] = useState(storedPage || "home");
  const [showLoginSuccessAlert, setShowLoginSuccessAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { from } = location.state || { from: { pathname: "/" } };

  function preloadImages(urls: string[]) {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }

  useEffect(() => {
    const preloadItemImages = async () => {
      try {
        const items = await ItemRepositories.getItems();
        const imagePhotos = items.map((item: Item) => item.photo);
        preloadImages(imagePhotos);
      } catch (error) {
        console.error("Não foi possível pré-carregar as imagens!");
      }
    };

    preloadItemImages();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
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
    <LayoutWithSidebar
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    >
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
  );
}
