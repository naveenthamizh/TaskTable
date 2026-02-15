import React, {
  useEffect,
  useState,
  useRef,
  memo,
  useCallback,
  type JSX,
} from "react";

import "./Dropdown.css";
import { classNames } from "../../utils";
import { Checkbox } from "../Checkbox";
import { TextInput } from "../TextInput";
import {
  DROPDOWN_PLACEMENTS,
  useDropdownPlacement,
} from "../../hooks/useDropdownPlacement";

export const DROPDOWN_TRIGGERS = {
  CLICK: "click",
  HOVER: "hover",
};

export type DropdownProps = {
  isMulti?: boolean;
  disabled?: boolean;
  placement?: string;
  trigger?: string;
  open?: boolean;
  value?: any;
  targetFullWidth?: boolean;
  targetFullHeight?: boolean;
  minWidth?: string;
  xOffset?: number;
  yOffset?: number;
  xGap?: number;
  yGap?: number;
  options: Array<any>;
  optionComponent?: (option: any) => React.ReactElement;
  optionsRenderer?: (options: Array<any>) => React.ReactElement;
  optionsRendererHeight?: number;
  optionsDisable?: Array<any>;
  children?: React.ReactNode;
  onClick?: (evt?: React.MouseEvent<HTMLDivElement>) => void;
  onClose?: () => void;
  onInlineSearch?: (searchKey: string) => void;
  inlineSearchLeftIcon?: React.ReactElement;
  inlineSearchPlaceHolder?: string;
  hasSelectCheckbox?: boolean;
  hasSelectAllCheckbox?: boolean;
  hasGroupByHeader?: boolean;
  onSelect?: (selectedOption: any) => void;
  uniqueKey?: string;
  displayKey?: string;
  groupByKey?: string;
  footerAction?: string;
  onFooterAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  footerDisable?: boolean;
  canCreateTag?: boolean;
  tagValue?: string;
  handleCreateTag?: (searchKey: any) => void;
  allowFocusSelectedValue?: boolean;
};

