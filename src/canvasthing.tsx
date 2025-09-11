import React, { useRef, useEffect } from 'react';

interface CanvasProps {
    width: number;
    height: number;
    draw: (context: CanvasRenderingContext2D) => void; // Function to handle drawing
}

const CanvasComponent: React.FC<CanvasProps> = ({ width, height, draw }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
        draw(context); // Call the drawing function
        }
    }
    }, [draw]); // Re-run effect if 'draw' function changes

    return <canvas ref={canvasRef} width={width} height={height} />;
};

export default CanvasComponent;