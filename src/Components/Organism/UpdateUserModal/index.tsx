import styles from "./UpdateUserModal.module.scss";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { UserType } from "../../../Types/types";
import { FormTemplate } from "../../Templates/FormTemplate/FormTemplate";
import UserRepositories from "../../../Services/repositories/UserRepositories";

type ModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
  user?: UserType;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ERROR_USERNAME_MESSAGE = "Nome de usuário inválido.";
const ERROR_EMAIL_MESSAGE = "Email inválido.";
const ERROR_FORMAT_EMAIL = "Deve estar no formato nome@gmail.com";
const ERROR_EMAIL_ALREADY_EXIST = "Este e-mail já está em uso.";
const ERROR_USERNAME_ALREADY_EXIST = "Este nome de usuário já está em uso.";
const ERROR_TOKEN_MESSAGE = "Token de administrador inválido.";
const ERROR_USERNAME_TO0_LONG = "Usuário deve ter entre 3-12 caracteres.";

export default function UpdateUserModal({
  onClose,
  isOpen,
  user,
  setIsLoading,
}: ModalType) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    setUsername(user?.username ? user?.username : "");
    setEmail(user ? user?.email : "");
    setToken(
      process.env.REACT_APP_ADMIN_TOKEN && user?.isAdmin
        ? process.env.REACT_APP_ADMIN_TOKEN
        : ""
    );
    setUsernameError("");
    setEmailError("");
    setTokenError("");
  }, [isOpen]);

  useEffect(() => {
    if (token && token === process.env.REACT_APP_ADMIN_TOKEN) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [token, isOpen, isAdmin]);

  const handleUsernameWith = (value: string) => {
    setUsername(value);
    setUsernameError("");
  };

  const handleEmailWith = (value: string) => {
    setEmail(value);
    setEmailError("");
  };

  const handleTokenWith = (value: string) => {
    setToken(value);
    setTokenError("");
  };

  const validateForm = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError(ERROR_USERNAME_MESSAGE);
      isValid = false;
    } else if (username.trim().length < 3 || username.trim().length > 12) {
      setUsernameError(ERROR_USERNAME_TO0_LONG);
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!email.trim()) {
      setEmailError(ERROR_EMAIL_MESSAGE);
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      setEmailError(ERROR_FORMAT_EMAIL);
      isValid = false;
    } else {
      setEmailError("");
    }

    if (token && token !== process.env.REACT_APP_ADMIN_TOKEN) {
      setTokenError(ERROR_TOKEN_MESSAGE);
      isValid = false;
    } else {
      setTokenError("");
    }

    return isValid;
  };

  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    event.target === event.currentTarget && onClose();
  };

  const handleSubmit = async () => {
    const allUsers = await UserRepositories.getUsers();

    if (!validateForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    // Verifica se o e-mail já está em uso
    if (
      allUsers.some(
        (userInUsers: UserType) =>
          userInUsers.email === email && user?._id !== userInUsers._id
      )
    ) {
      setEmailError(ERROR_EMAIL_ALREADY_EXIST);
      return;
    }

    // Verifica se o nome já está em uso
    if (
      allUsers.some(
        (userInUsers: UserType) =>
          userInUsers.username === username &&
          user?.username !== userInUsers.username
      )
    ) {
      setUsernameError(ERROR_USERNAME_ALREADY_EXIST);
      return;
    }

    setIsLoading && setIsLoading(true);
    try {
      await UserRepositories.updateUser(user?._id ? user?._id : "", {
        username,
        email,
        isAdmin,
      });
      console.log("Dados do usuário alterados com sucesso");

      setIsLoading && setIsLoading(false);
      window.location.href = `${window.location.pathname}?from=201:UserUpdated`;
    } catch (error) {
      console.error("Erro ao alterar dados do usuário:", error);
      setIsLoading && setIsLoading(false);
    }

    onClose();
  };

  return (
    <>
      {isOpen && user && (
        <div onClick={handleCloseModalWith} className={styles.container}>
          <div className={styles.modalContainer}>
            <FontAwesomeIcon
              onClick={onClose}
              className={styles.closeModalIcon}
              size="lg"
              icon={faXmark}
            />
            <FormTemplate
              logo={false}
              label={`Atulizar dados de ${user.username}`}
              inputs={[
                {
                  value: username,
                  placeholder: "Nome de usuário",
                  onChange: (e: ChangeEvent<HTMLInputElement>) =>
                    handleUsernameWith(e.target.value),
                  type: "text",
                  errorLabel: usernameError,
                },
                {
                  value: email,
                  placeholder: "Email",
                  onChange: (e: ChangeEvent<HTMLInputElement>) =>
                    handleEmailWith(e.target.value),
                  type: "text",
                  errorLabel: emailError,
                },
              ]}
              buttonLabel="Criar conta"
              buttonOnClick={handleSubmit}
              createAccountTokenInfo={{
                value: token,
                placeholder: "Token de administrador",
                onChange: (e) => handleTokenWith(e.target.value),
                type: "password",
                errorLabel: tokenError,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
