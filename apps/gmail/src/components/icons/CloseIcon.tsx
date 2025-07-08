import React from "react";

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
