import Text from '../../Components/Atoms/Text';
import { useAuth } from '../../Context/AuthContext';
import styles from './Profile.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserCheck, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { profileIconData } from "./profileIconData";
import UserRepositories from '../../Services/repositories/UserRepositories';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const handleClick = async (profileImageUpdate: string) => {
    let updatedProfileImage = profileImageUpdate;

    if (profileImageUpdate === 'random') {
      updatedProfileImage = generateRandomName();
    }

    if (user?._id) {
      try {
        const updateData = {
          profileImage: updatedProfileImage,
        };

        await UserRepositories.updateUser(user._id, updateData);

        const updatedUser = { ...user, profileImage: updatedProfileImage };
        updateUser(updatedUser);

        console.log("Usuário atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
      }
    }
  };

  const generateRandomName = () => {
    const length = Math.floor(Math.random() * 7) + 4; // Gera um número aleatório entre 4 e 10
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  if (user) {
    return (
      <section className={styles.profileContainer}>
        <div className={styles.userCard}>
          {user.profileImage !== '' ?
            <img
              className={styles.userProfileImage}
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.profileImage}`}
              alt={`Profile Icon - ${user.username}`}
            />
            :
            <div className={styles.userDefaultProfileImage}>
              <FontAwesomeIcon size="lg" icon={faUser} />
            </div>
          }
          <div className={styles.userInfo}>
            <Text>{user.username}</Text>
            <Text>{user.email}</Text>
          </div>
          <div className={styles.userManage}>
            {user.isAdmin && <FontAwesomeIcon color='#268f3ff5' size="sm" icon={faUserCheck} />}
          </div>
        </div>
        <div className={styles.userIcons}>
          <div onClick={() => handleClick('')} className={`${styles.userDefaultProfileImage}`}>
            <FontAwesomeIcon size="xl" icon={faUser} />
          </div>
          <div onClick={() => handleClick('random')} className={`${styles.userDefaultProfileImage}`}>
            <FontAwesomeIcon size="2xl" icon={faQuestion} />
          </div>
          {profileIconData.map(({ seed }, index) => (
            <div key={index}>
              <img
                className={`${styles.profileIcon}`}
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
                alt={"avatar" + seed}
                onClick={() => handleClick(seed)}
              />
            </div>
          ))}
        </div>

      </section>
    )
  }
  else {
    return <></>
  }
}
