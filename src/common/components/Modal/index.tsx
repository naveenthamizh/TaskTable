import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  type JSX,
} from "react";
import ReactDOM from "react-dom";

import { Scrim } from "../Scrim";

import "./Modal.css";
import { IconClose } from "../../icons/IconClose";
import { IconLeftArrowAlt } from "../../icons/IconLeftArrowAlt";
import { Button, BUTTON_TYPES, type ButtonProps } from "../Button";

export const MODAL_SIZES = {
  DEFAULT: "default",
  SMALL: "small",
  LARGE: "large",
  VERY_LARGE: "veryLarge",
};

export const MODAL_TYPES = {
  DEFAULT: "default",
  WARNING: "warning",
  DANGER: "danger",
};

type ModalButtonProps = Pick<
  ButtonProps,
  "disabled" | "loading" | "leftIcon" | "rightIcon"
>;

export type ModalProps = {
  title?: string;
  open: boolean;
  children: React.ReactNode;
  width?: string;
  maxHeight?: string;
  size?: string;
  type?: string;
  hasOverlay?: boolean;
  shouldCloseOnClickOverlay?: boolean;
  closable?: boolean;
  onClose?: () => void;
  onOK?: () => void;
  okText?: string;
  okButtonProps?: ModalButtonProps;
  onCancel?: () => void;
  cancelText?: string;
  cancelButtonProps?: ModalButtonProps;
  headerRenderer?: () => JSX.Element;
  footerRenderer?: () => JSX.Element;
  goBack?: () => void;
  defaultFixedHeight?: string;
  zIndex?: number;
};

export function Modal(props: ModalProps): JSX.Element | null {
  const {
    title = "Create",
    open,
    children,
    width,
    maxHeight,
    size = MODAL_SIZES.DEFAULT,
    type = MODAL_TYPES.DEFAULT,
    hasOverlay = true,
    shouldCloseOnClickOverlay = false,
    closable = false,
    onClose,
    onOK,
    okText = "Confirm",
    okButtonProps = {
      loading: false,
      disabled: false,
    },
    onCancel,
    cancelText = "Cancel",
    cancelButtonProps = {
      loading: false,
      disabled: false,
    },
    headerRenderer,
    footerRenderer,
    goBack,
    defaultFixedHeight,
    zIndex,
  } = props;

  const rootElement = document.getElementById("root");

  const [visible, setVisible] = useState<boolean>(open);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalOkButtonRef = useRef<HTMLButtonElement>(null);
  const modalCancelButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (rootElement && visible) {
      Object.keys(props).forEach((prop) => {
        if (/^data-[\w]+$/.test(prop)) {
          if (modalRef.current) {
            modalRef.current.setAttribute(
              prop,
              props[prop as keyof typeof props] as string,
            );
          }
        }
        if (/^data-[\w]+-ok-button$/.test(prop)) {
          if (modalOkButtonRef.current) {
            modalOkButtonRef.current.setAttribute(
              prop.split("-", 2).join("-"),
              props[prop as keyof typeof props] as string,
            );
          }
        }
        if (/^data-[\w]+-cancel-button$/.test(prop)) {
          if (modalCancelButtonRef.current) {
            modalCancelButtonRef.current.setAttribute(
              prop.split("-", 2).join("-"),
              props[prop as keyof typeof props] as string,
            );
          }
        }
      });
    }
  }, [props, rootElement, visible]);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const onClickOverlay = () => {
    shouldCloseOnClickOverlay && setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
    onClose && onClose();
  };

  const handleCancelButton = () => {
    onCancel && onCancel();
  };

  const getActionButton = () => {
    const handleButton = () => {
      onOK && onOK();
    };
    switch (true) {
      case type === MODAL_TYPES.DEFAULT:
        return (
          <Button
            type={BUTTON_TYPES.PRIMARY}
            onClick={handleButton}
            loading={okButtonProps.loading}
            disabled={okButtonProps.disabled}
            leftIcon={okButtonProps.leftIcon}
            rightIcon={okButtonProps.rightIcon}
            ref={modalOkButtonRef}
          >
            {okText}
          </Button>
        );
      case type === MODAL_TYPES.WARNING:
        return (
          <Button
            type={BUTTON_TYPES.WARNING}
            onClick={handleButton}
            loading={okButtonProps.loading}
            disabled={okButtonProps.disabled}
            leftIcon={okButtonProps.leftIcon}
            rightIcon={okButtonProps.rightIcon}
            ref={modalOkButtonRef}
          >
            {okText}
          </Button>
        );
      case type === MODAL_TYPES.DANGER:
        return (
          <Button
            type={BUTTON_TYPES.DANGER}
            onClick={handleButton}
            loading={okButtonProps.loading}
            disabled={okButtonProps.disabled}
            leftIcon={okButtonProps.leftIcon}
            rightIcon={okButtonProps.rightIcon}
            ref={modalOkButtonRef}
          >
            {okText}
          </Button>
        );
    }
  };

  return rootElement && visible
    ? ReactDOM.createPortal(
        <div className={`kl-modal-container`} ref={modalRef}>
          {hasOverlay && <Scrim onClick={onClickOverlay} zIndex={zIndex} />}
          <div
            className={`kl-modal-wrapper kl-modal-${size} `}
            style={{ width: width, height: defaultFixedHeight || undefined }}
            data-cy="modal"
          >
            {headerRenderer ? (
              headerRenderer()
            ) : (
              <div className="kl-modal-header">
                <div className="kl-modal-title-container">
                  {goBack && (
                    <div
                      className="kl-modal-back-icon"
                      onClick={goBack}
                      data-cy="backicon"
                    >
                      <IconLeftArrowAlt size="20" />
                    </div>
                  )}
                  <div
                    className={`kl-modal-header-title`}
                    data-cy="headertitle"
                  >
                    {title}
                  </div>
                </div>
                {closable && (
                  <div
                    className={`kl-modal-header-close-icon`}
                    data-cy="closeicon"
                    onClick={handleClose}
                  >
                    <IconClose size="24" />
                  </div>
                )}
              </div>
            )}
            <div
              className="kl-modal-content"
              style={{ maxHeight: maxHeight || undefined }}
              data-cy="assignnumber"
            >
              <div>{children}</div>
            </div>
            {footerRenderer ? (
              footerRenderer()
            ) : (
              <div className="kl-modal-footer" data-cy="modalfooter">
                {Boolean(onCancel) && (
                  <Button
                    type={BUTTON_TYPES.DEFAULT}
                    onClick={handleCancelButton}
                    loading={cancelButtonProps.loading}
                    disabled={cancelButtonProps.disabled}
                    leftIcon={cancelButtonProps.leftIcon}
                    rightIcon={cancelButtonProps.rightIcon}
                    ref={modalCancelButtonRef}
                  >
                    {cancelText}
                  </Button>
                )}
                {getActionButton()}
              </div>
            )}
          </div>
        </div>,
        rootElement,
      )
    : null;
}
