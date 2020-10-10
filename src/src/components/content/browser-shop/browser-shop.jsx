import React from "react";
import { useSelector } from "react-redux";
import { browserShopState } from "../../../enums/enums";

import { GetBrowserShopState } from "../../../store/selectors/common";

import style from "./browser-shop.module.scss";

const BrowserShop = () => {
  const _browserShopState = useSelector(GetBrowserShopState);
  return (
    <>
      <canvas id="browser-shop-canvas" className={style.Canvas}></canvas>
      <div
        id="blocker"
        className={`${style.Blocker} ${
          _browserShopState !== browserShopState.READY && style.Inactive
        }`}
      >
        <div id="instructions" className={style.Instructions}>
          <div className={style.PlayLabel}>
            <i className="fas fa-gamepad"></i> Click to start
          </div>
          <div className={style.Controls}>
            <div className={style.Control}>
              <div className={style.ControlLabel}>Move</div>
              <div className={style.Button}>W</div>
              <div className={style.Button}>A</div>
              <div className={style.Button}>S</div>
              <div className={style.Button}>D</div>
            </div>
            <div className={style.Control}>
              <div className={style.ControlLabel}>Jump</div>
              <div className={style.LongButton}>SPACE</div>
            </div>
            <div className={style.Control}>
              <div className={style.ControlLabel}>Look</div>
              <i className={`fas fa-mouse ${style.Mouse}`}></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowserShop;
