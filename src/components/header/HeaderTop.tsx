import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";

interface HeaderTopProps {
  borderStyle: string;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ borderStyle }) => {
  const currency = useSelector((state: any) => state.currency);
  return (
    <div className={clsx("header-top-wap", borderStyle === "fluid-border" && "border-bottom")}>
      <LanguageCurrencyChanger currency={currency} />
      <div className="header-offer">
        <p>
          Free delivery on order over{" "}
          <span>
            {currency.currencySymbol + (200 * 1).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default HeaderTop;
