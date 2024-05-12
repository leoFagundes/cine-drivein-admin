import { useAuth } from "../../../Context/AuthContext";
import Text from "../../Atoms/Text";
import styles from "./AccessLimitedToAdmins.module.scss";

export default function AccessLimitedToAdmins() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return (
      <div className={styles.onlyAdmin}>
        <div>
          <Text fontSize="extraLarge" fontWeight="bold">
            Apenas Administradores podem acessar essa funcionalidade
          </Text>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
