import { type JSX } from "react";

interface IconDeleteProps {
  size?: string;
  color?: string;
}

export function IconDelete(props: IconDeleteProps): JSX.Element {
  const { size = 16, color = "var(--text-color-primary)" } = props;
  const stroke = "0.9";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.78571 4.375H14.2143"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33929 4.375H12.6607V13.6964C12.6607 13.9711 12.5516 14.2346 12.3574 14.4288C12.1632 14.623 11.8997 14.7321 11.625 14.7321H4.37501C4.10032 14.7321 3.83688 14.623 3.64264 14.4288C3.44842 14.2346 3.33929 13.9711 3.33929 13.6964V4.375Z"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.41071 4.37497V3.85711C5.41071 3.17039 5.6835 2.51179 6.16909 2.0262C6.65467 1.54062 7.31327 1.26782 7.99999 1.26782C8.68671 1.26782 9.34531 1.54062 9.8309 2.0262C10.3165 2.51179 10.5893 3.17039 10.5893 3.85711V4.37497"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.44641 7.48364V11.6281"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.55359 7.48364V11.6281"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
