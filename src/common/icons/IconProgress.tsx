interface IconProps {
  size?: string;
  color?: string;
}
export const IconProgress = ({ size = "16", color }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
  >
    <path
      fill={color}
      d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm0 26a12 12 0 0 1 0-24v12l8.481 8.481A11.963 11.963 0 0 1 16 28Z"
    />
  </svg>
);
