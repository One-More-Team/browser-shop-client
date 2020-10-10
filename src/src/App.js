/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

import Auth from "./components/auth/auth";
import Home from "./components/content/home/home";
import Footer from "./components/footer/footer";
import SideBar from "./components/sidebar/sidebar";
import Chat from "./components/chat/chat";

import "./App.css";
import { useSelector } from "react-redux";
import { GetUser } from "./store/selectors/auth";
import BrowserShop from "./components/content/browser-shop/browser-shop";
import { GetBrowserShopState } from "./store/selectors/common";
import { browserShopState } from "./enums/enums";
import Account from "./components/content/account/account";

const App = () => {
  const user = useSelector(GetUser);
  const _browserShopState = useSelector(GetBrowserShopState);

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
              <Route path="/account">
                <Account />
              </Route>
            </Switch>
            <BrowserShop />
            {_browserShopState === browserShopState.READY && <Chat />}
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
