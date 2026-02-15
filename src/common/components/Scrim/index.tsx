import type { JSX } from "react";
import "./Scrim.css";

export type ScrimProps = {
  onClick?: () => void;
  zIndex?: number;
  className?: string;
};

export function Scrim(props: ScrimProps): JSX.Element {
  const { onClick, zIndex = 1301, className } = props;
  const handleClick = () => {
    onClick && onClick();
  };
  return (
    <div
      className={`kl-scrim ${className}`}
      style={{ zIndex }}
      onClick={handleClick}
    />
  );
}
