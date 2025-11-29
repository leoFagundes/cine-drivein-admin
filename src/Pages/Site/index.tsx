import { Fragment, useEffect, useState } from "react";
import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";
import styles from "./Site.module.scss";
import { FilmProps, SiteConfig } from "../../Types/types";
import FilmRepositories from "../../Services/repositories/FilmRepositorie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import UpdateFilmModal from "../../Components/Organism/UpdateFilmModal";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import DeleteModal from "../../Components/Organism/DeleteModal";
import Alert from "../../Components/Molecules/Alert";
import Caption from "../../Components/Molecules/Caption";
import CheckBox from "../../Components/Atoms/CheckBox";
import SiteConfigsRepository from "../../Services/repositories/SiteConfigsRepositorie";
import { Input } from "../../Components/Atoms/Input/Input";
import Button from "../../Components/Atoms/Button";

export default function Site() {
  const [data, setData] = useState<FilmProps[] | undefined>();
  const [currentFilm, setCurrentFilm] = useState<FilmProps | undefined>();
  const [isModalOPen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [siteConfigsData, setSiteConfigsData] = useState<
    SiteConfig | undefined
  >();
  const [siteConfigsChecks, setSiteConfigsChecks] = useState({
    isClosed: false,
    isChristmas: false,
    isHalloween: false,
    isEaster: false,
    popUpImage: false,
    popUpText: false,
  });
  const [isConfigAlertOpen, setIsConfigAlertOpen] = useState(false);
  const [configAlertMessage, setConfigAlertMessage] = useState("");
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copySourceFilm, setCopySourceFilm] = useState<FilmProps | null>(null);
  const [copyTarget, setCopyTarget] = useState("");

  const handleClosedConfigClicked = async () => {
    setIsLoading(true);
    try {
      if (!siteConfigsData) return;

      await SiteConfigsRepository.updateConfig("66e399ad3b867fd49fe79d0b", {
        isClosed: !siteConfigsChecks.isClosed,
      });

      setSiteConfigsData({
        ...siteConfigsData,
        isClosed: !siteConfigsChecks.isClosed,
      });

      setConfigAlertMessage(
        !siteConfigsChecks.isClosed
          ? "Aviso de site fechado ativado!"
          : "Aviso de site fechado desativado!"
      );
      setIsConfigAlertOpen(true);

      setSiteConfigsChecks((prevState) => ({
        ...siteConfigsChecks,
        isClosed: !siteConfigsChecks.isClosed,
      }));
    } catch (error) {
      console.error(
        "Não foi possível alterar o status de abertura do site: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChristmasConfigClicked = async () => {
    setIsLoading(true);
    try {
      if (!siteConfigsData) return;

      await SiteConfigsRepository.updateConfig("66e399ad3b867fd49fe79d0b", {
        isEvent: siteConfigsChecks.isChristmas ? "default" : "christmas",
      });

      setConfigAlertMessage(
        siteConfigsChecks.isChristmas
          ? "Tema de Natal desativado!"
          : "Tema de Natal ativado!"
      );
      setIsConfigAlertOpen(true);

      setSiteConfigsChecks({
        ...siteConfigsChecks,
        isChristmas: !siteConfigsChecks.isChristmas,
        isHalloween: false,
        isEaster: false,
      });
    } catch (error) {
      console.error(
        "Não foi possível alterar o status de evento do site: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHalloweenConfigClicked = async () => {
    setIsLoading(true);
    try {
      if (!siteConfigsData) return;

      await SiteConfigsRepository.updateConfig("66e399ad3b867fd49fe79d0b", {
        isEvent: siteConfigsChecks.isHalloween ? "default" : "halloween",
      });
      setConfigAlertMessage(
        siteConfigsChecks.isHalloween
          ? "Tema de Halloween desativado!"
          : "Tema de Halloween ativado!"
      );
      setIsConfigAlertOpen(true);

      setSiteConfigsChecks({
        ...siteConfigsChecks,
        isHalloween: !siteConfigsChecks.isHalloween,
        isChristmas: false,
        isEaster: false,
      });
    } catch (error) {
      console.error(
        "Não foi possível alterar o status de evento do site: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEasterConfigClicked = async () => {
    setIsLoading(true);
    try {
      if (!siteConfigsData) return;

      await SiteConfigsRepository.updateConfig("66e399ad3b867fd49fe79d0b", {
        isEvent: siteConfigsChecks.isEaster ? "default" : "easter",
      });
      setConfigAlertMessage(
        siteConfigsChecks.isEaster
          ? "Tema de Páscoa desativado!"
          : "Tema de Páscoa ativado!"
      );
      setIsConfigAlertOpen(true);

      setSiteConfigsChecks({
        ...siteConfigsChecks,
        isEaster: !siteConfigsChecks.isEaster,
        isChristmas: false,
        isHalloween: false,
      });
    } catch (error) {
      console.error(
        "Não foi possível alterar o status de evento do site: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopUpImageConfigClicked = async () => {
    try {
      setConfigAlertMessage(
        !siteConfigsChecks.popUpImage
          ? "Popup de imagem ativado!"
          : "Popup de imagem desativado!"
      );
      setIsConfigAlertOpen(true);

      setSiteConfigsChecks({
        ...siteConfigsChecks,
        popUpImage: !siteConfigsChecks.popUpImage,
      });
    } catch (error) {}
  };

  const handleUpdateImage = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile as Blob);
      }
      const imageName = imageFile
        ? await SiteConfigsRepository.createImageItem(formData)
        : "";

      await SiteConfigsRepository.updateConfig("66e399ad3b867fd49fe79d0b", {
        popUpImage: imageName,
      });
      setConfigAlertMessage("Imagem enviada com sucesso!");
      setIsConfigAlertOpen(true);

      if (siteConfigsData)
        setSiteConfigsData({
          ...siteConfigsData,
          popUpImage: imageName,
        });
    } catch (error) {
      console.error("Não foi possível cirar a imagem: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    setIsLoading(true);
    try {
      const image = siteConfigsData?.popUpImage;

      if (image) {
        const photoFileName = (image as string).split("/").pop();
        if (photoFileName)
          await SiteConfigsRepository.deleteItemImage(photoFileName);
        await SiteConfigsRepository.updateConfig("66e399ad3b867fd49fe79d0b", {
          popUpImage: "",
        });

        setConfigAlertMessage("Imagem removida!");
        setIsConfigAlertOpen(true);

        setSiteConfigsData({
          ...siteConfigsData,
          popUpImage: "",
        });

        setSiteConfigsChecks({
          ...siteConfigsChecks,
          popUpImage: false,
        });
      }
    } catch (error) {
      console.error("Erro ao deletar imagem: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySubmit = async () => {
    if (!copySourceFilm || !copyTarget) return;

    setIsLoading(true);

    try {
      const targetFilm = data?.find((film) => film.screening === copyTarget);

      if (!targetFilm) {
        console.warn("Filme destino não encontrado");
        return;
      }

      await FilmRepositories.updateFilm(targetFilm._id, {
        title: copySourceFilm.title,
        showtime: copySourceFilm.showtime,
        image: copySourceFilm.image,
        classification: copySourceFilm.classification,
        synopsis: copySourceFilm.synopsis,
        director: copySourceFilm.director,
        writer: copySourceFilm.writer,
        cast: copySourceFilm.cast,
        genres: copySourceFilm.genres,
        duration: copySourceFilm.duration,
        language: copySourceFilm.language,
        displayDate: copySourceFilm.displayDate,
        trailer: copySourceFilm.trailer,
      });

      setConfigAlertMessage(
        `Copiado de ${copySourceFilm.screening} para ${copyTarget}!`
      );
      setIsConfigAlertOpen(true);

      setCopyModalOpen(false);

      // Atualiza a lista
      const updated = await FilmRepositories.getFilms();
      setData(updated);
    } catch (error) {
      console.error("Erro ao copiar sessão: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopUpTextConfigClicked = () => {
    setSiteConfigsChecks({
      ...siteConfigsChecks,
      popUpText: !siteConfigsChecks.popUpText,
    });
  };

  useEffect(() => {
    async function fetchFilms() {
      setIsLoading(true);
      try {
        const films = await FilmRepositories.getFilms();
        const currentConfig: SiteConfig =
          await SiteConfigsRepository.getConfigById("66e399ad3b867fd49fe79d0b");

        // Ordena os filmes pela ordem das sessões
        const sortedFilms = films.sort((a: any, b: any) => {
          const sessionOrder = ["Sessão 1", "Sessão 2", "Sessão 3", "Sessão 4"];
          return (
            sessionOrder.indexOf(a.screening) -
            sessionOrder.indexOf(b.screening)
          );
        });

        setData(sortedFilms);
        setSiteConfigsData(currentConfig);
        setSiteConfigsChecks({
          isClosed: currentConfig.isClosed,
          isChristmas: currentConfig.isEvent === "christmas" ? true : false,
          isHalloween: currentConfig.isEvent === "halloween" ? true : false,
          isEaster: currentConfig.isEvent === "easter" ? true : false,
          popUpImage: currentConfig.popUpImage ? true : false,
          popUpText:
            currentConfig.popUpText.title &&
            currentConfig.popUpText.description.length > 0
              ? true
              : false,
        });
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
                      icon={faCopy}
                      onClick={() => {
                        setCopySourceFilm(film);
                        setCopyModalOpen(true);
                      }}
                    />

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
        <h2>Configurações extras</h2>

        <div className={styles.configGrid}>
          <div
            className={styles.configCard}
            onClick={handleClosedConfigClicked}
          >
            <Caption
              label="Ativar aviso: Cine Drive-in Fechado"
              onClickCheckBox={handleClosedConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="site"
                  checked={siteConfigsChecks.isClosed}
                  onChange={() => {}}
                />
              }
            />
          </div>

          <div
            className={styles.configCard}
            onClick={handleChristmasConfigClicked}
          >
            <Caption
              label="É Natal"
              onClickCheckBox={handleChristmasConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="christmas"
                  checked={siteConfigsChecks.isChristmas}
                  onChange={() => {}}
                />
              }
            />
          </div>

          <div
            className={styles.configCard}
            onClick={handleHalloweenConfigClicked}
          >
            <Caption
              label="É Halloween"
              onClickCheckBox={handleHalloweenConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="halloween"
                  checked={siteConfigsChecks.isHalloween}
                  onChange={() => {}}
                />
              }
            />
          </div>

          <div
            className={styles.configCard}
            onClick={handleEasterConfigClicked}
          >
            <Caption
              label="É Páscoa"
              onClickCheckBox={handleEasterConfigClicked}
              checkboxLeft={
                <CheckBox
                  id="easter"
                  checked={siteConfigsChecks.isEaster}
                  onChange={() => {}}
                />
              }
            />
          </div>

          <div className={styles.configCardWide}>
            <div onClick={handlePopUpImageConfigClicked}>
              <Caption
                marginBottom={siteConfigsChecks.popUpImage ? "16px" : "0"}
                label="Adicionar pop-up de imagem"
                onClickCheckBox={handlePopUpImageConfigClicked}
                checkboxLeft={
                  <CheckBox
                    id="popupImage"
                    checked={siteConfigsChecks.popUpImage}
                    onChange={() => {}}
                  />
                }
              />
            </div>

            {siteConfigsChecks.popUpImage && (
              <>
                {siteConfigsData?.popUpImage ? (
                  <div
                    className={styles.imageExist}
                    onClick={(e) => handleDeleteImage(e)}
                  >
                    <FontAwesomeIcon size="lg" icon={faTrash} />
                    <p>{siteConfigsData.popUpImage as string}</p>
                  </div>
                ) : (
                  <div className={styles.imageDoesNotExist}>
                    <Input
                      value=""
                      placeholder="Foto"
                      type="file"
                      onChange={(e) =>
                        setImageFile(e?.target?.files?.[0] as File)
                      }
                    />
                    <Button
                      marginTop="6px"
                      label="Enviar"
                      onClick={handleUpdateImage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {copyModalOpen && (
        <div className={styles.copyModalOverlay}>
          <div className={styles.copyModal}>
            <h3>Copiar dados de {copySourceFilm?.screening}</h3>

            <p>Selecione a sessão destino:</p>

            <select
              onChange={(e) => setCopyTarget(e.target.value)}
              className={styles.selectSession}
            >
              <option value="">Selecione</option>
              {["Sessão 1", "Sessão 2", "Sessão 3", "Sessão 4"]
                .filter((s) => s !== copySourceFilm?.screening)
                .map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
            </select>

            <div className={styles.modalActions}>
              <Button
                label="Cancelar"
                onClick={() => setCopyModalOpen(false)}
              />
              <Button label="Copiar" onClick={handleCopySubmit} />
            </div>
          </div>
        </div>
      )}

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
        isAlertOpen={isConfigAlertOpen}
        setIsAlertOpen={setIsConfigAlertOpen}
        onClose={() => setIsConfigAlertOpen(false)}
        message={configAlertMessage}
        alertDisplayTime={2500}
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
