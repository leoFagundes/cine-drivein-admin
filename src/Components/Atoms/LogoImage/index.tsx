import style from './LogoImage.module.scss'

type Props = {
  size?: string;
}

export default function LogoImage({ size }: Props) {
  return (
    <img
      className={style.logoImage}
      style={{ height: size ? size : "" }}
      src={process.env.PUBLIC_URL + "/assets/images/logo-drivein.svg"}
      alt="Logo Image"
    />
  )
}
