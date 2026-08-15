interface PencilIconProps {
  color?: string;
}

export function PencilIcon({ color = "#4a6280" }: PencilIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 2.5L11.5 4.5L4.5 11.5H2.5V9.5L9.5 2.5Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8 4L10 6" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}
