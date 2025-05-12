import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AuthWrapper from "./AuthWrapper";
import { AuthProvider } from "./context/AuthContext";
import AllRoutes from "./views/routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper>
          <AllRoutes />
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
