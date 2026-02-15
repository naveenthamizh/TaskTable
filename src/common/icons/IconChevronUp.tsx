import React from "react";

interface IconChevronUpProps {
  size: string;
  color?: string;
}

export function IconChevronUp(props: IconChevronUpProps): JSX.Element {
  const { color = "#504EE4" } = props;
  return (
    <svg
      width={props.size}
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5L5 1L1 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
