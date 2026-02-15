import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
} from "react";

import { Dropdown, type DropdownProps } from "../Dropdown";
import { TextInput } from "../TextInput";

import "./SingleSelect.css";
import { IconClose } from "../../icons/IconClose";
import { IconCaretDown } from "../../icons/IconCaretDown";

export interface SingleSelectProps extends DropdownProps {
  label?: string | JSX.Element;
  helpText?: string;
  error?: string | JSX.Element;
  required?: boolean;
  onChange?: (option?: any) => void;
  onSearch?: (searchText: string) => void;
  onRemove?: (removedOption: string) => void;
  fullWidth?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  tabIndex?: number;
  labelIcon?: React.ReactNode;
  disabledOnlyInput?: boolean;
}

function SingleSelectComponent(props: SingleSelectProps): JSX.Element {
  const {
    options,
    label,
    placeholder,
    helpText,
    error,
    required,
    onClick,
    onChange,
    onSelect,
    onSearch,
    onRemove,
    onInlineSearch,
    onClose,
    value,
    displayKey,
    fullWidth,
    allowClear = false,
    disabled = false,
    leftIcon,
    footerAction,
    tabIndex,
    labelIcon,
    disabledOnlyInput = false,
    ...restProps
  } = props;

  const [selectedOption, setSelectedOption] = useState<any>();
  const [selectedOptionText, setSelectedOptionText] = useState<string>("");
  const [transformedOptions, setTransformedOptions] = useState<Array<any>>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  useEffect(() => {
    const selectedText =
      selectedOption && displayKey
        ? selectedOption[displayKey]
        : selectedOption;
    setSelectedOptionText(selectedText);
  }, [displayKey, selectedOption]);

  useEffect(() => {
    if (typeof options[0] !== "object") {
      const optionList: Array<string> = [];
      options.forEach((option) => optionList.push(option.toString()));
      setTransformedOptions(optionList);
    } else {
      value && setSelectedOption(value);
      setTransformedOptions([...options]);
    }
  }, [options, setTransformedOptions, value]);

  const handleSelect = useCallback(
    (option: any) => {
      if (typeof option !== "object") {
        setSelectedOption(option.toString());
      } else {
        setSelectedOption(option);
      }
      onSelect && onSelect(option);
      onChange && onChange(option);
    },
    [onChange, onSelect],
  );

  const handleRemove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!disabled) {
      setSelectedOption(undefined);
      setSelectedOptionText("");
      onRemove && onRemove(selectedOption);
      onChange && onChange();
    }
  };

  const handleToggle = () => {
    !isOpen ? selectInputRef.current?.focus() : selectInputRef.current?.blur();
    setIsOpen((prevState) => !prevState);
    onClick && onClick();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose && onClose();
  };

  const handleSearch = useCallback(
    (searchText: string) => {
      !isOpen && setIsOpen(true);
      setSelectedOptionText(searchText);
      onSearch && onSearch(searchText);
    },
    [isOpen, onSearch],
  );

  const onBlur = useCallback(() => {
    // To revert searched text to the selection option
    if (selectedOption && displayKey) {
      setSelectedOptionText(selectedOption[displayKey]);
    } else {
      setSelectedOptionText(selectedOption);
    }
  }, [displayKey, selectedOption]);

  return (
    <div
      className={`kl-select-container`}
      style={{ width: fullWidth ? "100%" : "320px" }}
    >
      <Dropdown
        {...restProps}
        open={isOpen}
        options={transformedOptions}
        value={selectedOption}
        displayKey={displayKey}
        onClick={handleToggle}
        onSelect={handleSelect}
        onClose={handleClose}
        disabled={disabled}
        targetFullWidth={fullWidth}
        footerAction={footerAction}
      >
        <TextInput
          ref={selectInputRef}
          fullWidth={fullWidth}
          label={label}
          value={selectedOptionText}
          readOnly={!onSearch}
          onChange={handleSearch}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          leftIcon={leftIcon}
          labelIcon={labelIcon}
          tabIndex={tabIndex}
          disabledOnlyInput={disabledOnlyInput}
          hasError={Boolean(error)}
          rightIcon={
            <div className="kl-select-right-icon-container">
              {allowClear &&
                (selectedOption && displayKey
                  ? selectedOption[displayKey]
                  : selectedOption) && (
                  <div className="kl-select-remove" onClick={handleRemove}>
                    <IconClose size="16" />
                  </div>
                )}
              <IconCaretDown size="16" />
            </div>
          }
        />
      </Dropdown>
      <div className="kl-dropdown-input-bottom">
        {error && typeof error === "string" && (
          <div className="kl-text-input-error">{error}</div>
        )}
        {error && React.isValidElement(error) && error.type && <>{error}</>}
        {helpText && <div className="kl-text-input-help-text">{helpText}</div>}
      </div>
    </div>
  );
}

export const SingleSelect = memo(SingleSelectComponent);
