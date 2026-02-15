import React, { type JSX } from "react";

interface IconChevronLeftProps {
  size: string;
  color?: string;
}

export function IconChevronLeft(props: IconChevronLeftProps): JSX.Element {
  const { size, color = "#000000" } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M13.939 4.939L6.879 12 13.939 19.061 16.061 16.939 11.121 12 16.061 7.061z"></path>
    </svg>
  );
}
