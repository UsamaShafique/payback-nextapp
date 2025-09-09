import React from "react";

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    {...props}
  >
    <path
      d="M10.7749 10.5328L23.7928 23.5508"
      stroke="#121212"
      strokeWidth={2.46377}
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M10.775 23.5508L23.793 10.5328"
      stroke="#121212"
      strokeWidth={2.46377}
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);
