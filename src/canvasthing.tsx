import React, { useRef, useEffect } from "react";

interface CanvasProps {
    width?: number;
    height?: number;
    points: { x: number, y: number }[];
}

const CanvasComponent: React.FC<CanvasProps> = ({ width = window.visualViewport?.width ?? 800, height = window.visualViewport?.height ?? 600, points }) => {


    function normalizeCoord(coordinate: number, maxCoord: number, minCoord: number, range: number) {
        return Math.floor((coordinate - minCoord) / (maxCoord - minCoord) * range);
    }

    const xs = points.map((p: { x: any; }) => p.x);
    const ys = points.map((p: { y: any; }) => p.y);


    const maxX = Math.max(...xs);
    const minX = Math.min(...xs);
    const maxY = Math.max(...ys);
    const minY = Math.min(...ys);

    const normPoints = points.map((p: { x: number; y: number; }) => [normalizeCoord(p.x, maxX, minX, width), normalizeCoord(p.y, maxY, minY, height)]);
    // console.log(normPoints);



    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const documentElement = document.documentElement;
    const computedStyle = window.getComputedStyle(documentElement);
    // console.log(computedStyle.getPropertyValue("--primary"))

    const drawnRef = useRef<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        if (drawnRef.current) return;

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = computedStyle.getPropertyValue("--primary") || "#ff0000";
        ctx.lineWidth = 5;

        if (normPoints.length > 0) {
            console.log(normPoints);
            ctx.beginPath();
            ctx.moveTo(normPoints[0][0], height-normPoints[0][1]);
            for (let i = 1; i < normPoints.length; i++) {
                ctx.lineTo(normPoints[i][0], height-normPoints[i][1]);
            }
            ctx.stroke();
            drawnRef.current = true;
        }
    }, [normPoints, width, height]);

    return <canvas ref={canvasRef} width={width} height={height} className="canvas" style={{overflow: "visible"}}/>;
};

export default CanvasComponent;