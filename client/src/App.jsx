import { useEffect, useState } from "react";
import "./App.css";
import AppSidebar from "./AppSidebar";
import Navbar from "./components/AppBar";
import ResposniveSidebar from "./ResponsiveSidebar";
import Routing from "./Routing";
import Login from "./pages/login/Login";

function App() {
  const [isCollapse, setIsCollapse] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // If token exists, user is authenticated
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <div className="flex">
          <div className="large-screens">
            <AppSidebar isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
          </div>
          <div className="small-screens small-screen-nav-width">
            <ResposniveSidebar
              isCollapse={isCollapse}
              setIsCollapse={setIsCollapse}
            />
          </div>
          <div
            className={`${!isCollapse ? `nav-width` : "nav-width-collapse"}`}
          >
            <Navbar isCollapse={isCollapse} setIsCollapse={setIsCollapse} />

            <Routing />
          </div>
        </div>
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}

export default App;
