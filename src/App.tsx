import { AuthProvider } from "./Context/AuthContext";
import "./Global.scss"
import Router from "./routes";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
