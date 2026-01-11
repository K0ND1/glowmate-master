import React from "react";
import Svg, { Path } from "react-native-svg";

interface ScanFrameProps {
  width?: number;
  height?: number;
  color?: string;
}

const ScanFrame: React.FC<ScanFrameProps> = ({
  width = 237,
  height = 290,
  color = "white",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 237 290" fill="none">
      <Path
        d="M43.668 4C18.168 4 2.16797 5.49994 4.16797 43.4999"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Path
        d="M193.168 4C218.668 4 234.668 5.49994 232.668 43.4999"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Path
        d="M43.668 286C18.168 286 2.16797 284.5 4.16797 246.5"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Path
        d="M193.168 286C218.668 286 234.668 284.5 232.668 246.5"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default ScanFrame;
