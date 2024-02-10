import { useEffect, useState } from 'react';
import Text from '../../Components/Atoms/Text'
import styles from './Users.module.scss'
import { UserType } from '../../Types/types';
import UserRepositories from '../../Services/repositories/UserRepositories';
import { LoadingFullScreenTemplate } from '../../Components/Templates/LoadingFullScreenTemplate';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserXmark, faUserPen, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from '../../Components/Organism/DeleteModal';
import Alert from '../../Components/Molecules/Alert';

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const closeAlert = () => {
    setShowDeleteAlert(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const usersFetched = await UserRepositories.getUsers();
        setUsers(usersFetched);
        setIsLoading(false)
      } catch (error) {
        console.log('Erro ao carregar usuários', error)
        setIsLoading(false)
      }
    };

    fetchUsers();
  }, []);

  const handleConfirmDelete = async (userId: string) => {
    try {
      await UserRepositories.deleteUser(userId);
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      setShowDeleteAlert(true);
      setIsModalOpen(false)
    } catch (error) {
      console.log('Erro ao deletar usuários', error)
    }
  };

  return (
    <section className={styles.usersContainer}>
      <Text fontSize='extraLarge' fontWeight='semibold'>Usuários</Text>
      <div className={styles.usersContent}>
        {users.map(({ _id, username, password, email, isAdmin, profileImage }) => (
          <div key={_id} className={styles.userCard}>
            {profileImage !== '' ?
              <img
                className={styles.userProfileImage}
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${profileImage}`}
                alt={`Profile Icon - ${username}`}
              />
              :
              <div className={styles.userDefaultProfileImage}>
                <FontAwesomeIcon size="lg" icon={faUser} />
              </div>
            }
            <div className={styles.userInfo}>
              <Text>{username}</Text>
              <Text>{email}</Text>
            </div>
            <div className={styles.userManage}>
              {isAdmin && <FontAwesomeIcon color='#268f3ff5' size="sm" icon={faUserCheck} />}
              <FontAwesomeIcon className={styles.userManageEdit} size="sm" icon={faUserPen} />
              <FontAwesomeIcon onClick={() => setIsModalOpen(true)} className={styles.userManageDelete} size="sm" icon={faUserXmark} />
            </div>
            <DeleteModal onClick={() => handleConfirmDelete(_id ? _id : '')} itemId={_id ? _id : ''} itemType='usuário' onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />
          </div>
        ))}
      </div>
      <Alert
        isAlertOpen={showDeleteAlert}
        setIsAlertOpen={setShowDeleteAlert}
        message={`Usuário excluído com sucesso.`}
        alertDisplayTime={3000}
        onClose={closeAlert}
        type="success"
      />
    </section>
  )
}
