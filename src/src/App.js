import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

import Auth from "./components/auth/auth";
import Home from "./components/content/home/home";
import Footer from "./components/footer/footer";
import SideBar from "./components/sidebar/sidebar";

import "./App.css";
import { useSelector } from "react-redux";
import { GetUser } from "./store/selectors/auth";

const App = () => {
  const user = useSelector(GetUser);

  return (
    <BrowserRouter>
      <div className="App">
        {user ? (
          <>
            <SideBar />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/sample">
                <div />
              </Route>
            </Switch>
          </>
        ) : (
          <Auth />
        )}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
