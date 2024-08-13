import React from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../store/contexts/currency-context";

interface LanguageCurrencyChangerProps {
  currency: {
    currencyName: string;
  }
}

const LanguageCurrencyChanger: React.FC<LanguageCurrencyChangerProps> = ({ currency }) => {
  const {setCurrency} = useCurrency();
  const { i18n } = useTranslation();
  const changeLanguageTrigger = (e: any) => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
  };

  const setCurrencyTrigger = (e: any) => {
    const currencyName = e.target.value;
    setCurrency(currencyName);
  };

  return (
    <div className="language-currency-wrap">
      <div className="same-language-currency language-style">
        <span>
          {i18n.resolvedLanguage === "en"
            ? "English"
            : i18n.resolvedLanguage === "vn"
            ? "Việt Nam"
            : ""}{" "}
          <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="en" onClick={e => changeLanguageTrigger(e)}>
                English
              </button>
            </li>
            <li>
              <button value="vn" onClick={e => changeLanguageTrigger(e)}>
                Việt Nam
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency use-style">
        <span>
          {currency.currencyName} <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="VND" onClick={e => setCurrencyTrigger(e)}>
                VND
              </button>
            </li>
            <li>
              <button value="USD" onClick={e => setCurrencyTrigger(e)}>
                USD
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};


export default LanguageCurrencyChanger;
