interface IconSortProps {
  size: string;
  fill?: string;
}

export const IconSort = (props: IconSortProps) => {
  const { size = "14", fill = "var(--text-color-secondary)" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <path fill={fill} d="M8 16H4l6 6V2H8zm6-11v17h2V8h4l-6-6z" />
    </svg>
  );
};
