import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from "./components/Chat";
import ChatRoom from "./components/ChatRoom";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom"

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "chat", element: <Chat /> },
    { path: "chatRoom", element: <ChatRoom /> },
    // ...
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