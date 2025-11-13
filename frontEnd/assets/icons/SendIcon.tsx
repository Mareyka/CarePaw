import { theme } from "@/constants/theme";
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

export const SendIcon = ({ 
  size = 24, 
  color = "#4E5B3F"
}: Props) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={1}
      />
    </Svg>
  );
};

export default SendIcon;

