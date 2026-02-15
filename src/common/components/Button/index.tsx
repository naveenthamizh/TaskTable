import React, {
  type ForwardedRef,
  forwardRef,
  type JSX,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";

import "./Button.css";
import { classNames } from "../../utils";
import { Spinner, SPINNER_SIZES } from "../Spinner";
import { IconChevronDown } from "../../icons/IconChevronDown";

export enum BUTTON_TYPES {
  PRIMARY = "primary",
  DEFAULT = "default",
  SUBTLE = "subtle",
  WARNING = "warning",
  SUCCESS = "success",
  DANGER = "danger",
  LINK = "link",
  SUBTLE_LINK = "subtleLink",
  SUBTLE_SECONDARY = "subtleSecondary",
  OUTLINE = "outline",
  KAI_PRIMARY = "kaiPrimary",
  KAI_SECONDARY = "kaiSecondary",
}

export const BUTTON_VARIANT = {
  NORMAL: "normal",
  SPLIT: "split",
};

export const BUTTON_SIZES = {
  MEDIUM: "medium",
  SMALL: "small",
};

export interface ButtonProps {
  id?: string;
  type?: BUTTON_TYPES;
  size?: string;
  variant?: string;
  children?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  splitActionIcon?: JSX.Element;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSplitAction?: () => void;
  className?: string;
}

// eslint-disable-next-line react/display-name
export const Button = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>): JSX.Element => {
    const {
      children,
      id,
      type = BUTTON_TYPES.DEFAULT,
      size = BUTTON_SIZES.MEDIUM,
      variant = BUTTON_VARIANT.NORMAL,
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      onClick,
      onSplitAction,
      splitActionIcon,
      className = "",
    } = props;

    const buttonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
      Object.keys(props).forEach((prop) => {
        if (/data-/.test(prop)) {
          if (buttonRef.current && props[prop as keyof typeof props]) {
            buttonRef.current.setAttribute(
              prop,
              props[prop as keyof typeof props] as string,
            );
          }
        }
      });
    }, [props]);

    return (
      <div className="kl-button-container" data-cy="button">
        <button
          data-cy="disablestate"
          id={id}
          className={classNames({
            [`kl-button kl-button-${type}`]: true,
            [`kl-button-${variant}`]: true,
            [`kl-button-${size}`]: true,
            "kl-button-fullWidth": fullWidth,
            "kl-button-icon-only": !!(leftIcon || rightIcon) && !children,
            [className]: Boolean(className),
          })}
          disabled={disabled}
          onClick={onClick}
        >
          {loading ? (
            <Spinner size={SPINNER_SIZES.TINY} />
          ) : (
            leftIcon && (
              <span className="kl-button-icon" data-cy="threedotmodel">
                {leftIcon}
              </span>
            )
          )}
          {children !== undefined && <span>{children}</span>}

          {rightIcon && <span className="kl-button-icon">{rightIcon}</span>}
        </button>
        {variant === BUTTON_VARIANT.SPLIT && (
          <button
            tabIndex={1}
            className={`${
              disabled
                ? `kl-button-${type}-split-disabled`
                : `kl-button-${type}-split`
            }`}
            onClick={onSplitAction}
          >
            <div className="kl-button-split-icon" data-cy="dialpadspliticon">
              {splitActionIcon ? (
                splitActionIcon
              ) : (
                <IconChevronDown size="20" />
              )}
            </div>
          </button>
        )}
      </div>
    );
  },
);
