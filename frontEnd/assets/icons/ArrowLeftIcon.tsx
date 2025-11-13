import { theme } from "@/constants/theme";
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

export const ArrowLeftIcon = ({ size = 27, color = theme.color.background.darkGreen }: Props) => {
  return (
    <Svg width={size} height={size * (20 / 27)} viewBox="0 0 27 20" fill="none">
      <Path
        d="M24.5 11.1C25.1075 11.1 25.6 10.6075 25.6 10C25.6 9.39249 25.1075 8.9 24.5 8.9V10V11.1ZM1.72218 9.22218C1.2926 9.65176 1.2926 10.3482 1.72218 10.7778L8.72254 17.7782C9.15211 18.2078 9.8486 18.2078 10.2782 17.7782C10.7077 17.3486 10.7077 16.6521 10.2782 16.2225L4.05563 10L10.2782 3.77746C10.7077 3.34788 10.7077 2.6514 10.2782 2.22183C9.8486 1.79225 9.15211 1.79225 8.72254 2.22183L1.72218 9.22218ZM24.5 10V8.9L2.5 8.9V10V11.1L24.5 11.1V10Z"
        fill={color}
      />
    </Svg>
  );
};

export default ArrowLeftIcon;

