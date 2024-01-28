import { ChangeEvent, useEffect, useState } from 'react';
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
const INVALID_LOGIN = 'Nome de usuário ou Senha incorretos.'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showAlertCreateUser, setShowAlertCreateUser] = useState(false);

  const navigate = useNavigate()
  const location = useLocation();
  const { login } = useAuth();
  const { from } = location.state || { from: { pathname: "/" } };

  const closeAlert = () => {
    setShowAlertCreateUser(false);
  };

  useEffect(() => {
    if (from === "userCreated") {
      setShowAlertCreateUser(true);
      navigate("/login", { replace: true });
    }
  }, []);

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
      navigate("/admin", { state: { from: "loginSuccess" } });
    } else {
      setUsernameError(INVALID_LOGIN);
      setPasswordError(INVALID_LOGIN);
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
        showAlert={showAlertCreateUser}
        setShowAlert={setShowAlertCreateUser}
        mensagem="Conta criada com sucesso."
        tempoExibicao={5000}
        onClose={closeAlert}
        type="success"
      />
    </section>
  )
}
