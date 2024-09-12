import { Fragment, useEffect, useState } from "react";
import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";
import styles from "./Site.module.scss";
import { FilmProps } from "../../Types/types";
import FilmRepositories from "../../Services/repositories/FilmRepositorie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import UpdateFilmModal from "../../Components/Organism/UpdateFilmModal";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import DeleteModal from "../../Components/Organism/DeleteModal";
import Alert from "../../Components/Molecules/Alert";
import Caption from "../../Components/Molecules/Caption";
import CheckBox from "../../Components/Atoms/CheckBox";

export default function Site() {
  const [data, setData] = useState<FilmProps[] | undefined>();
  const [currentFilm, setCurrentFilm] = useState<FilmProps | undefined>();
  const [isModalOPen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [siteConfigsData, setSiteConfigsData] = useState({
    isClosed: false,
    isChristmas: false,
    isHalloween: false,
    popUpImage: false,
    popUpText: false,
  });

  console.log(siteConfigsData);

  const handleClosedConfigClicked = () => {
    setSiteConfigsData({
      ...siteConfigsData,
      isClosed: !siteConfigsData.isClosed,
    });
  };

  const handleChristmasConfigClicked = () => {
    setSiteConfigsData({
      ...siteConfigsData,
      isChristmas: !siteConfigsData.isChristmas,
    });
  };

  const handleHalloweenConfigClicked = () => {
    setSiteConfigsData({
      ...siteConfigsData,
      isHalloween: !siteConfigsData.isHalloween,
    });
  };

  const handlePopUpImageConfigClicked = () => {
    setSiteConfigsData({
      ...siteConfigsData,
      popUpImage: !siteConfigsData.popUpImage,
    });
  };

  const handlePopUpTextConfigClicked = () => {
    setSiteConfigsData({
      ...siteConfigsData,
      popUpText: !siteConfigsData.popUpText,
    });
  };

  useEffect(() => {
    async function fetchFilms() {
      setIsLoading(true);
      try {
        const films = await FilmRepositories.getFilms();

        // Ordena os filmes pela ordem das sessões
        const sortedFilms = films.sort((a: any, b: any) => {
          const sessionOrder = ["Sessão 1", "Sessão 2", "Sessão 3", "Sessão 4"];
          return (
            sessionOrder.indexOf(a.screening) -
            sessionOrder.indexOf(b.screening)
          );
        });

        setData(sortedFilms);
      } catch (error) {
        console.error("Não foi possível carregar os filmes: ", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFilms();
  }, []);

  const handleUpdate = (film: FilmProps) => {
    setCurrentFilm(film);
    setIsModalOpen(true);
  };

  const handleResetFilm = async (film: FilmProps) => {
    setIsLoading(true);
    try {
      await FilmRepositories.updateFilm(film._id, {
        title: "",
        showtime: "",
        image: "",
        classification: "L",
        synopsis: "",
        director: "",
        writer: [],
        cast: [],
        genres: [],
        duration: "",
        language: "",
        displayDate: "",
        trailer: "",
      });
    } catch (error) {
      console.error("Não foi possível 'excluir' filme: ", error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <section className={styles.filmsContainer}>
      <AccessLimitedToAdmins />
      <h1>Administração do Site</h1>
      <section className={styles.filmsContent}>
        {data?.map((film) => (
          <Fragment key={film._id}>
            {film.title ? (
              <div className={styles.filmCard}>
                <div className={styles.filmHeader}>
                  <p className={styles.filmTitle}>{film.screening}</p>
                  <div className={styles.iconContent}>
                    <FontAwesomeIcon
                      className={styles.icon}
                      size="lg"
                      onClick={() => handleUpdate(film)}
                      icon={faEdit}
                    />
                    <FontAwesomeIcon
                      onClick={() => {
                        setCurrentFilm(film);
                        setIsDeleteModalOpen(true);
                      }}
                      className={styles.icon}
                      size="lg"
                      icon={faTrash}
                    />
                  </div>
                </div>
                <img className={styles.filmImage} src={film.image} alt="film" />
              </div>
            ) : (
              <div className={`${styles.filmCard}`}>
                <div className={styles.filmHeader}>
                  <p className={styles.filmTitle}>{film.screening}</p>
                </div>
                <div
                  onClick={() => handleUpdate(film)}
                  className={styles.filmCardEmpty}
                >
                  <FontAwesomeIcon size="2xl" icon={faPlus} />
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </section>
      <section className={styles.configs}>
        <h2>Configurações</h2>
        <div className={styles.captions}>
          <div onClick={handleClosedConfigClicked}>
            <Caption
              label="Ativar aviso: Cine Drivin-in Fechado"
              onClickCheckBox={handleClosedConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="site"
                  checked={siteConfigsData.isClosed}
                  onChange={handleClosedConfigClicked}
                />
              }
            />
          </div>
          <div onClick={handleChristmasConfigClicked}>
            <Caption
              label="É Natal"
              onClickCheckBox={handleChristmasConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="christmas"
                  checked={siteConfigsData.isChristmas}
                  onChange={handleChristmasConfigClicked}
                />
              }
            />
          </div>
          <div onClick={handleHalloweenConfigClicked}>
            <Caption
              label="É Halloween"
              onClickCheckBox={handleHalloweenConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="halloween"
                  checked={siteConfigsData.isHalloween}
                  onChange={handleHalloweenConfigClicked}
                />
              }
            />
          </div>
          <div onClick={handlePopUpImageConfigClicked}>
            <Caption
              label="Adicionar pop-up de imagem"
              onClickCheckBox={handlePopUpImageConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="popupImage"
                  checked={siteConfigsData.popUpImage}
                  onChange={handlePopUpImageConfigClicked}
                />
              }
            />
          </div>
          <div onClick={handlePopUpTextConfigClicked}>
            <Caption
              label="Adicionar pop-up de texto"
              onClickCheckBox={handlePopUpTextConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="popupText"
                  checked={siteConfigsData.popUpText}
                  onChange={handlePopUpTextConfigClicked}
                />
              }
            />
          </div>
        </div>
      </section>
      <DeleteModal
        itemType={`filme (${currentFilm?.title})`}
        onClick={() =>
          currentFilm
            ? handleResetFilm(currentFilm)
            : console.warn("Erro ao selecionar filme.")
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <UpdateFilmModal
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        currentFilm={currentFilm}
        setCurrentFilm={setCurrentFilm}
        isOpen={isModalOPen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        setData={setData}
        setIsAlertOpen={setIsAlertOpen}
      />
      <Alert
        type="success"
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={`${currentFilm?.screening} atualizada com sucesso!`}
        alertDisplayTime={3000}
      />
    </section>
  );
}
