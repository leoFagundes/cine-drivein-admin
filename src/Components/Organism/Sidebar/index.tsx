import styles from "./Sidebar.module.scss";
import LogoImage from "../../Atoms/LogoImage";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouse,
  faScroll,
  faBoxesStacked,
  faUserGroup,
  faBoxesPacking,
  faRightFromBracket,
  faBars,
  faXmark,
  faPhotoFilm,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { HorizontalItem } from "../../Molecules/HorizontalItem";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router";

type SideBarType = {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

export const Sidebar = ({ page, setPage }: SideBarType) => {
  const [isDisplayOn, setIsDisplayOn] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const isOpen = isDisplayOn || width > 720;
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  const sideBarElementsInfo = [
    {
      key: "profile",
      label: user?.username || "Perfil",
      profileImage: user?.profileImage || "",
      icon: faUser,
      onClick: () => setPage("profile"),
    },
    {
      key: "home",
      label: "Home",
      icon: faHouse,
      onClick: () => setPage("home"),
    },
    {
      key: "order",
      label: "Pedidos",
      icon: faScroll,
      onClick: () => setPage("order"),
    },
    {
      key: "stock",
      label: "Estoque",
      icon: faBoxesStacked,
      onClick: () => setPage("stock"),
    },
    {
      key: "register",
      label: "Cadastro",
      icon: faBoxesPacking,
      onClick: () => setPage("register"),
    },
    {
      key: "users",
      label: "Usuários",
      icon: faUserGroup,
      onClick: () => setPage("users"),
    },
    {
      key: "films",
      label: "Filmes",
      icon: faPhotoFilm,
      onClick: () => setPage("films"),
    },
    {
      key: "exit",
      label: "Sair",
      icon: faRightFromBracket,
      onClick: handleLogoutClick,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const variants = {
    open: { left: 0 },
    closed: { left: "-300px" },
  };

  return (
    <>
      <button
        onClick={() => setIsDisplayOn(true)}
        className={styles.hamburguerContainer}
      >
        <FontAwesomeIcon size="3x" icon={faBars} />
      </button>

      <motion.div
        className={styles.container}
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className={styles.mobileCloseIconContainer}>
          <FontAwesomeIcon
            onClick={() => setIsDisplayOn(false)}
            size="xl"
            icon={faXmark}
          />
        </div>

        <LogoImage size="70px" />
        {sideBarElementsInfo.map((item, index) => {
          const marginTop = index === 0 ? "32px" : "16px";
          const IS_SELECTED = page === item.key;

          return (
            <HorizontalItem
              key={item.key}
              pageKey={item.key}
              isSelected={IS_SELECTED}
              label={item.label}
              icon={item.icon}
              profileImage={item.profileImage}
              onClick={item.onClick}
              marginTop={marginTop}
            />
          );
        })}
      </motion.div>
    </>
  );
};
