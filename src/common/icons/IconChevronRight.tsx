import React from "react";

interface IconChevronRightProps {
  size: string;
  color?: string;
}

export function IconChevronRight(props: IconChevronRightProps): JSX.Element {
  const { size, color = "#000000" } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 24 24"
    >
      <path d="M10.061 19.061L17.121 12 10.061 4.939 7.939 7.061 12.879 12 7.939 16.939z"></path>
    </svg>
  );
}
