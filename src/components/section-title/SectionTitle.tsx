import clsx from "clsx";
import React from "react";

interface SectionTitleProps {
  borderClass?: string;
  positionClass?: string;
  spaceClass?: string;
  subtitleText?: string;
  subtitleColorClass?: string;
  titleText?: string;
};

const SectionTitle: React.FC<SectionTitleProps> = ({
  titleText,
  subtitleText,
  subtitleColorClass,
  positionClass,
  spaceClass,
  borderClass
}) => {
  return (
    <div className={clsx("section-title", positionClass, spaceClass, borderClass)}>
      <h2>{titleText}</h2>
      <p className={clsx(subtitleColorClass)}>
        {subtitleText}
      </p>
    </div>
  );
};

export default SectionTitle;
