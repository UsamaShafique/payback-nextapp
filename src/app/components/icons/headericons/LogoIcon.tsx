import React from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {}
export const LogoIcon: React.FC<Props> = (props) => (
  <img src="/assets/logo.png" alt="Logo" {...props} />
);
