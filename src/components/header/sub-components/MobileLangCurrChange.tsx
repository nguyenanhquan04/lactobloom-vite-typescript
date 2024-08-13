import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../store/contexts/currency-context";

const MobileLangCurrChange = () => {
  const {currencyState, setCurrency} = useCurrency();
  const { i18n } = useTranslation();
  const currency = currencyState;

  const changeLanguageTrigger = (e: any) => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
    closeMobileMenu();
  };

  const setCurrencyTrigger = (e: any) => {
    const currencyName = e.target.value;
    setCurrency(currencyName);
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
