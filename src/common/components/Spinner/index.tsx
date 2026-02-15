import { type JSX } from "react";

import "./Spinner.css";

export enum SPINNER_SIZES {
  MINI = "mini",
  TINY = "tiny",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum SPINNER_TYPE {
  PRIMARY = "primary",
  DARK_BOLD = "darkbold",
}

export type SpinnerProps = {
  size: SPINNER_SIZES;
  type?: SPINNER_TYPE;
};

export function Spinner(props: SpinnerProps): JSX.Element {
  const { size, type = SPINNER_TYPE.PRIMARY } = props;

  return (
    <div className={`kl-spinner-container kl-spinner-${size}`}>
      <div className={`kl-spinner kl-spinner-${type}`}></div>
    </div>
  );
}
