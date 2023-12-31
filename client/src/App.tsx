import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { AuthContext } from "../src/utils/context.ts"; // context to store info about logged in user

// page import
import MainPage from "./pages/MainPage/MainPage.tsx";
import AdminGame from "./pages/AdminGame/AdminGame.tsx";
import Tutorials from "./pages/Tutorials/Tutorials.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Process from "./pages/AdminGame/ProcessPage/ProcessPage.tsx";
import ScanQR from "./pages/AdminGame/ScanQRCode/ScanQRCode.tsx";
import FirstTab from "./pages/AdminGame/FirstTab/FirstTab.tsx";
import { Scanning } from "./pages/AdminGame/ScanQRCode/ScanningQR.tsx";
import GameDetails from "./pages/GameDetails/GameDetails.tsx";
// import Scan from "./components/ScanFolder/ScanFile.tsx";
import AuthenticateFail from "./pages/AuthenticateFail/AuthenticateFail.tsx";
import PlayerView from "./pages/PlayerView/playerView.tsx";
//import { Leaderboards } from "./components/Gamelist/Gamelist.tsx";
import Leaderboards from "./pages/PlayerView/Leaderboards/Leaderboards.tsx";
import { StartingPage } from "./pages/MainPage/StartingPage.tsx";

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const serverUrl = import.meta.env.VITE_SERVER_URL;

// a React context to hold the logged-in and user states so they can be shared globally
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
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
          navigate("/MainPage");
        } catch (err) {
          console.error(err);
          navigate("/MainPage");
        }
      } else if (loggedIn === true) {
        navigate("/MainPage");
      }
    })();
  }, [checkLoginState, loggedIn, navigate]);
  return <></>;
};

const router = createBrowserRouter([
  {
    path: "/game/:gameId",
    element: <GameDetails />,
  },
  {
    path: "/",
    element: <StartingPage />,
  },
  {
    path: "/MainPage",
    element: <MainPage />,
  },
  {
    path: "/mygame/:gId",
    element: <AdminGame />,
    children: [
      {
        path: "",
        element: <FirstTab />,
      },
      {
        path: "process",
        element: <Process />,
      },
      {
        path: "ScanQRCode",
        element: <ScanQR />,
      },
      {
        path: "scanQr",
        element: <Scanning />,
      },
    ],
  },
  {
    path: "/playerview/:gameId",
    element: <PlayerView />,
    children: [
      {
        path: "leaderboards",
        element: <Leaderboards />,
      },
    ],
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
  {
    path: "/authfail",
    element: <AuthenticateFail />,
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
