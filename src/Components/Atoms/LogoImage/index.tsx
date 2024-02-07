type Props = {
  size?: string;
  marginTop?: string;
  marginBottom?: string;
}

export default function LogoImage({ size, marginBottom, marginTop }: Props) {
  return (
    <img
      style={{ height: size ? size : undefined, marginTop, marginBottom }}
      src={process.env.PUBLIC_URL + "/assets/images/logo-drivein.svg"}
      alt="Logo"
    />
  )
}
