import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FilmProps } from "../../../Types/types";
import styles from "./UpdateFIlmModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "../../Atoms/Input/Input";
import { useEffect, useState } from "react";
import { Dropdown } from "../../Atoms/Dropdown";
import Button from "../../Atoms/Button";
import FilmRepositories from "../../../Services/repositories/FilmRepositorie";
import { LoadingFullScreenTemplate } from "../../Templates/LoadingFullScreenTemplate";

interface UpdateFilmModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  data: FilmProps | undefined;
  setData: React.Dispatch<React.SetStateAction<FilmProps | undefined>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateFilmModal({
  isOpen,
  data,
  setData,
  onClose,
  isLoading,
  setIsLoading,
}: UpdateFilmModalProps) {
  const [film, setFilm] = useState<FilmProps | undefined>();

  useEffect(() => {
    setFilm(data);
  }, [data]);

  // const initalState: Partial<FilmProps> = {
  //   title: "",
  //   showtime: "",
  //   image: "",
  //   classification: "",
  //   synopsis: "",
  //   director: "",
  //   writer: [],
  //   cast: [],
  //   genres: [],
  //   duration: "",
  //   language: "",
  //   displayDate: "",
  //   trailer: "",
  //   screening: data?.screening,
  // };

  const handleClose = () => {
    setFilm(data);
    onClose();
  };

  const handleSubmit = async () => {
    if (!data?._id) return;
    if (!film) return;

    setIsLoading(true);
    try {
      await FilmRepositories.updateFilm(data?._id, film);
    } catch (error) {
      console.error("Não possível atualizar o filme: ", error);
    } finally {
      setIsLoading(false);
      onClose();
      window.location.reload();
    }
  };

  const classifications = [
    {
      classification: "L",
    },
    {
      classification: "10",
    },
    {
      classification: "12",
    },
    {
      classification: "14",
    },
    {
      classification: "16",
    },
    {
      classification: "18",
    },
  ];

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <>
      {isOpen && film && (
        <div className={styles.filmModalContainer}>
          <div className={styles.updateContent}>
            <h2>{film.screening}</h2>
            <form className={styles.filmForm}>
              <div className={styles.formSide}>
                <Input
                  value={film.title}
                  placeholder="Título"
                  onChange={(e) => setFilm({ ...film, title: e.target.value })}
                />
                <Input
                  value={film.showtime}
                  placeholder="Horário"
                  onChange={(e) =>
                    setFilm({ ...film, showtime: e.target.value })
                  }
                />
                <Input
                  value={film.duration}
                  placeholder="Duração"
                  onChange={(e) =>
                    setFilm({ ...film, duration: e.target.value })
                  }
                />
                <Input
                  value={film.language}
                  placeholder="Idioma"
                  onChange={(e) =>
                    setFilm({ ...film, language: e.target.value })
                  }
                />
                <Input
                  value={film.director}
                  placeholder="Direção"
                  onChange={(e) =>
                    setFilm({ ...film, director: e.target.value })
                  }
                />
                <Input
                  value={film.displayDate}
                  placeholder="Data de Exibição"
                  onChange={(e) =>
                    setFilm({ ...film, displayDate: e.target.value })
                  }
                />
              </div>
              <div className={styles.formSide}>
                <Input
                  value={film.writer.join(", ")}
                  placeholder="Roteiro (separado por vírgula)"
                  onChange={(e) =>
                    setFilm({ ...film, writer: e.target.value.split(", ") })
                  }
                />
                <Input
                  value={film.cast.join(", ")}
                  placeholder="Elenco (separado por vírgula)"
                  onChange={(e) =>
                    setFilm({ ...film, cast: e.target.value.split(", ") })
                  }
                />
                <Input
                  value={film.genres.join(", ")}
                  placeholder="Gêneros (separado por vírgula)"
                  onChange={(e) =>
                    setFilm({ ...film, genres: e.target.value.split(", ") })
                  }
                />
                <Input
                  value={film.trailer}
                  placeholder="Trailer"
                  onChange={(e) =>
                    setFilm({ ...film, trailer: e.target.value })
                  }
                />
                <Input
                  value={film.image}
                  placeholder="Imagem"
                  onChange={(e) => setFilm({ ...film, image: e.target.value })}
                />
                {/* <Dropdown
                  value={film.classification}
                  placeholder="Classificação"
                  onChange={(e) =>
                    setFilm({
                      ...film,
                      classification: e as "" | "L" | "12" | "14" | "16" | "18",
                    })
                  }
                  options={["L", "12", "14", "16", "18"]}
                /> */}
                <Input
                  value={film.synopsis}
                  placeholder="Sinopse"
                  onChange={(e) =>
                    setFilm({ ...film, synopsis: e.target.value })
                  }
                />
              </div>
            </form>
            <div className={styles.classificationContent}>
              {classifications.map(({ classification }) => (
                <img
                  className={
                    classification === film.classification
                      ? styles.currentClassification
                      : ""
                  }
                  onClick={() =>
                    setFilm({
                      ...film,
                      classification: classification as
                        | ""
                        | "L"
                        | "12"
                        | "14"
                        | "16"
                        | "18",
                    })
                  }
                  key={classification}
                  src={`assets/images/classificacao-${classification}.svg`}
                  alt={`classificação-${classification}`}
                />
              ))}
            </div>
            <Button marginTop="-12px" label={"Evniar"} onClick={handleSubmit} />
            <FontAwesomeIcon
              onClick={handleClose}
              className={styles.closeModalIcon}
              size="lg"
              icon={faXmark}
            />
          </div>
        </div>
      )}
    </>
  );
}
