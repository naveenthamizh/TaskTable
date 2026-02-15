import { useRef, useState, type JSX, useEffect } from "react";
import ReactDOM from "react-dom";
import { type Root, createRoot } from "react-dom/client";
import { IconClose } from "../../icons/IconClose";
import { IconInfoCircle } from "../../icons/IconInfoCircle";
import { IconTick } from "../../icons/IconTick";
import { IconWarning } from "../../icons/IconWarning";
import { classNames } from "../../utils";
import "./MessageBar.css";

export const MESSAGE_BAR_TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
  INFO: "info",
};

export enum MESSAGE_BAR_ANIMATION_TYPE {
  DEFAULT = 0,
  SLIDE = 1,
}

export const MESSAGE_BAR_POSITIONS = {
  TOP_RIGHT: "topRight",
  BOTTOM_RIGHT: "bottomRight",
  TOP_LEFT: "topLeft",
  BOTTOM_LEFT: "bottomLeft",
};

export interface MessageBarProps {
  open: boolean;
  position: string;
  type: string;
  headerText: string;
  children?: React.ReactNode;
  timeout?: number;
  onDestroy?: () => void;
  animationType?: MESSAGE_BAR_ANIMATION_TYPE;
}

export function MessageBar(props: MessageBarProps): JSX.Element | null {
  const {
    open,
    position,
    type,
    headerText,
    timeout = type === MESSAGE_BAR_TYPES.SUCCESS ? 5 : 8,
    children,
    onDestroy,
    animationType = MESSAGE_BAR_ANIMATION_TYPE.SLIDE,
  } = props;

  const rootElement = document.getElementById(`kl-message-bar-${position}`);

  const timeoutValue = Number(String(timeout) + "000");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);
  const [startProgress, setStartProgress] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const timerRef = useRef<number>(0);
  const progressTimerRef = useRef<number>(0);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (animationType === MESSAGE_BAR_ANIMATION_TYPE.DEFAULT)
        setIsOpen(false);
      else setIsAnimationEnd(true);
      onDestroy && onDestroy();
    }, timeoutValue);
    progressTimerRef.current = setTimeout(() => {
      setStartProgress(true);
    }, 500);
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(progressTimerRef.current);
    };
  }, [onDestroy]);

  useEffect(() => {
    rootElement?.querySelectorAll(".kl-message-header")?.forEach((ele) => {
      if (ele.lastChild?.textContent === headerText) {
        if (ele.id) {
          clearTimeout(Number(ele.id));
          ele.parentElement?.parentElement?.parentElement?.remove();
        }
      }
    });
  }, []);

  const getIconType = () => {
    switch (true) {
      case type === MESSAGE_BAR_TYPES.SUCCESS:
        return <IconTick size="12" />;
      case type === MESSAGE_BAR_TYPES.WARNING:
        return <IconWarning />;
      case type === MESSAGE_BAR_TYPES.DANGER:
        return <IconClose color="var(--white)" size={"16"} />;
      case type === MESSAGE_BAR_TYPES.INFO:
        return <IconInfoCircle size="16" color="var(--white)" />;
    }
  };

  useEffect(() => {
    if (
      isAnimationEnd &&
      animationType !== MESSAGE_BAR_ANIMATION_TYPE.DEFAULT
    ) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animationType, isAnimationEnd]);

  const handleClose = () => {
    if (animationType !== MESSAGE_BAR_ANIMATION_TYPE.DEFAULT)
      setIsAnimationEnd(true);
    else setIsOpen(false);
    clearTimeout(timerRef.current);
  };

  const getAnimationClasses = () => {
    let classes = "";
    if (animationType === MESSAGE_BAR_ANIMATION_TYPE.SLIDE) {
      if (
        [
          MESSAGE_BAR_POSITIONS.BOTTOM_LEFT,
          MESSAGE_BAR_POSITIONS.TOP_LEFT,
        ].includes(position)
      ) {
        classes += " kl-message-bar-left-slide-in";
        if (isAnimationEnd) classes += " kl-message-bar-left-slide-out";
      } else {
        classes += " kl-message-bar-right-slide-in";
        if (isAnimationEnd) classes += " kl-message-bar-right-slide-out";
      }
    }
    return classes;
  };

  return rootElement && isOpen
    ? ReactDOM.createPortal(
        <div
          className={classNames({
            "kl-message-bar-wrapper": true,
            [`kl-message-bar-${type}`]: true,
            "kl-message-bar-with-content": Boolean(children),
            [getAnimationClasses()]:
              animationType !== MESSAGE_BAR_ANIMATION_TYPE.DEFAULT,
          })}
          data-cy="messagebar"
        >
          <div className={`kl-message-bar`}>
            <div className="kl-message-bar-header">
              <div
                className="kl-message-header"
                id={`${timerRef.current ?? ""}`}
                data-cy="messageheader"
              >
                <div
                  className={classNames({
                    "kl-message-bar-icon": true,
                    [`kl-message-bar-icon-${type}`]: true,
                  })}
                >
                  {getIconType()}
                </div>

                <div
                  className={classNames({
                    "kl-message-header-label": true,
                  })}
                >
                  <div>{headerText}</div>
                </div>
              </div>
              <div
                className={classNames({
                  "kl-message-bar-close": true,
                })}
                onClick={handleClose}
                data-cy="messageBarClose"
              >
                <IconClose size="20" color="white" />
              </div>
            </div>
            {children && (
              <div
                className={classNames({
                  "kl-message-bar-content": true,
                })}
                data-cy="messagecontent"
              >
                {children}
              </div>
            )}
            <div
              className={classNames({
                "kl-message-bar-progress": true,
                "kl-message-bar-progress-start": startProgress,
                [`kl-message-bar-${type}`]: true,
              })}
            />
          </div>
        </div>,
        rootElement,
      )
    : null;
}

interface ShowMessageBarParams {
  type?: string;
  heading: string;
  content?: string;
  position?: string;
  onDestroy?: () => void;
}

export function showMessageBar(
  showMessageBarParams: ShowMessageBarParams,
): void {
  const {
    type = MESSAGE_BAR_TYPES.INFO,
    heading,
    content,
    position = MESSAGE_BAR_POSITIONS.TOP_RIGHT,
    onDestroy,
  } = showMessageBarParams;

  const container = document.createElement("div");
  document.body.appendChild(container);

  const root: Root = createRoot(container);

  const handleDestroy = () => {
    onDestroy?.();
    root.unmount();
    container.remove();
  };

  root.render(
    <MessageBar
      open
      type={type}
      headerText={heading}
      position={position}
      onDestroy={handleDestroy}
    >
      {content}
    </MessageBar>,
  );
}
