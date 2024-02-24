import style from './CheckBox.module.scss'

type Props = {
  checked: boolean
  onChange: VoidFunction;
  id: string;
}

export default function CheckBox({ onChange, checked, id }: Props) {

  const handleCheckboxChange = () => {
    onChange && onChange();
  };

  return (
    <>
      <div className={style['checkbox-wrapper-37']}>
        <input
          type="checkbox"
          name="checkbox"
          id={id}
          checked={checked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={id} className={style["terms-label"]}>
          <svg
            className={style["checkbox-svg"]}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1_476_5-37" fill="white">
              <rect width="200" height="200"></rect>
            </mask>
            <rect
              width="200"
              height="200"
              className={style["checkbox-box"]}
              stroke-width="40"
              mask="url(#path-1-inside-1_476_5-37)"
            ></rect>
            <path
              className={style["checkbox-tick"]}
              d="M52 111.018L76.9867 136L149 64"
              stroke-width="22"
            ></path>
          </svg>
        </label>
      </div>

      {/* <input
        className={`${style.checkBoxContainer}`}
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      /> */}
    </>
  )
}
