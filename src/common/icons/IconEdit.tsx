import { type JSX } from "react";

interface IconProps {
  size: string;
  color?: string;
}

export function IconEdit(props: IconProps): JSX.Element {
  const { size, color = "var(--text-color-secondary)" } = props;

  return (
    <svg
      viewBox="0 0 24 24"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <g transform="matrix(1.7142857142857142,0,0,1.7142857142857142,0,0)">
        <path d="M11.75,12.493H.75a.75.75,0,0,0,0,1.5h11a.75.75,0,0,0,0-1.5Z"></path>
        <path // eslint-disable-next-line max-len
          d="M13.561,1.493,12.5.432a1.537,1.537,0,0,0-2.121,0L3.671,7.139a.5.5,0,0,0-.138.267L3,10.411A.5.5,0,0,0,3.5,11a.433.433,0,0,0,.087-.008l3.005-.53a.5.5,0,0,0,.267-.139l6.707-6.707a1.5,1.5,0,0,0,0-2.121Z"
        ></path>
      </g>
    </svg>
  );
}
