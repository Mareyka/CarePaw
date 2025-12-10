import React from "react";
import Svg, { Path } from "react-native-svg";

const Search_icon = ({ color = "#5D684F"}) => {
    return(
        <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <Path 
                d="M3.56396 26.136L6.92997 22.716M14.3352 22.716C9.13 22.716 4.91037 18.4287 4.91037 13.14C4.91037 7.85129 9.13 3.56396 14.3352 3.56396C19.5404 3.56396 23.76 7.85129 23.76 13.14C23.76 18.4287 19.5404 22.716 14.3352 22.716Z" 
                stroke={color} 
                strokeWidth="1.782" 
                strokeLinecap="round"
            />
        </Svg>
    );
};

export default Search_icon;