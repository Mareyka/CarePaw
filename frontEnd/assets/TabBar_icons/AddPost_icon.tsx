import React from "react";
import Svg, { Path } from "react-native-svg"; 

const AddPost_icon = ({ color = "#5D684F"}) => {
    return(
        <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <Path 
                d="M14.0784 3.51953V14.0783M14.0784 14.0783V24.6371M14.0784 14.0783H24.6372M14.0784 14.0783H3.51959" 
                stroke={color} 
                strokeWidth="1.7598" 
                strokeLinecap="round"
            />
        </Svg>
    );
};

export default AddPost_icon;