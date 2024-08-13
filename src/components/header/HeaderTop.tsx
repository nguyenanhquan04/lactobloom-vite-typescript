import React from "react";
import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";
import { useCurrency } from "../../store/contexts/currency-context";

interface HeaderTopProps {
  borderStyle: string;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ borderStyle }) => {
  const {currencyState} = useCurrency();
  const currency = currencyState;
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
