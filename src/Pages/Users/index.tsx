import { useEffect, useState } from "react";
import Text from "../../Components/Atoms/Text";
import styles from "./Users.module.scss";
import { UserType } from "../../Types/types";
import UserRepositories from "../../Services/repositories/UserRepositories";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserXmark,
  faUserPen,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../../Components/Organism/DeleteModal";
import Alert from "../../Components/Molecules/Alert";
import UpdateUserModal from "../../Components/Organism/UpdateUserModal";
import { useAuth } from "../../Context/AuthContext";
import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentClickedUser, setCurrentClickedUser] = useState<UserType>();
  const { user, logout } = useAuth();

  const closeAlert = () => {
    setShowDeleteAlert(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersFetched = await UserRepositories.getUsers();
        setUsers(usersFetched);
        setIsLoading(false);
      } catch (error) {
        console.log("Erro ao carregar usuários", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleConfirmDelete = async (userId: string) => {
    setIsLoading(true);
    try {
      await UserRepositories.deleteUser(userId);
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      setShowDeleteAlert(true);
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      if (userId === user?._id) {
        logout();
      }
    } catch (error) {
      console.log("Erro ao deletar usuários", error);
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <section className={styles.usersContainer}>
      <AccessLimitedToAdmins />
      <div className={styles.usersContent}>
        {users.map(
          ({ _id, username, password, email, isAdmin, profileImage }) => (
            <div key={_id} className={styles.userCard}>
              {profileImage !== "" ? (
                <img
                  className={styles.userProfileImage}
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${profileImage}`}
                  alt={`Profile Icon - ${username}`}
                />
              ) : (
                <div className={styles.userDefaultProfileImage}>
                  <FontAwesomeIcon size="lg" icon={faUser} />
                </div>
              )}
              <div className={styles.userInfo}>
                <Text>{username}</Text>
                <Text>{email}</Text>
              </div>
              <div className={styles.userManage}>
                {isAdmin && (
                  <FontAwesomeIcon
                    color="#268f3ff5"
                    size="sm"
                    icon={faUserCheck}
                    title="Usuário administrador"
                  />
                )}
                <FontAwesomeIcon
                  onClick={() => setIsUpdateModalOpen(true)}
                  className={styles.userManageEdit}
                  size="sm"
                  icon={faUserPen}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    setCurrentClickedUser({
                      _id,
                      username,
                      password,
                      email,
                      isAdmin,
                      profileImage,
                    });
                    setIsDeleteModalOpen(true);
                  }}
                  className={styles.userManageDelete}
                  size="sm"
                  icon={faUserXmark}
                />
              </div>
            </div>
          )
        )}
      </div>
      <DeleteModal
        onClick={() =>
          handleConfirmDelete(
            currentClickedUser?._id ? currentClickedUser._id : ""
          )
        }
        itemType="usuário"
        onClose={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
      <UpdateUserModal
        onClick={() => ""}
        onClose={() => setIsUpdateModalOpen(false)}
        isOpen={isUpdateModalOpen}
      />
      <Alert
        isAlertOpen={showDeleteAlert}
        setIsAlertOpen={setShowDeleteAlert}
        message={`Usuário excluído com sucesso.`}
        alertDisplayTime={3000}
        onClose={closeAlert}
        type="success"
      />
    </section>
  );
}
