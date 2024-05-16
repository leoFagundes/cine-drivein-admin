import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";
import AppTemplate from "../../Components/Templates/AppTemplate";

export default function AppPage() {
  return (
    <>
      <AccessLimitedToAdmins />
      <AppTemplate />
    </>
  );
}
