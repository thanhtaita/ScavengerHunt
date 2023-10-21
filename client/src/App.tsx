import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import "../dotenv.tsx";
import MainPage from "./pages/MainPage/MainPage.tsx";
import { AuthContext } from "../src/utils/context.ts";

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const serverUrl = "http://localhost:5000";

// a React context to hold the logged-in and user states so they can be shared globally
const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const checkLoginState = useCallback(async () => {
    try {
      const {
        data: { loggedIn: logged_in, user },
      } = await axios.get(`${serverUrl}/auth/logged_in`);
      setLoggedIn(logged_in);
      user && setUser(user);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return (
    <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>
      {children}
    </AuthContext.Provider>
  );
};

const Callback = () => {
  const called = useRef(false);
  const { checkLoginState, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("callback");
  useEffect(() => {
    (async () => {
      if (loggedIn === false) {
        try {
          if (called.current) return; // prevent rerender caused by StrictMode
          called.current = true;
          const res = await axios.get(
            `${serverUrl}/auth/token${window.location.search}`
          );
          console.log("response: ", res);
          checkLoginState();
          navigate("/");
        } catch (err) {
          console.error(err);
          navigate("/");
        }
      } else if (loggedIn === true) {
        navigate("/");
      }
    })();
  }, [checkLoginState, loggedIn, navigate]);
  return <></>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/auth/callback/", // google will redirect here
    element: <Callback />,
  },
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </header>
    </div>
  );
}

export default App;
