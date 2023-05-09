import React, { useEffect, useState } from "react";
// returns container's width and height.
interface Dimensions {
  width: number;
  height: number;
}

export const useContainerDimension = (ref: React.RefObject<any>) => {
  const [dimensions, setDimension] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const getDimensions = (): Dimensions => ({
      width: (ref && ref.current.offsetWidth) || 0,
      height: (ref && ref.current.offsetHeight) || 0,
    });

    const handleResize = (): void => {
      setDimension(getDimensions());
    };

    if (ref.current) setDimension(getDimensions());

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);

  return dimensions;
};
