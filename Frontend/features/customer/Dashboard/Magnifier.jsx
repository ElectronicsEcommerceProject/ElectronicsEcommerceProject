import { version } from "react"




// Trail version **********************************************************


// import React, { useRef, useState, useEffect } from "react";

// const Magnifier = ({ imageUrl }) => {
//   const containerRef = useRef(null);
//   const [showZoom, setShowZoom] = useState(false);
//   const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
//   const [imageDimensions, setImageDimensions] = useState({ width: 400, height: 400 });

//   // Configuration
//   const lensSize = 100;
//   const zoomLevel = 4; // Increased zoom level as per your previous request
//   const zoomContainerWidth = 400;
//   const zoomContainerHeight = 400;

//   // Get the actual dimensions of the image container
//   useEffect(() => {
//     if (containerRef.current) {
//       const { width, height } = containerRef.current.getBoundingClientRect();
//       setImageDimensions({ width, height });
//     }
//   }, []);

//   const handleMouseMove = (e) => {
//     if (!containerRef.current) return;

//     const { left, top } = containerRef.current.getBoundingClientRect();
//     let x = e.clientX - left - lensSize / 2;
//     let y = e.clientY - top - lensSize / 2;

//     // Keep lens within bounds
//     x = Math.max(0, Math.min(x, imageDimensions.width - lensSize));
//     y = Math.max(0, Math.min(y, imageDimensions.height - lensSize));

//     setLensPosition({ x, y });
//     setShowZoom(true);
//   };

//   const handleMouseLeave = () => {
//     setShowZoom(false);
//   };

//   // Calculate zoom position
//   const lensCenterX = lensPosition.x + lensSize / 2;
//   const lensCenterY = lensPosition.y + lensSize / 2;
//   const zoomedPixelX = lensCenterX * zoomLevel;
//   const zoomedPixelY = lensCenterY * zoomLevel;
//   const bgPosX = zoomedPixelX - zoomContainerWidth / 2;
//   const bgPosY = zoomedPixelY - zoomContainerHeight / 2;

//   // Convert to percentage for backgroundPosition
//   const zoomedImageWidth = imageDimensions.width * zoomLevel;
//   const zoomedImageHeight = imageDimensions.height * zoomLevel;
//   const bgPosXPercent = (bgPosX / (zoomedImageWidth - zoomContainerWidth)) * 100;
//   const bgPosYPercent = (bgPosY / (zoomedImageHeight - zoomContainerHeight)) * 100;

//   return (
//     <>
//       {/* Visible Lens */}
//       {showZoom && (
//         <div
//           className="absolute pointer-events-none border border-green-400 z-50"
//           style={{
//             left: lensPosition.x,
//             top: lensPosition.y,
//             width: `${lensSize}px`,
//             height: `${lensSize}px`,
//             backgroundColor: "rgba(0, 255, 0, 0.15)",
//             backgroundImage: `
//               linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px)
//             `,
//             backgroundSize: "10px 10px",
//           }}
//         />
//       )}

//       {/* Zoom Preview Window - Right Side */}
//       {showZoom && (
//         <div
//           className="absolute left-[calc(100%+20px)] top-0 w-[400px] h-[400px] border-2 border-gray-200 bg-white shadow-xl z-50 overflow-hidden"
//           style={{
//             backgroundImage: `url(${imageUrl})`,
//             backgroundRepeat: "no-repeat",
//             backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
//             backgroundPosition: `${bgPosXPercent}% ${bgPosYPercent}%`,
//           }}
//         />
//       )}

//       {/* Invisible Tracking Layer */}
//       <div
//         ref={containerRef}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//         className="absolute inset-0 cursor-crosshair z-40"
//       />
//     </>
//   );
// };

// export default Magnifier;