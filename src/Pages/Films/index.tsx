import { Fragment, useEffect, useState } from "react";
import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";
import styles from "./Films.module.scss";
import { FilmProps } from "../../Types/types";
import FilmRepositories from "../../Services/repositories/FilmRepositorie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import UpdateFilmModal from "../../Components/Organism/UpdateFilmModal";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import DeleteModal from "../../Components/Organism/DeleteModal";

export default function Films() {
  const [data, setData] = useState<FilmProps[] | undefined>();
  const [currentFilm, setCurrentFilm] = useState<FilmProps | undefined>();
  const [isModalOPen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFilms() {
      setIsLoading(true);
      try {
        const films = await FilmRepositories.getFilms();

        // Ordena os filmes pela ordem das sessões
        const sortedFilms = films.sort((a: any, b: any) => {
          const sessionOrder = ["Sessão 1", "Sessão 2", "Sessão 3"];
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
  }, [setData]);

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
      <h2>FILMES</h2>
      <div className={styles.filmsContent}>
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
      </div>
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
        data={currentFilm}
        setData={setCurrentFilm}
        isOpen={isModalOPen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
