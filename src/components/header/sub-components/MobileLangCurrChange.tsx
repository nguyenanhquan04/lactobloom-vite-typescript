import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCurrency } from "../../../store/slices/currency-slice"
import React from "react";

const MobileLangCurrChange = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const currency = useSelector((state: any) => state.currency);

  const changeLanguageTrigger = e => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
    closeMobileMenu();
  };

  const setCurrencyTrigger = e => {
    const currencyName = e.target.value;
    dispatch(setCurrency(currencyName));
    closeMobileMenu();
  };

  const closeMobileMenu = () => {
    const offcanvasMobileMenu: any = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.remove("active");
  };

  return (
    <div className="mobile-menu-middle">
      <div className="lang-curr-style">
        <span className="title mb-2">Choose Language </span>
        <select
          value={i18n.resolvedLanguage}
          onChange={changeLanguageTrigger}
        >
          <option value="en">English</option>
          <option value="vn">Việt Nam</option>
        </select>
      </div>
      <div className="lang-curr-style">
        <span className="title mb-2">Choose Currency</span>
        <select
          value={currency.currencyName}
          onChange={setCurrencyTrigger}
        >
          <option value="USD">USD</option>
          <option value="VND">VND</option>
        </select>
      </div>
    </div>
  );
};

export default MobileLangCurrChange;
