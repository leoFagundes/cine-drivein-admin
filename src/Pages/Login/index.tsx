import { useEffect, useState } from 'react';
import style from './Login.module.scss'
import { FormTemplate } from '../../Components/Templates/FormTemplate/FormTemplate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router';
import UserRepositories from '../../Services/repositories/UserRepositories';
import { useAuth } from '../../Context/AuthContext';
import Alert from '../../Components/Molecules/Alert';

const ERROR_USERNAME_MESSAGE = 'Nome de usuário inválido.'
const ERROR_PASSWORD_MESSAGE = 'Senha inválida.'
const INVALID_USERNAME_LOGIN = 'Falha no Login - Nome de usuário incorreto.'
const INVALID_PASSWORD_LOGIN = 'Falha no Login - Senha incorreta.'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showCreatedUserAlert, setShowCreatedUserAlert] = useState(false);
  const [showUnauthorizedPageAccessAlert, setShowUnauthorizedPageAccessAlert] = useState(false);

  const navigate = useNavigate()
  const location = useLocation();
  const { login } = useAuth();
  const { from } = location.state || { from: { pathname: "/" } };

  const closeAlert = () => {
    setShowCreatedUserAlert(false);
    setShowUnauthorizedPageAccessAlert(false)
  };

  useEffect(() => {
    if (from === "201:UserCreated") {
      setShowCreatedUserAlert(true);
      navigate("/login", { replace: true });
    }

    if (from === "401:UnauthorizedPageAccess") {
      setShowUnauthorizedPageAccessAlert(true);
      navigate("/login", { replace: true });
    }
  }, [from, navigate]);

  const handleUsernameWith = (value: string) => {
    setUsername(value);
    setUsernameError('');
  }

  const handlePasswordWith = (value: string) => {
    setPassword(value);
    setPasswordError('');
  }

  const validateForm = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError(ERROR_USERNAME_MESSAGE);
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError(ERROR_PASSWORD_MESSAGE);
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    const providerRequest = await UserRepositories.loginUser({
      username,
      password,
    });

    if (!validateForm()) {
      console.log('Formulário Inválido.')
      return
    }

    if (providerRequest) {
      console.log(providerRequest.user.isAdmin);
      login(providerRequest.user);
      navigate("/", { state: { from: "200:LoginSuccess" } });
    } else {
      setUsernameError(INVALID_USERNAME_LOGIN);
      setPasswordError(INVALID_PASSWORD_LOGIN);
      return
    }
  }

  return (
    <section className={style.loginContainer}>
      <FormTemplate
        label="Realize seu login"
        inputs={[
          {
            value: username,
            placeholder: 'Nome de usuário',
            onChange: (e) => handleUsernameWith(e.target.value),
            type: 'text',
            errorLabel: usernameError
          },
          {
            value: password,
            placeholder: 'Senha',
            onChange: (e) => handlePasswordWith(e.target.value),
            type: 'password',
            errorLabel: passwordError
          },
        ]}
        buttonLabel='Fazer login'
        buttonOnClick={handleSubmit}
        linkLabel='Criar minha conta'
        linkIcon={<FontAwesomeIcon size='sm' icon={faRightToBracket} />}
        linkOnClick={() => navigate("/signUp")}
      />
      <Alert
        isAlertOpen={showCreatedUserAlert}
        setIsAlertOpen={setShowCreatedUserAlert}
        message="Conta criada com sucesso."
        alertDisplayTime={5000}
        onClose={closeAlert}
        type="success"
      />
      <Alert
        isAlertOpen={showUnauthorizedPageAccessAlert}
        setIsAlertOpen={setShowUnauthorizedPageAccessAlert}
        message="Acesso inválido, faça login para continuar."
        alertDisplayTime={5000}
        onClose={closeAlert}
        type="danger"
      />
    </section>
  )
}
