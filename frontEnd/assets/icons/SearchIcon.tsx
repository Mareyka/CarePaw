import { theme } from "@/constants/theme";
import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  focused?: boolean;
  size?: number;
};

export const SearchIcon = ({ focused = false, size = 28 }: Props) => {
  const strokeColor = focused ? "#FFF8E8" : theme.color.background.darkGreen;
  const innerFill = "none";
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx={14.3352} cy={13.14} r={9.4} fill={innerFill} />
      <Path
        d="M3.56403 26.136L6.93003 22.716M14.3352 22.716C9.13006 22.716 4.91043 18.4287 4.91043 13.14C4.91043 7.85129 9.13006 3.56396 14.3352 3.56396C19.5404 3.56396 23.7601 7.85129 23.7601 13.14C23.7601 18.4287 19.5404 22.716 14.3352 22.716Z"
        stroke={strokeColor}
        strokeWidth={1.782}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default SearchIcon;

