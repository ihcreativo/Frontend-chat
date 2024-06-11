import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from "./components/Chat";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom"

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "chat", element: <Chat /> },
  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;