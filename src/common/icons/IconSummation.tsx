interface IconProps {
  size?: string;
  color?: string;
}
export const IconSummation = ({ size = "16", color }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 2048 2048"
  >
    <path
      fill={color}
      d="M1792 384h-128V256H475l768 768l-768 768h1189v-128h128v256H256v-91l805-805l-805-805v-91h1536v256z"
    />
  </svg>
);
