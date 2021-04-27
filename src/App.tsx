import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";

const contextClass: any = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-purple-500",
  warning: "bg-yellow-500",
  default: "bg-indigo-500",
  dark: "bg-white-500 font-gray-300",
};

function App() {
  return (
    <Router>
      <ToastContainer
        toastClassName={({ type }: any) =>
          contextClass[type || "default"] +
          " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-opacity-50"
        }
        bodyClassName={() =>
          "text-sm font-white font-med block p-3 overflow-y-hidden"
        }
      />
      <div className="stars" />
      <div className="twinkling" />
      {/*<Navbar hasEarth={false}/>*/}
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
