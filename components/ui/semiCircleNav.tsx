"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface RotatingListProps {
  items: string[];
}

const SemiCircleNav: React.FC<RotatingListProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = items.length;

  // Function to wrap indexes correctly
  const wrapIndex = (index: number) => (index + totalItems) % totalItems;

  // Get positions based on currentIndex
  const getPositions = (index: number) => [
    wrapIndex(index - 1), // Left (230 degrees)
    wrapIndex(index),     // Center (270 degrees)
    wrapIndex(index + 1), // Right (310 degrees)
  ];

  const [positions, setPositions] = useState(getPositions(currentIndex));

  const handleNavigate = (direction: "forward" | "backward") => {
    const newIndex = wrapIndex(direction === "forward" ? currentIndex + 1 : currentIndex - 1);
    setCurrentIndex(newIndex);

    // Update positions
    setPositions(getPositions(newIndex));
  };

  const animationDuration = 0.8;

  // Calculate position for each angle (230, 270, 310 degrees)
  const getCoordinates = (angle: number, radius: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(radians),
      y: radius * Math.sin(radians),
    };
  };

  const angles = [230, 270, 310]; // Define angles for the positions

  return (
    <div className="relative w-full h-64 flex justify-center items-center">
      {positions.map((pos, idx) => {
        const angle = angles[idx];
        const prevAngle = angles[(idx + (angles.length - 1)) % angles.length];
        const nextAngle = angles[(idx + 1) % angles.length];
        const { x, y } = getCoordinates(angle, 180); // Increased radius to 180px
        const opacity = idx === 1 ? 1 : 0.5;
        return (
          <motion.div
            key={pos}
            className="absolute"
            style={{
              transform: `translate(${x}px, ${y}px)`
            }}
            initial={{ x: getCoordinates(prevAngle, 180).x, y: getCoordinates(prevAngle, 180).y, opacity: 0 }}
            animate={{ x, y, opacity }}
            transition={{
              x: { duration: animationDuration, ease: "easeInOut" },
              y: { duration: animationDuration, ease: "easeInOut" },
              opacity: { duration: animationDuration, ease: "easeInOut" },
            }}
          >
            {items[pos]}
          </motion.div>
        );
      })}
      <button
        onClick={() => handleNavigate("forward")}
        className="absolute left-4 bg-gray-300 p-2 rounded"
      >
        Back
      </button>
      <button
        onClick={() => handleNavigate("backward")}
        className="absolute right-4 bg-gray-300 p-2 rounded"
      >
        Forward
      </button>
    </div>
  );
};

export default SemiCircleNav;