/* eslint-disable max-len */
import React from "react";

interface IconTickInterface {
  size?: string;
  color?: string;
  variant?: ICON_TICK_VARIANTS;
}

export enum ICON_TICK_VARIANTS {
  DEFAULT = "default",
  TICK_WITH_CIRCLE_FILL = "circle_with_color_fill",
}

function getIcon(variant: ICON_TICK_VARIANTS, color: string): JSX.Element {
  switch (variant) {
    case ICON_TICK_VARIANTS.DEFAULT:
      return (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.5141 0.342416C16.0975 0.853593 16.1651 1.75144 15.665 2.34781L7.31721 12.3033C7.06501 12.6041 6.70151 12.7837 6.31425 12.799C5.927 12.8142 5.55109 12.6636 5.27706 12.3834L0.407503 7.40567C-0.135834 6.85026 -0.135834 5.94976 0.407503 5.39435C0.95084 4.83894 1.83176 4.83894 2.3751 5.39435L6.18228 9.28613L13.5523 0.496677C14.0524 -0.0996963 14.9307 -0.168761 15.5141 0.342416Z"
          fill={color}
        />
      );
    case ICON_TICK_VARIANTS.TICK_WITH_CIRCLE_FILL:
      return (
        <>
          <g clipPath="url(#clip0_5924_572)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM9.0024 4.47302C9.22414 4.19577 9.17923 3.79124 8.90194 3.56944C8.62474 3.34765 8.22019 3.3926 7.99839 3.66984L4.95906 7.46901L3.74324 6.55714C3.45921 6.34412 3.05626 6.40168 2.84324 6.68571C2.63022 6.96975 2.68778 7.37269 2.97181 7.58571L4.68609 8.87143C4.96388 9.0798 5.35689 9.02983 5.5738 8.75871L9.0024 4.47302Z"
              fill={color}
            />
          </g>
          <defs>
            <clipPath id="clip0_5924_572">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </>
      );

    default:
      return <></>;
  }
}

export function IconTick(props: IconTickInterface): JSX.Element {
  const {
    size = 20,
    color = "white",
    variant = ICON_TICK_VARIANTS.DEFAULT,
  } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {getIcon(variant, color)}
    </svg>
  );
}
