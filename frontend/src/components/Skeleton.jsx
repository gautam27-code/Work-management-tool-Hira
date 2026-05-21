import React from "react";

function Skeleton({ type = "line", width = "100%", height = "20px", className = "" }) {
  let shapeClass = "";
  
  if (type === "circle") {
    shapeClass = "rounded-full";
    // For circles, we generally want width = height, if not specified via className
    if (!className.includes('w-') && !className.includes('h-')) {
        shapeClass += ` w-[${width}] h-[${width}]`;
    }
  } else if (type === "card") {
    shapeClass = "rounded-2xl";
  } else {
    shapeClass = "rounded-md";
  }

  return (
    <div 
      className={`skeleton ${shapeClass} ${className}`}
      style={{ 
        width: className.includes('w-') ? undefined : width, 
        height: className.includes('h-') ? undefined : height 
      }}
    />
  );
}

export default Skeleton;
