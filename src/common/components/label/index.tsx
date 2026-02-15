import { type JSX } from "react";
import { classNames } from "../../utils";

import styles from "./label.module.css";

type TLabel = {
  icon?: JSX.Element;
  content: string;
  type?: string;
  variant?: string;
  size?: string;
};

export enum LABEL_VARIANTS {
  PRIMARY = "primary",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

export enum LABEL_TYPES {
  DEFAULT = "default",
  ROUNDED = "rounded",
}

export const Label = (props: TLabel): JSX.Element => {
  const { icon, content, type = LABEL_TYPES.DEFAULT, variant } = props;
  return (
    <div
      className={classNames({
        [styles.label_container]: true,
        [styles[`label_${variant}`]]: true,
        [styles[`label_${type}`]]: true,
      })}
    >
      {icon && icon}
      <div>{content}</div>
    </div>
  );
};
