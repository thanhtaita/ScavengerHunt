import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import "../dotenv.tsx";
import { AuthContext } from "../src/utils/context.ts"; // context to store info about logged in user

// page import
import MainPage from "./pages/MainPage/MainPage.tsx";
import AdminGame from "./pages/AdminGame/AdminGame.tsx";
import Tutorials from "./pages/Tutorials/Tutorials.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import PlayerView from "./pages/PlayerView/playerView.tsx";

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const serverUrl = "http://localhost:9999";

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
          console.log("response: ", res.data.user);
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
    path: "/mygame/:gameId",
    element: <AdminGame />,
  },
  {
    path: "/playerview/:gameId",
    element: <PlayerView />,
  },
  {
    path: "/tutorials",
    element: <Tutorials />,
  },
  {
    path: "/settings",
    element: <Settings />,
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
