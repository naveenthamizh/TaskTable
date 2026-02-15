import React, { useEffect, useState, type JSX } from "react";

import { classNames } from "../../utils";

import "./TextAreaInput.css";

export const TEXT_AREA_INPUT_TYPES = {
  DEFAULT: "default",
  PASSWORD: "password",
  WARNING: "warning",
};

export type TextAreaInputProps = {
  label?: string;
  value?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (value: string, e: React.FocusEvent<HTMLTextAreaElement>) => void;
  fullWidth?: boolean;
  minHeight?: string;
  readOnly?: boolean;
  maxLength?: number;
  placeholder?: string;
  canResize?: boolean;
  classname?: string;
  labelIcon?: React.ReactNode;
  tabIndex?: number;
  disabled?: boolean;
  disabledOnlyInput?: boolean;
  type?: string;
  autoFocus?: boolean;
  borderWhenHover?: boolean;
};

export function TextAreaInput(props: TextAreaInputProps): JSX.Element {
  const {
    label,
    value = "",
    helpText,
    error,
    required,
    onChange,
    onBlur,
    onFocus,
    fullWidth = false,
    minHeight,
    readOnly = false,
    maxLength,
    placeholder,
    canResize = false,
    classname = "",
    labelIcon,
    tabIndex = 0,
    disabled = false,
    disabledOnlyInput = false,
    type = TEXT_AREA_INPUT_TYPES.DEFAULT,
    autoFocus = false,
    borderWhenHover = false,
  } = props;

  const [textValue, setTextValue] = useState<string>();

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleTextChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = evt.target.value;
    setTextValue(value);
    onChange && onChange(value, evt);
  };

  const handleTextBlur = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    onBlur && onBlur(evt.target.value, evt);
  };

  const handleTextFocus = (evt: React.FocusEvent<HTMLTextAreaElement>) => {
    onFocus && onFocus(evt.target.value, evt);
  };

  return (
    <div
      className={classNames({
        "kl-text-area-input-container": true,
        "kl-text-area-full-width": fullWidth,
        "kl-text-area-input-container-disabled": disabled,
      })}
      data-cy="textarea"
    >
      {label && (
        <div className="kl-text-area-input-label-wrapper">
          <div
            className="kl-text-area-input-label"
            onClick={(event) => event.stopPropagation()}
          >
            {label}
            {required && (
              <span className="kl-text-area-input-required"> *</span>
            )}
          </div>
          {labelIcon && <div>{labelIcon}</div>}
        </div>
      )}
      <textarea
        className={classNames({
          "kl-text-area-input": true,
          "kl-text-area-input-error-border": Boolean(error),
          [classname]: Boolean(classname),
          "kl-text-area-input-disabled": disabledOnlyInput,
          "kl-text-area-input-warning":
            type === TEXT_AREA_INPUT_TYPES.WARNING && !textValue?.length,
          "kl-text-area-input-border-when-hover": borderWhenHover,
        })}
        value={textValue}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        onFocus={handleTextFocus}
        style={{ minHeight: minHeight, resize: canResize ? "both" : "none" }}
        readOnly={readOnly}
        maxLength={maxLength}
        data-cy="inputtextbox"
        placeholder={placeholder ? placeholder : ""}
        tabIndex={tabIndex}
        disabled={disabled || disabledOnlyInput}
        autoFocus={autoFocus}
      >
        {textValue}
      </textarea>
      <div className="kl-text-area-input-bottom" data-cy="bottomtext">
        {error && <div className="kl-text-area-input-error">{error}</div>}
        {helpText && (
          <div className="kl-text-area-input-help-text">{helpText}</div>
        )}
      </div>
    </div>
  );
}
