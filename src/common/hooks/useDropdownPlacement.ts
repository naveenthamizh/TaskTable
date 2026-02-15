import React, { useState, useEffect, useCallback, useMemo } from "react";

export const DROPDOWN_PLACEMENTS = {
  TOP: "top",
  TOP_RIGHT: "topRight",
  BOTTOM: "bottom",
  BOTTOM_RIGHT: "bottomRight",
  RIGHT: "right",
  LEFT: "left",
};

interface UseDropdownPlacementParams {
  width: string;
  placement: string;
  xOffset: number;
  yOffset: number;
  xGap: number;
  yGap: number;
  targetRef?: React.RefObject<HTMLDivElement | null>;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
  wheelEventCallback: (e: WheelEvent) => void;
  resizeEventCallback: () => void;
}

interface Position {
  placement: string;
  top: string | number;
  bottom: string | number;
  left: string | number;
  right: string | number;
  paddingGap: string;
  width: string;
}

export function useDropdownPlacement(
  placementParams: UseDropdownPlacementParams,
  open: boolean,
  dependencies: Array<any>,
): [Position | undefined] {
  const {
    width,
    placement,
    xOffset,
    yOffset,
    xGap,
    yGap,
    targetRef,
    dropdownRef,
    wheelEventCallback,
    resizeEventCallback,
  } = placementParams;

  const [position, setPosition] = useState<Position>();

  // Assigning the dependencies args as dependency array directly to avoid new reference,
  // since dependencies is an array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentDependencies = useMemo(() => dependencies, dependencies);

  useEffect(() => {
    if (open) {
      document.addEventListener("wheel", wheelEventCallback, {
        passive: true,
      });
      return () => {
        document.removeEventListener("wheel", wheelEventCallback);
      };
    }
  }, [open, wheelEventCallback]);

  useEffect(() => {
    window.addEventListener("resize", resizeEventCallback);
    return () => {
      window.removeEventListener("resize", resizeEventCallback);
    };
  }, [resizeEventCallback]);

  const getDropdownPlacement = useCallback(() => {
    let placementPosition = placement;
    if (targetRef && targetRef.current && dropdownRef && dropdownRef.current) {
      const targetBoundingRect = targetRef.current.getBoundingClientRect();
      const dropdownOptionWidth = width
        ? Number(width.slice(0, -2))
        : targetBoundingRect.width;
      const dropdownBoundingRect =
        dropdownRef?.current?.getBoundingClientRect();

      // TODO (optional): Can be refractored a little better.
      // The order of the conditions should not be changed.
      if (
        placement === DROPDOWN_PLACEMENTS.TOP_RIGHT ||
        placement === DROPDOWN_PLACEMENTS.TOP
      ) {
        if (targetBoundingRect.y < dropdownBoundingRect.height) {
          placementPosition = DROPDOWN_PLACEMENTS.BOTTOM;
        } else if (targetBoundingRect.x < dropdownOptionWidth) {
          placementPosition = DROPDOWN_PLACEMENTS.TOP;
        }
        if (placement === DROPDOWN_PLACEMENTS.TOP) {
          if (window.innerWidth - targetBoundingRect.x < dropdownOptionWidth) {
            placementPosition = DROPDOWN_PLACEMENTS.TOP_RIGHT;
          }
        }
        if (
          window.innerWidth - targetBoundingRect.x < dropdownOptionWidth &&
          targetBoundingRect.y < dropdownBoundingRect.height
        ) {
          placementPosition = DROPDOWN_PLACEMENTS.BOTTOM_RIGHT;
        }
      }

      if (
        placement === DROPDOWN_PLACEMENTS.BOTTOM ||
        placement === DROPDOWN_PLACEMENTS.BOTTOM_RIGHT
      ) {
        if (window.innerWidth - targetBoundingRect.x < dropdownOptionWidth) {
          placementPosition = DROPDOWN_PLACEMENTS.BOTTOM_RIGHT;
        }
        if (placement === DROPDOWN_PLACEMENTS.BOTTOM_RIGHT) {
          if (targetBoundingRect.x < dropdownOptionWidth) {
            placementPosition = DROPDOWN_PLACEMENTS.BOTTOM;
          }
        }
        // 24 is the bottom offset so that the dropdown menu doesn't touch the bottom
        if (
          window.innerHeight - targetBoundingRect.bottom <=
            dropdownBoundingRect.height + 24 &&
          targetBoundingRect.bottom > dropdownBoundingRect.height + 24
        ) {
          placementPosition = DROPDOWN_PLACEMENTS.TOP;
          if (placement === DROPDOWN_PLACEMENTS.BOTTOM_RIGHT) {
            placementPosition = DROPDOWN_PLACEMENTS.TOP_RIGHT;
            if (targetBoundingRect.x < dropdownOptionWidth) {
              placementPosition = DROPDOWN_PLACEMENTS.TOP;
            }
          }
          if (window.innerWidth - targetBoundingRect.x < dropdownOptionWidth) {
            placementPosition = DROPDOWN_PLACEMENTS.TOP_RIGHT;
          }
        }
      }
    }
    return placementPosition;
  }, [dropdownRef, placement, targetRef, width]);

  useEffect(() => {
    if (open) {
      if (
        targetRef &&
        targetRef.current &&
        dropdownRef &&
        dropdownRef.current
      ) {
        let top: string | number = "inherit";
        const bottom: string | number = "inherit";
        const right: string | number = "inherit";
        let left: string | number = "inherit";
        let paddingGap = "0 0 0 0";

        const dropdownOptionsRect = dropdownRef.current.getBoundingClientRect();
        const targetBoundingRect = targetRef.current.getBoundingClientRect();

        const dropdownWidth = width
          ? width
          : String(targetBoundingRect.width) + "px";

        setTimeout(() => {
          const autoPlacement = getDropdownPlacement();
          switch (true) {
            case autoPlacement === DROPDOWN_PLACEMENTS.TOP:
              top =
                targetBoundingRect.top -
                dropdownOptionsRect.height -
                // yGap is deducted from the height coz position (top) is fixed
                yGap +
                yOffset;
              left = targetBoundingRect.left + xOffset;
              paddingGap = `0 0 ${yGap}px 0`;
              break;
            case autoPlacement === DROPDOWN_PLACEMENTS.TOP_RIGHT:
              top =
                targetBoundingRect.top -
                dropdownOptionsRect.height -
                yGap +
                yOffset;
              left =
                targetBoundingRect.right - dropdownOptionsRect.width + xOffset;
              paddingGap = `0 0 ${yGap}px 0`;
              break;
            case autoPlacement === DROPDOWN_PLACEMENTS.BOTTOM:
              top =
                targetBoundingRect.top + targetBoundingRect.height + yOffset;
              left = targetBoundingRect.left;
              paddingGap = `${yGap}px 0 0 0`;
              break;
            case autoPlacement === DROPDOWN_PLACEMENTS.BOTTOM_RIGHT:
              top =
                targetBoundingRect.top + targetBoundingRect.height + yOffset;
              left =
                targetBoundingRect.right - dropdownOptionsRect.width + xOffset;
              paddingGap = `${yGap}px 0 0 0`;
              break;
            case autoPlacement === DROPDOWN_PLACEMENTS.RIGHT:
              top = targetBoundingRect.top + yOffset;
              left =
                targetBoundingRect.left + targetBoundingRect.width + xOffset;
              paddingGap = `0 0 0 ${xGap}px`;
              break;
          }

          setPosition({
            placement: autoPlacement,
            top,
            bottom,
            left,
            right,
            paddingGap,
            width: dropdownWidth,
          });
        }, 50);
      }
    } else {
      setPosition(undefined);
    }
  }, [
    dropdownRef,
    getDropdownPlacement,
    targetRef,
    xOffset,
    yOffset,
    open,
    width,
    xGap,
    yGap,
    placement,
    currentDependencies,
  ]);

  return [position];
}
