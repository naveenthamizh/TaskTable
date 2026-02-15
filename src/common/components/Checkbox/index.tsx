import React, { useEffect, useRef, useState, type JSX } from "react";

import "./Checkbox.css";

export const CHECKBOX_SIZES = {
  SMALL: "small",
  DEFAULT: "default",
};

const checkboxStates = {
  checked: 1,
  notChecked: 0,
  indeterminate: -1,
};

export type CheckboxProps = {
  children?: string | JSX.Element;
  disabled?: boolean;
  checked?: boolean;
  hasError?: boolean;
  indeterminate?: boolean;
  size?: string;
  onChange?: (
    isSelected: boolean,
    e: React.MouseEvent<HTMLInputElement>,
  ) => void;
};

function CheckboxComponent(props: CheckboxProps): JSX.Element {
  const {
    children,
    disabled,
    checked,
    hasError,
    indeterminate,
    size = CHECKBOX_SIZES.DEFAULT,
    onChange,
  } = props;

  const checkboxRef = useRef<HTMLInputElement>(null);

  const [checkedStatus, setCheckedStatus] = useState<number>(0);

  useEffect(() => {
    if (indeterminate) {
      setCheckedStatus(checkboxStates.indeterminate);
    } else if (checked) {
      setCheckedStatus(checkboxStates.checked);
    } else {
      setCheckedStatus(checkboxStates.notChecked);
    }
  }, [checked, indeterminate]);

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!disabled) {
      checkboxRef.current && checkboxRef.current.focus();
      //   if (checkedStatus !== checkboxStates.indeterminate) {
      const isCurrentChecked = checkedStatus === checkboxStates.checked;
      const currentcheckedStatus = isCurrentChecked
        ? checkboxStates.notChecked
        : checkboxStates.checked;
      setCheckedStatus(currentcheckedStatus);

      setCheckedStatus(currentcheckedStatus);
      onChange && onChange(!isCurrentChecked, e);
      //   }
    }
  };

  const getCheckboxClasses = () => {
    const defaultClass = `kl-checkbox kl-checkbox-${size}`;
    let checkboxClasses = defaultClass;
    if (checkedStatus === checkboxStates.indeterminate) {
      checkboxClasses += " kl-checkbox-indeterminate";
    }
    if (hasError) {
      checkboxClasses += " kl-checkbox-error";
    }
    return checkboxClasses;
  };

  return (
    <div
      className={`kl-checkbox-container ${
        disabled ? "kl-checkbox-disabled" : ""
      }`}
      onClick={handleClick}
      data-cy="kl-checkbox-container "
    >
      <div className={`kl-checkbox-wrapper`}>
        <div className={`kl-checkbox-${size}`}>
          <input
            type="checkbox"
            id="kl-checkbox"
            className={getCheckboxClasses()}
            checked={checkedStatus === checkboxStates.checked}
            ref={checkboxRef}
            disabled={disabled}
            onChange={() => {
              // Added the empty callback to avoid the console error
            }}
          />
        </div>
        {checkedStatus === checkboxStates.checked && (
          <div className={`kl-checkbox-${size}-tick`} />
        )}
        {checkedStatus === checkboxStates.indeterminate && (
          <div className={`kl-checkbox-${size}-dash`} />
        )}
      </div>
      {children && <div className="kl-checkbox-label">{children}</div>}
    </div>
  );
}

export const Checkbox = React.memo(CheckboxComponent);
