import { ChangeEvent, useEffect, useState } from "react";
import { FormTemplate } from "../../Components/Templates/FormTemplate/FormTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import UserRepositories from "../../Services/repositories/UserRepositories";
import { UserType } from "../../Types/types";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";

const ERROR_USERNAME_MESSAGE = "Nome de usuário inválido.";
const ERROR_EMAIL_MESSAGE = "Email inválido.";
const ERROR_FORMAT_EMAIL = "Deve estar no formato nome@gmail.com";
const ERROR_EMAIL_ALREADY_EXIST = "Este e-mail já está em uso.";
const ERROR_USERNAME_ALREADY_EXIST = "Este nome de usuário já está em uso.";
const ERROR_PASSWORD_MESSAGE = "Senha inválida.";
const ERROR_TOKEN_MESSAGE = "Token de administrador inválido.";
const ERROR_USERNAME_TO0_LONG = "Usuário deve ter entre 3-12 caracteres.";

type InputsTypes = {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: "file" | "password" | "text" | "number";
  errorLabel: string;
};

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [tokenError, setTokenError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleUsernameWith = (value: string) => {
    setUsername(value);
    setUsernameError("");
  };

  const handleEmailWith = (value: string) => {
    setEmail(value);
    setEmailError("");
  };

  const handlePasswordWith = (value: string) => {
    setPassword(value);
    setPasswordError("");
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

    if (!password.trim()) {
      setPasswordError(ERROR_PASSWORD_MESSAGE);
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (token && token !== process.env.REACT_APP_ADMIN_TOKEN) {
      setTokenError(ERROR_TOKEN_MESSAGE);
      isValid = false;
    } else {
      setTokenError("");
    }

    return isValid;
  };

  useEffect(() => {
    if (token && token === process.env.REACT_APP_ADMIN_TOKEN) {
      setIsAdmin(true);
    }
  }, [token]);

  const handleSubmit = async () => {
    const allUsers = await UserRepositories.getUsers();

    if (!validateForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    // Verifica se o e-mail já está em uso
    if (allUsers.some((user: UserType) => user.email === email)) {
      setEmailError(ERROR_EMAIL_ALREADY_EXIST);
      return;
    }

    // Verifica se o nome já está em uso
    if (allUsers.some((user: UserType) => user.username === username)) {
      setUsernameError(ERROR_USERNAME_ALREADY_EXIST);
      return;
    }

    setIsLoading(true);
    try {
      await UserRepositories.createUser({ username, password, email, isAdmin });
      console.log("Usuário criado com sucesso");
      navigate("/login", { state: { from: "201:UserCreated" } });
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      setIsLoading(false);
    }
  };

  const INPUTS: InputsTypes[] = [
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
    {
      value: password,
      placeholder: "Senha",
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        handlePasswordWith(e.target.value),
      type: "password",
      errorLabel: passwordError,
    },
  ];

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <FormTemplate
      label="Crie sua conta"
      inputs={INPUTS}
      buttonLabel="Criar conta"
      buttonOnClick={handleSubmit}
      linkLabel="Fazer login"
      linkIcon={<FontAwesomeIcon size="sm" icon={faRightToBracket} />}
      linkOnClick={() => navigate("/login")}
      createAccountTokenInfo={{
        value: token,
        placeholder: "Token de administrador",
        onChange: (e) => handleTokenWith(e.target.value),
        type: "password",
        errorLabel: tokenError,
      }}
    />
  );
}
