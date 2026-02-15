import React, {
  type ForwardedRef,
  forwardRef,
  type JSX,
  memo,
  useEffect,
  useState,
} from "react";

import "./TextInput.css";
import { classNames } from "../../utils";

export const TEXT_INPUT_TYPES = {
  DEFAULT: "text",
  PASSWORD: "password",
  WARNING: "warning",
};

export enum TEXT_INPUT_LABEL_PLACEMENTS {
  LEFT = "left",
  RIGHT = "right",
}

export type TextInputProps = {
  type?: string;
  isTextHidden?: boolean;
  label?: string | JSX.Element;
  value?: string;
  placeholder?: string;
  helpText?: string;
  hasError?: boolean;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  leftIconClass?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (value: string, e: React.FocusEvent<HTMLInputElement>) => void;
  onRightIconClick?: () => void;
  onLeftIconClick?: () => void;
  onKeyDown?: (code: string, text: string) => void;
  maxLength?: number;
  labelIcon?: React.ReactNode;
  labelIconPlacement?: TEXT_INPUT_LABEL_PLACEMENTS;
  tabIndex?: number;
  disabledOnlyInput?: boolean;
  borderWhenHover?: boolean;
  classname?: string;
  fixedHeight?: string;
  removeSpecialCharacters?: boolean;
};

const TextInputComponent = forwardRef(
  (props: TextInputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
    const {
      isTextHidden = false,
      label,
      value = "",
      placeholder,
      helpText,
      hasError = false,
      error,
      required,
      fullWidth = false,
      readOnly = false,
      disabled = false,
      leftIconClass,
      leftIcon,
      rightIcon,
      onClick,
      onChange,
      onBlur,
      onFocus,
      onRightIconClick,
      onLeftIconClick,
      onKeyDown = () => {},
      maxLength,
      labelIcon,
      labelIconPlacement = TEXT_INPUT_LABEL_PLACEMENTS.LEFT,
      tabIndex = 2,
      disabledOnlyInput = false,
      type = TEXT_INPUT_TYPES.DEFAULT,
      borderWhenHover = false,
      classname = "",
      fixedHeight,
      removeSpecialCharacters = false,
    } = props;

    const [textValue, setTextValue] = useState<string>("");

    useEffect(() => {
      value === undefined || value === null
        ? setTextValue("")
        : setTextValue(value);
    }, [value]);

    const handleTextClick = (evt: React.MouseEvent<HTMLInputElement>) => {
      onClick && onClick(evt);
    };

    const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
      const validInput = /^[a-zA-Z0-9 ]*$/.test(value);

      if (removeSpecialCharacters) {
        if (validInput) {
          setTextValue(value);
          onChange && onChange(value, evt);
        }
      } else {
        setTextValue(value);
        onChange && onChange(value, evt);
      }
    };

    const handleTextBlur = (evt: React.ChangeEvent<HTMLInputElement>) => {
      onBlur && onBlur(evt.target.value, evt);
    };

    const handleTextFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
      onFocus && onFocus(evt.target.value, evt);
    };

    const handleLeftIconClick = (evt: React.MouseEvent<HTMLDivElement>) => {
      if (onLeftIconClick) {
        evt.stopPropagation();
        onLeftIconClick();
      }
    };

    const handleRightIconClick = (evt: React.MouseEvent<HTMLDivElement>) => {
      if (onRightIconClick) {
        evt.stopPropagation();
        onRightIconClick();
      }
    };

    return (
      <div
        className={
          disabled
            ? "kl-text-input-container-disabled"
            : "kl-text-input-container"
        }
        data-cy="passwordcontainer"
        style={{ width: fullWidth ? "100%" : "" }}
      >
        {label && (
          <div
            className={classNames({
              "kl-text-input-label-wrapper": true,
              "kl-text-input-label-icon-wrapper": Boolean(labelIcon),
              [`kl-text-input-label-icon-${labelIconPlacement}`]:
                Boolean(labelIconPlacement),
            })}
            data-cy="label-wrapper"
          >
            <div
              className={classNames({
                "kl-text-input-label": true,
                "kl-text-icon-input-label": Boolean(labelIcon),
              })}
              onClick={(event) => event.stopPropagation()}
              data-cy="inputlabel"
            >
              {label}
              {required && <span className="kl-text-input-required"> *</span>}
            </div>
            {labelIcon && <div>{labelIcon}</div>}
          </div>
        )}
        <div
          className={classNames({
            "kl-text-input-wrapper": true,
            "kl-text-input-error": Boolean(hasError) || Boolean(error),
            "kl-text-input-disabled": disabledOnlyInput,
            "kl-text-input-warning":
              type === TEXT_INPUT_TYPES.WARNING && !textValue.length,
            "kl-text-input-border-when-hover": borderWhenHover,
          })}
          style={{ height: fixedHeight ? fixedHeight : "" }}
          data-cy="selectedfield"
          data-testid="selectedField"
        >
          {leftIcon && (
            <div
              className={
                leftIconClass ? leftIconClass : "kl-text-input-left-icon"
              }
              onClick={handleLeftIconClick}
            >
              {leftIcon}
            </div>
          )}
          <input
            type={
              isTextHidden
                ? TEXT_INPUT_TYPES.PASSWORD
                : TEXT_INPUT_TYPES.DEFAULT
            }
            data-cy="textInput"
            data-testid="textInput"
            className={classNames({
              "kl-text-input": true,
              "kl-text-input-warning":
                type === TEXT_INPUT_TYPES.WARNING && !textValue.length,
              [classname]: Boolean(classname),
            })}
            value={textValue}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onFocus={handleTextFocus}
            placeholder={placeholder}
            onClick={handleTextClick}
            tabIndex={tabIndex}
            readOnly={readOnly}
            disabled={disabled || disabledOnlyInput}
            onKeyDown={(evt) => {
              onKeyDown(evt.key, textValue);
            }}
            ref={ref}
            maxLength={maxLength}
          />
          {rightIcon && (
            <div
              className="kl-text-input-right-icon"
              onClick={handleRightIconClick}
              data-cy="eye-icon"
              data-testid="inputRightIcon"
            >
              {rightIcon}
            </div>
          )}
        </div>
        <div className="kl-text-input-bottom">
          {error && (
            <div className="kl-text-input-error" data-cy="errortext">
              {error}
            </div>
          )}
          {helpText && (
            <div className="kl-text-input-help-text">{helpText}</div>
          )}
        </div>
      </div>
    );
  },
);

export const TextInput = memo(TextInputComponent);
