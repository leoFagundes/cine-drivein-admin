import { ChangeEvent, Fragment, ReactNode, useEffect, useState } from "react";
import styles from "./RegisterFormTemplate.module.scss";
import Text from "../../Atoms/Text";
import { Input } from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button";
import Caption from "../../Molecules/Caption";
import CheckBox from "../../Atoms/CheckBox";
import { AdditionalItem, Item } from "../../../Types/types";
import AdditionalItemRepositories from "../../../Services/repositories/AdditionalItemRepositories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type CaptionKey = "general" | "sauces" | "drinks" | "sweets";

type subitemType = {
  general: boolean;
  sauces: boolean;
  drinks: boolean;
  sweets: boolean;

  [key: string]: boolean;
};

type RegisterFormTemplateType = {
  label: string;
  inputs: Array<{
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: "file" | "password" | "text" | "number";
    errorLabel: string;
    caption?: ReactNode;
    suggestions?: string[];
    onSelectSuggestion?: (value: string) => void;
  }>;
  withSubitem?: boolean;
  buttonOnClick: VoidFunction;
  buttonLabel: string;
  setItemWithSubitems?: React.Dispatch<React.SetStateAction<Item>>;
  itemWithSubitems?: Item;
  blockSubitems?: boolean;
};

export default function RegisterFormTemplate({
  label,
  inputs,
  buttonOnClick,
  buttonLabel,
  setItemWithSubitems,
  itemWithSubitems,
  withSubitem = false,
  blockSubitems = false,
}: RegisterFormTemplateType) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [subitemOptions, setSubitemOptions] = useState<AdditionalItem[]>();
  const [subitemStates, setSubitemStates] = useState<subitemType>({
    general: false,
    sauces: false,
    drinks: false,
    sweets: false,
  });
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>();

  useEffect(() => {
    const fetchAdditionalItems = async () => {
      try {
        const additionalItemsResponse =
          await AdditionalItemRepositories.getAdditionalItems();
        setAdditionalItems(additionalItemsResponse);
      } catch (error) {
        console.error("Erro ao buscar itens adicionais:", error);
      }
    };

    fetchAdditionalItems();
  }, []);

  useEffect(() => {
    const fetchSelectedItems = async () => {
      const itemData = await AdditionalItemRepositories.getAdditionalItems();

      setSubitemOptions(itemData);
    };

    fetchSelectedItems();
  }, [setSubitemOptions]);

  const handleDropdownChange = (
    event: ChangeEvent<HTMLSelectElement>,
    key: string
  ) => {
    const selectedValue = event.target.value;

    if (setItemWithSubitems) {
      setItemWithSubitems((prevItem) => {
        const updatedItem = { ...prevItem };

        if (!updatedItem.additionals) {
          updatedItem.additionals = [];
        }
        if (!updatedItem.additionals_sauces) {
          updatedItem.additionals_sauces = [];
        }
        if (!updatedItem.additionals_drinks) {
          updatedItem.additionals_drinks = [];
        }
        if (!updatedItem.additionals_sweets) {
          updatedItem.additionals_sweets = [];
        }

        // Verifica se o item já foi selecionado antes de adicioná-lo
        if (key === "general") {
          const isDuplicate = updatedItem.additionals.some(
            (item) => item.additionalItem === selectedValue
          );
          if (isDuplicate) {
            console.error("Este valor já foi selecionado.");
            return updatedItem;
          }
          updatedItem.additionals.push({ additionalItem: selectedValue });
        } else if (key === "sauces") {
          const isDuplicate = updatedItem.additionals_sauces.some(
            (item) => item.additionalItem === selectedValue
          );
          if (isDuplicate) {
            console.error("Este valor já foi selecionado.");
            return updatedItem;
          }
          updatedItem.additionals_sauces.push({
            additionalItem: selectedValue,
          });
        } else if (key === "drinks") {
          const isDuplicate = updatedItem.additionals_drinks.some(
            (item) => item.additionalItem === selectedValue
          );
          if (isDuplicate) {
            console.error("Este valor já foi selecionado.");
            return updatedItem;
          }
          updatedItem.additionals_drinks.push({
            additionalItem: selectedValue,
          });
        } else if (key === "sweets") {
          const isDuplicate = updatedItem.additionals_sweets.some(
            (item) => item.additionalItem === selectedValue
          );
          if (isDuplicate) {
            console.error("Este valor já foi selecionado.");
            return updatedItem;
          }
          updatedItem.additionals_sweets.push({
            additionalItem: selectedValue,
          });
        }

        return updatedItem;
      });
    }
  };

  const handleItemRemove = (key: string, selectedValue: string) => {
    if (setItemWithSubitems) {
      setItemWithSubitems((prevItem) => {
        const updatedItem = { ...prevItem };

        if (!updatedItem.additionals) {
          updatedItem.additionals = [];
        }
        if (!updatedItem.additionals_sauces) {
          updatedItem.additionals_sauces = [];
        }
        if (!updatedItem.additionals_drinks) {
          updatedItem.additionals_drinks = [];
        }
        if (!updatedItem.additionals_sweets) {
          updatedItem.additionals_sweets = [];
        }

        if (key === "general") {
          updatedItem.additionals = updatedItem.additionals.filter(
            (item) => item.additionalItem !== selectedValue
          );
        } else if (key === "sauces") {
          updatedItem.additionals_sauces =
            updatedItem.additionals_sauces.filter(
              (item) => item.additionalItem !== selectedValue
            );
        } else if (key === "drinks") {
          updatedItem.additionals_drinks =
            updatedItem.additionals_drinks.filter(
              (item) => item.additionalItem !== selectedValue
            );
        } else if (key === "sweets") {
          updatedItem.additionals_sweets =
            updatedItem.additionals_sweets.filter(
              (item) => item.additionalItem !== selectedValue
            );
        }

        return updatedItem;
      });
    }
  };

  const handleCaptionChange = (caption: CaptionKey) => {
    setSubitemStates((prevState) => {
      const updatedSubitemStates = { ...prevState };

      for (const key in updatedSubitemStates) {
        updatedSubitemStates[key] = false;
      }

      updatedSubitemStates[caption] = !prevState[caption];

      return updatedSubitemStates;
    });
  };

  const getInputMargin = (index: number, errorLabel: string) => {
    if (index === 0) return "";
    if (errorLabel) return "12px";
    return "24px";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buttonOnClick();
    }
  };

  const filteredOptions = subitemOptions?.filter(
    (option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.description &&
        option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const handleMouseOver = (index: number) => {
    const item = document.querySelectorAll(`.${styles.item}`)[index];
    item.classList.add(styles.hovered);
  };

  const handleMouseOut = (index: number) => {
    const item = document.querySelectorAll(`.${styles.item}`)[index];
    item.classList.remove(styles.hovered);
  };

  const renderAdditionals = (additionals: any, key: string) => {
    return additionals
      .filter((item: any) => item && item.additionalItem)
      .map((item: any, index: number) => {
        if (item.additionalItem._id === undefined) {
          const additionalItem = additionalItems?.find(
            (additional) => additional._id === item.additionalItem
          );

          if (additionalItem) {
            return (
              <div key={index} className={styles.item}>
                <Text fontSize="mediumSmall">{additionalItem.name}</Text>
                <FontAwesomeIcon
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  onClick={() => handleItemRemove(key, item.additionalItem)}
                  icon={faClose}
                />
              </div>
            );
          }
        } else {
          const additionalItem = additionalItems?.find(
            (additional) => additional._id === item.additionalItem._id
          );

          if (additionalItem) {
            return (
              <div key={index} className={styles.item}>
                <Text fontSize="mediumSmall">{additionalItem.name}</Text>
                <FontAwesomeIcon
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                  onClick={() => handleItemRemove(key, item.additionalItem)}
                  icon={faClose}
                />
              </div>
            );
          }
        }

        return null;
      });
  };

  return (
    <section className={styles.container}>
      <Text fontWeight="semibold" marginBottom="32px" fontSize="large">
        {label}
      </Text>
      <div className={styles.form}>
        <div className={styles.inputs}>
          {inputs.map((item, index) => {
            return (
              <Input
                key={item.placeholder}
                value={item.value}
                placeholder={item.placeholder}
                onChange={item.onChange}
                type={item.type}
                errorLabel={item.errorLabel}
                marginTop={getInputMargin(index, item.errorLabel)}
                caption={item.caption}
                onKeyDown={handleKeyPress}
                suggestions={item.suggestions}
                onSelectSuggestion={item.onSelectSuggestion}
              />
            );
          })}
        </div>
        {withSubitem && (
          <div className={styles.subitems}>
            {/* {blockSubitems && (
              <div className={styles.blockSubitems}>
                <FontAwesomeIcon size="2x" icon={faWarning} />
                <Text fontWeight="semibold" fontSize="mediumLarge">
                  Funcionalidade Bloqueada para esta ação!
                </Text>
              </div>
            )} */}

            <Text fontWeight="semibold">Adicionar um subitem</Text>
            <div className={styles.captions}>
              <div>
                <Caption
                  label="Geral"
                  checkboxLeft={
                    <CheckBox
                      id="general"
                      onChange={() => handleCaptionChange("general")}
                      checked={subitemStates.general}
                    />
                  }
                />
                <Text
                  fontColor="placeholder-color"
                  fontSize="small"
                  fontWeight="semibold"
                >
                  (
                  {
                    itemWithSubitems?.additionals?.filter(
                      (item: any) => item && item.additionalItem
                    ).length
                  }{" "}
                  {itemWithSubitems?.additionals?.filter(
                    (item: any) => item && item.additionalItem
                  ).length === 1
                    ? "opção escolhida"
                    : "opções escolhidas"}
                  )
                </Text>
              </div>
              <div>
                <Caption
                  label="Molhos"
                  checkboxLeft={
                    <CheckBox
                      id="sauces"
                      onChange={() => handleCaptionChange("sauces")}
                      checked={subitemStates.sauces}
                    />
                  }
                />
                <Text
                  fontColor="placeholder-color"
                  fontSize="small"
                  fontWeight="semibold"
                >
                  (
                  {
                    itemWithSubitems?.additionals_sauces?.filter(
                      (item: any) => item && item.additionalItem
                    ).length
                  }{" "}
                  {itemWithSubitems?.additionals_sauces?.filter(
                    (item: any) => item && item.additionalItem
                  ).length === 1
                    ? "opção escolhida"
                    : "opções escolhidas"}
                  )
                </Text>
              </div>
              <div>
                <Caption
                  label="Bebidas"
                  checkboxLeft={
                    <CheckBox
                      id="drinks"
                      onChange={() => handleCaptionChange("drinks")}
                      checked={subitemStates.drinks}
                    />
                  }
                />
                <Text
                  fontColor="placeholder-color"
                  fontSize="small"
                  fontWeight="semibold"
                >
                  (
                  {
                    itemWithSubitems?.additionals_drinks?.filter(
                      (item: any) => item && item.additionalItem
                    ).length
                  }{" "}
                  {itemWithSubitems?.additionals_drinks?.filter(
                    (item: any) => item && item.additionalItem
                  ).length === 1
                    ? "opção escolhida"
                    : "opções escolhidas"}
                  )
                </Text>
              </div>
              <div>
                <Caption
                  label="Doces"
                  checkboxLeft={
                    <CheckBox
                      id="sweets"
                      onChange={() => handleCaptionChange("sweets")}
                      checked={subitemStates.sweets}
                    />
                  }
                />
                <Text
                  fontColor="placeholder-color"
                  fontSize="small"
                  fontWeight="semibold"
                >
                  (
                  {
                    itemWithSubitems?.additionals_sweets?.filter(
                      (item: any) => item && item.additionalItem
                    ).length
                  }{" "}
                  {itemWithSubitems?.additionals_sweets?.filter(
                    (item: any) => item && item.additionalItem
                  ).length === 1
                    ? "opção escolhida"
                    : "opções escolhidas"}
                  )
                </Text>
              </div>
            </div>
            <div className={styles.options}>
              {Object.keys(subitemStates).map((key) => (
                <Fragment key={key}>
                  {subitemStates[key] === true && (
                    <div className={styles.optionsContent}>
                      <Text
                        fontColor="background-secondary-color"
                        fontWeight="semibold"
                      >
                        Escolha as Opções{" "}
                        <Text fontColor="placeholder-color">({key})</Text>
                      </Text>
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        border
                        placeHolderAnimation={false}
                      />
                      <select
                        className={styles.optionsSelect}
                        value={[]}
                        onChange={(e) => handleDropdownChange(e, key)}
                        multiple
                      >
                        {filteredOptions?.map((option) => (
                          <option key={option._id} value={option._id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      <div className={styles.items}>
                        <Text
                          fontColor="background-secondary-color"
                          fontWeight="semibold"
                        >
                          Opções Escolhidas
                        </Text>
                        {subitemStates.general &&
                          itemWithSubitems?.additionals &&
                          renderAdditionals(itemWithSubitems.additionals, key)}
                        {subitemStates.sauces &&
                          itemWithSubitems?.additionals_sauces &&
                          renderAdditionals(
                            itemWithSubitems.additionals_sauces,
                            key
                          )}
                        {subitemStates.drinks &&
                          itemWithSubitems?.additionals_drinks &&
                          renderAdditionals(
                            itemWithSubitems.additionals_drinks,
                            key
                          )}
                        {subitemStates.sweets &&
                          itemWithSubitems?.additionals_sweets &&
                          renderAdditionals(
                            itemWithSubitems.additionals_sweets,
                            key
                          )}
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button label={buttonLabel} onClick={buttonOnClick} />
    </section>
  );
}
