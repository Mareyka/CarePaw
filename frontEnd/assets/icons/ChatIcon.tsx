import Svg, { Path } from "react-native-svg";

type Props = {
    focused?: boolean;
    size?: number;
};
export const ChatIcon = ({ focused = false, size = 23 }: Props) => {
    const strokeColor = focused ? "#FFF9F1" : "#5D684F";
    const fillColor = focused ? "#A4B88C" : "none";

    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 23 23"
            fill="none"
        >
            <Path
                d="M15.309 10.1236H15.3182M11.179 10.1236H11.1882M7.04898 10.1236H7.05825M7.57077 18.3569H7.05465C2.92567 18.3569 0.861176 17.3277 0.861176 12.1819V7.03615C0.861176 2.91952 2.92567 0.861206 7.05465 0.861206H15.3126C19.4416 0.861206 21.5061 2.91952 21.5061 7.03615V12.1819C21.5061 16.2986 19.4416 18.3569 15.3126 18.3569H14.7965C14.4765 18.3569 14.1668 18.5113 13.9707 18.7685L12.4223 20.8269C11.741 21.7325 10.6262 21.7325 9.94493 20.8269L8.39656 18.7685C8.2314 18.5421 7.84947 18.3569 7.57077 18.3569Z"
                stroke={strokeColor}
                fill={fillColor}
                strokeWidth={1.72235}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};