function DropdownComponent(props: DropdownProps): JSX.Element | null {
  const {
    isMulti,
    disabled = false,
    placement = DROPDOWN_PLACEMENTS.BOTTOM,
    trigger = DROPDOWN_TRIGGERS.CLICK,
    open = false,
    value,
    children,
    targetFullWidth = false,
    targetFullHeight = false,
    minWidth = "240px",
    xOffset = 0,
    yOffset = 0,
    xGap = 0,
    yGap = 8,
    options,
    optionComponent,
    optionsRenderer,
    optionsDisable,
    onClick,
    onClose,
    onInlineSearch,
    inlineSearchLeftIcon,
    inlineSearchPlaceHolder,
    hasSelectCheckbox = false,
    hasSelectAllCheckbox = false,
    hasGroupByHeader = true,
    onSelect,
    uniqueKey,
    displayKey,
    groupByKey,
    footerAction,
    onFooterAction,
    footerDisable = false,
    canCreateTag = false,
    tagValue,
    handleCreateTag,
    allowFocusSelectedValue = false,
  } = props;

  const dropdownTargetRef = useRef<HTMLDivElement>(null);
  const dropdownOptionsRef = useRef<HTMLDivElement>(null);
  const dropdownOptionsContainerRef = useRef<HTMLDivElement>(null);
  const selectedOptionsRef = useRef<Array<string>>([]);
  const groupByKeysRef = useRef<Record<string, Array<any>>>({});
  const optionsScrollRef = useRef<HTMLDivElement>(null);
  const optionsScrollContainerRef = useRef<HTMLDivElement>(null);

  const [currentOptions, setCurrentOptions] = useState<Array<any>>();
  const [selectedOptions, setSelectedOptions] = useState<Array<string>>([]);
  const [disabledOptions, setDisabledOptions] = useState<Array<string>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // isLoading is set to false only when the currentOptions are calculated and set.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleOutsideScroll = useCallback(
    (evt: WheelEvent) => {
      evt.stopPropagation();
      if (isOpen && !dropdownOptionsRef.current?.contains(evt.target as Node)) {
        onClose && onClose();
        setIsOpen(false);
        setIsLoading(true);
      }
    },
    [isOpen, onClose],
  );

  const handleOutsideClick = useCallback(
    (evt: Event) => {
      if (
        isOpen &&
        !dropdownOptionsRef.current?.contains(evt.target as Node) &&
        !dropdownTargetRef.current?.contains(evt.target as Node)
      ) {
        onClose && onClose();
        setIsOpen(false);
        setIsLoading(true);
      }
    },
    [isOpen, onClose],
  );

  const handleWindowResize = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      setIsLoading(true);
    }
  }, [isOpen]);

  const [dropdownPosition] = useDropdownPlacement(
    {
      width: minWidth,
      placement,
      xOffset,
      yOffset,
      xGap,
      yGap,
      targetRef: dropdownTargetRef,
      dropdownRef: dropdownOptionsRef,
      wheelEventCallback: handleOutsideScroll,
      resizeEventCallback: handleWindowResize,
    },
    isOpen,
    [currentOptions],
  );

  useEffect(() => {
    if (!disabled) {
      setIsOpen(open);
    }
  }, [disabled, open]);

  useEffect(() => {
    // Do not want to run useEffect before opening dropdown.
    if (isOpen) {
      if (isMulti && value) {
        selectedOptionsRef.current = [...value];
      } else {
        selectedOptionsRef.current = [];
      }
    }
  }, [isMulti, isOpen, value]);

  useEffect(() => {
    if (isOpen) {
      if (groupByKey && uniqueKey && options.length > 0) {
        groupByKeysRef.current = {};
        options.forEach((option) => {
          const groupKey = option[groupByKey];
          if (!groupByKeysRef.current[groupKey]) {
            groupByKeysRef.current[groupKey] = [option];
          } else if (
            !groupByKeysRef.current[groupKey].find(
              (groupOption) => groupOption[uniqueKey] === option[uniqueKey],
            )
          ) {
            groupByKeysRef.current[groupKey].push(option);
          }
        });
      } else {
        groupByKeysRef.current = {};
      }
      setCurrentOptions([...options]);
      setIsLoading(false);
    }
  }, [groupByKey, isOpen, options, uniqueKey]);

  useEffect(() => {
    if (isOpen) {
      if (value) {
        if (isMulti) {
          const currentSelectedOptions: Array<string> = [];
          value.forEach((item: any) => {
            if (typeof item !== "object") {
              currentSelectedOptions.push(item);
            } else {
              uniqueKey &&
                item[uniqueKey] &&
                currentSelectedOptions.push(item[uniqueKey]);
            }
          });
          setSelectedOptions(currentSelectedOptions);
        } else {
          if (typeof value !== "object") {
            setSelectedOptions([value]);
          } else {
            uniqueKey &&
              value[uniqueKey] &&
              setSelectedOptions([value[uniqueKey]]);
          }
        }
      } else {
        setSelectedOptions([]);
      }
      if (optionsDisable && optionsDisable.length > 0) {
        if (typeof optionsDisable[0] !== "object") {
          setDisabledOptions([...optionsDisable]);
        } else if (uniqueKey) {
          const transformedDisableOptions = optionsDisable.map(
            (disableOption) => {
              return disableOption[uniqueKey];
            },
          );
          setDisabledOptions([...transformedDisableOptions]);
        }
      } else if (optionsDisable && optionsDisable?.length === 0) {
        setDisabledOptions([]);
      }
    }
  }, [optionsDisable, displayKey, isMulti, isOpen, uniqueKey, value]);

  useEffect(() => {
    if (trigger === DROPDOWN_TRIGGERS.CLICK) {
      window.addEventListener("click", handleOutsideClick);
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [handleOutsideClick, trigger]);

  const handleMouseEnter = (e: MouseEvent) => {
    setIsOpen(true);
  };

  const addTagEvent = useCallback(
    (event: any) => {
      if (
        event.key === "Enter" &&
        canCreateTag &&
        tagValue &&
        tagValue?.length > 0
      ) {
        event.preventDefault();
        handleCreateTag && handleCreateTag(tagValue);
      }
    },
    [canCreateTag, handleCreateTag, tagValue],
  );

  useEffect(() => {
    if (trigger === DROPDOWN_TRIGGERS.HOVER) {
      dropdownOptionsContainerRef.current?.addEventListener(
        "mouseenter",
        handleMouseEnter,
      );
    }
    return () => {
      dropdownOptionsContainerRef.current?.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );
    };
  }, [trigger]);

  useEffect(() => {
    if (canCreateTag) {
      dropdownOptionsContainerRef.current?.addEventListener(
        "keydown",
        addTagEvent,
      );
    }
    return () => {
      dropdownOptionsContainerRef.current?.removeEventListener(
        "keydown",
        addTagEvent,
      );
    };
  }, [addTagEvent, canCreateTag]);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    setIsOpen(false);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (trigger === DROPDOWN_TRIGGERS.HOVER) {
      dropdownOptionsContainerRef.current?.addEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      return () => {
        dropdownOptionsContainerRef.current?.removeEventListener(
          "mouseleave",
          handleMouseLeave,
        );
      };
    }
  }, [handleMouseLeave, trigger]);

  const onOptionSelect = (
    selectedOption: any,
    evt: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (isMulti) {
      if (typeof selectedOption !== "object") {
        const selectedOptionIndex = selectedOptionsRef.current.findIndex(
          (option: any) => option === selectedOption,
        );
        if (selectedOptionIndex !== -1) {
          selectedOptionsRef.current.splice(selectedOptionIndex, 1);
        } else {
          selectedOptionsRef.current.push(selectedOption);
        }
        onSelect && onSelect(selectedOptionsRef.current);
        setSelectedOptions([...selectedOptionsRef.current]);
      } else if (uniqueKey) {
        const selectedOptionIndex = selectedOptionsRef.current.findIndex(
          (option: any) => option[uniqueKey] === selectedOption[uniqueKey],
        );
        if (selectedOptionIndex !== -1) {
          selectedOptionsRef.current.splice(selectedOptionIndex, 1);
        } else {
          selectedOptionsRef.current.push(selectedOption);
        }
        onSelect && onSelect(selectedOptionsRef.current);
        setSelectedOptions(
          selectedOptionsRef.current.map((option: any) => option[uniqueKey]),
        );
      }
    } else {
      if (typeof selectedOption === "object") {
        uniqueKey && setSelectedOptions([selectedOption[uniqueKey]]);
      } else {
        setSelectedOptions([selectedOption]);
      }
      onSelect && onSelect(selectedOption);
    }
    evt.stopPropagation();
    if (!hasSelectCheckbox) {
      onClose && onClose();
      setIsOpen(false);
      setIsLoading(true);
    }
  };

  const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      if (onClick) {
        onClick(evt);
      } else {
        setIsOpen((prevState) => !prevState);
        if (!open) {
          setIsLoading(true);
          onClose && onClose();
        }
      }
    }
  };

  const handleSelectAll = (checked: boolean, options: Array<any>) => {
    if (checked) {
      let selectedIds: Array<string> = [];
      if (typeof options[0] === "object" && uniqueKey) {
        options.forEach((option) => {
          selectedIds.push(option[uniqueKey]);
        });
      } else {
        selectedIds = [...options];
      }
      selectedOptionsRef.current = [...options];
      setSelectedOptions([...selectedIds]);
    } else {
      selectedOptionsRef.current = [];
      setSelectedOptions([]);
    }
    onSelect && onSelect(selectedOptionsRef.current);
  };

  // useEffect(() => {
  //   if (
  //     isOpen &&
  //     !isMulti &&
  //     Boolean(optionsScrollRef?.current) &&
  //     Boolean(optionsScrollContainerRef?.current) &&
  //     allowFocusSelectedValue
  //   ) {
  //     scrollIntoView(
  //       optionsScrollContainerRef?.current as HTMLDivElement,
  //       optionsScrollRef?.current as HTMLDivElement,
  //     );
  //   }
  // }, [isOpen, currentOptions, isMulti, allowFocusSelectedValue]);

  const onClickOverlay = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    setIsOpen(false);
    onClose && onClose();
  };

  const attachFocusRef = (option: any, uniqueKey?: string) => {
    if (
      selectedOptions?.includes(uniqueKey ? option[uniqueKey] : option) &&
      !isMulti &&
      allowFocusSelectedValue
    ) {
      return optionsScrollRef;
    }
  };

  const renderOptions = () => {
    if (currentOptions && currentOptions.length > 0) {
      return (
        <>
          {hasSelectCheckbox && hasSelectAllCheckbox && isMulti && (
            <div className="kl-dropdown-select-all">
              <Checkbox
                onChange={(checked) => handleSelectAll(checked, currentOptions)}
                checked={selectedOptions.length === currentOptions.length}
              >
                Select all
              </Checkbox>
            </div>
          )}
          {canCreateTag &&
            tagValue &&
            tagValue?.length > 0 &&
            renderCreateTag()}
          {typeof currentOptions[0] !== "object"
            ? currentOptions.map((option, index) => {
                return (
                  <div
                    className={`kl-dropdown-option ${
                      disabledOptions?.includes(option)
                        ? "kl-dropdown-option-disabled"
                        : ""
                    } ${
                      selectedOptions?.includes(option)
                        ? "kl-dropdown-option-selected"
                        : ""
                    }`}
                    key={option}
                    onClick={(evt) =>
                      !disabledOptions?.includes(option) &&
                      onOptionSelect(option, evt)
                    }
                    data-kla={
                      props["data-kla-option" as keyof typeof props]
                        ? props["data-kla-option" as keyof typeof props] +
                          option
                        : undefined
                    }
                    ref={attachFocusRef(option)}
                  >
                    {optionComponent ? (
                      optionComponent(option)
                    ) : (
                      <div
                        className="kl-dropdown-option-item"
                        data-cy="kl-dropdown-option-item"
                      >
                        {hasSelectCheckbox && (
                          <Checkbox
                            checked={selectedOptions?.includes(option)}
                          />
                        )}
                        {option}
                      </div>
                    )}
                  </div>
                );
              })
            : uniqueKey &&
              currentOptions.map((option, index) => {
                return (
                  <div
                    className={`kl-dropdown-option ${
                      disabledOptions?.includes(option[uniqueKey])
                        ? "kl-dropdown-option-disabled"
                        : ""
                    } ${
                      selectedOptions?.includes(option[uniqueKey])
                        ? "kl-dropdown-option-selected"
                        : ""
                    }`}
                    key={option[uniqueKey]}
                    onClick={(evt) =>
                      !disabledOptions?.includes(option[uniqueKey]) &&
                      onOptionSelect(option, evt)
                    }
                    data-kla={
                      props["data-kla-option" as keyof typeof props]
                        ? props["data-kla-option" as keyof typeof props] +
                          option[displayKey as string]
                        : undefined
                    }
                    ref={attachFocusRef(option, uniqueKey)}
                    data-cy="kl-dropdown-option"
                  >
                    {optionComponent
                      ? optionComponent(option)
                      : displayKey && (
                          <div
                            className="kl-dropdown-option-item"
                            data-cy="kl-dropdown-option-item"
                          >
                            {hasSelectCheckbox && (
                              <Checkbox
                                checked={selectedOptions?.includes(
                                  option[uniqueKey],
                                )}
                              />
                            )}
                            {option[displayKey]}
                          </div>
                        )}
                  </div>
                );
              })}
        </>
      );
    } else {
      return (
        <>
          {canCreateTag && tagValue && tagValue?.length > 0 ? (
            renderCreateTag()
          ) : (
            <div className="kl-dropdown-noResult">No results found</div>
          )}
        </>
      );
    }
  };

  const renderCreateTag = () => {
    const onCreateTag = (event: React.MouseEvent) => {
      event.stopPropagation();
      handleCreateTag && handleCreateTag(tagValue);
    };
    return (
      <div className="kl-dropdown-option" onClick={onCreateTag}>
        <div className="kl-dropdown-option-item">Add {tagValue}</div>
      </div>
    );
  };

  const renderGroupOptions = () => {
    if (currentOptions) {
      const groupByKeysObj = { ...groupByKeysRef.current };
      const groupByKeys = Object.keys(groupByKeysObj);
      return (
        displayKey &&
        uniqueKey &&
        groupByKeys.map((groupType, index) => {
          return (
            <div className="kl-dropdown-group-option" key={groupType}>
              {hasGroupByHeader && (
                <div
                  className={`${
                    groupByKeys.length > 1
                      ? "kl-dropdown-group-header"
                      : "kl-dropdown-group-one-header"
                  }`}
                >
                  {groupType}
                </div>
              )}
              {hasSelectCheckbox &&
                hasSelectAllCheckbox &&
                isMulti &&
                groupByKeys.length === 1 && (
                  <div className="kl-dropdown-select-all">
                    <Checkbox
                      onChange={(checked) =>
                        handleSelectAll(checked, groupByKeysObj[groupType])
                      }
                      checked={selectedOptions.length === currentOptions.length}
                    >
                      Select all
                    </Checkbox>
                  </div>
                )}
              {groupByKeysObj[groupType].map((groupOption: any, index) => {
                return (
                  <div
                    className={`kl-dropdown-option ${
                      disabledOptions?.includes(groupOption[uniqueKey])
                        ? "kl-dropdown-option-disabled"
                        : ""
                    } ${
                      selectedOptions?.includes(groupOption[uniqueKey])
                        ? "kl-dropdown-option-selected"
                        : ""
                    }`}
                    key={groupOption[uniqueKey]}
                    onClick={(evt) =>
                      !disabledOptions?.includes(groupOption[uniqueKey]) &&
                      onOptionSelect(groupOption, evt)
                    }
                  >
                    {optionComponent ? (
                      optionComponent(groupOption)
                    ) : (
                      <div className="kl-dropdown-option-item">
                        {hasSelectCheckbox && (
                          <Checkbox
                            checked={selectedOptions?.includes(
                              groupOption[uniqueKey],
                            )}
                          />
                        )}
                        {groupOption[displayKey]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })
      );
    } else {
      return <div className="kl-dropdown-noResult">No results found</div>;
    }
  };

  return (
    <div
      ref={dropdownOptionsContainerRef}
      className={classNames({
        [`kl-dropdown-height`]: targetFullHeight,
        [`kl-dropdown-width`]: targetFullWidth,
        [`kl-dropdown-width-fit-content`]: !targetFullWidth,
      })}
    >
      {isOpen && trigger !== DROPDOWN_TRIGGERS.HOVER && (
        <div className="kl-dropdown-overlay" onClick={onClickOverlay} />
      )}
      <div
        className="kl-dropdown-target"
        style={{ height: targetFullHeight ? "100%" : "fit-content" }}
        ref={dropdownTargetRef}
        onClick={handleClick}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={dropdownOptionsRef}
          className="kl-dropdown-options-container"
          style={{
            top: dropdownPosition?.top,
            left: dropdownPosition?.left,
            bottom: dropdownPosition?.bottom,
            right: dropdownPosition?.right,
            width: minWidth ? minWidth : dropdownPosition?.width,
            padding: dropdownPosition?.paddingGap,
            visibility: dropdownPosition ? "visible" : "hidden",
          }}
        >
          <div className="kl-dropdown-options-wrapper">
            <div
              style={{
                width: minWidth ? minWidth : dropdownPosition?.width,
              }}
              className={`kl-dropdown-options ${
                optionsRenderer ? "kl-dropdown-custom-options" : ""
              }`}
              ref={optionsScrollContainerRef}
              data-cy="kl-dropdown-options"
            >
              {onInlineSearch && (
                <div className={`kl-dropdown-search`}>
                  <TextInput
                    leftIcon={inlineSearchLeftIcon}
                    placeholder={inlineSearchPlaceHolder}
                    fullWidth={true}
                    onChange={onInlineSearch}
                  />
                </div>
              )}
              {optionsRenderer
                ? currentOptions && optionsRenderer(currentOptions)
                : groupByKey
                  ? renderGroupOptions()
                  : renderOptions()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Dropdown = memo(DropdownComponent);

type MenuItemProps = {
  text?: string;
  children?: React.ReactNode;
  subText?: string | JSX.Element;
  leftIcon?: React.ReactElement;
};

export function MenuItem(props: MenuItemProps): JSX.Element {
  const { text, children, subText, leftIcon } = props;

  return (
    <div className="kl-menu-item">
      {leftIcon && <div className="kl-menu-item-icon">{leftIcon}</div>}
      <div className="kl-menu-item-content">
        {text ? (
          <div className="kl-menu-item-text" data-cy="kl-menu-item-text">
            {text}
          </div>
        ) : (
          children
        )}
        {subText && <div className="kl-menu-item-subtext">{subText}</div>}
      </div>
    </div>
  );
}
