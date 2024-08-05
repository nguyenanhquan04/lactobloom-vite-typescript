import PropTypes from "prop-types";
import clsx from "clsx";
import React from "react";

interface Data {
  title: string;
  text: string;
};

interface TextGridOneSingleProps {
  data: Data;
  spaceBottomClass: String;
};

const TextGridOneSingle: React.FC<TextGridOneSingleProps> = ({ data, spaceBottomClass }) => {
  return (
      <div className={clsx("single-mission", spaceBottomClass)}>
        <h3>{data.title}</h3>
        <p>{data.text}</p>
      </div>
  );
};

export default TextGridOneSingle;
