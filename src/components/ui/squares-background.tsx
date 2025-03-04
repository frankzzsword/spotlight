import { useRef, useEffect, useState } from "react"

interface SquaresProps {
  direction?: "right" | "left" | "up" | "down" | "diagonal"
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  className?: string
}

export function Squares({
  direction = "right",
  speed = 1,
  borderColor = "#333",
  squareSize = 40,
  hoverFillColor = "#222",
  className,
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | undefined>(undefined)
  const numSquaresX = useRef<number | undefined>(undefined)
  const numSquaresY = useRef<number | undefined>(undefined)
  const gridOffset = useRef({ x: 0, y: 0 })
  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number
    y: number
  } | null>(null)
  const [activeSquares, setActiveSquares] = useState<Array<{
    x: number,
    y: number,
    color: string,
    duration: number,
    createdAt: number
  }>>([])
  const lastUpdateRef = useRef<number>(0)
  const colorPalette = [
    "#ff2a6d", "#05d9e8", "#f706cf", "#00ff8c", "#d1ff36", 
    "#00ccff", "#ff6e4a", "#8c52ff", "#ffcc00", "#01c5bb"
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background
    canvas.style.background = "transparent"

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      ctx.lineWidth = 0.5

      // Draw all squares first with their border
      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize)
          const squareY = y - (gridOffset.current.y % squareSize)

          // Draw the border for each square
          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX, squareY, squareSize, squareSize)
        }
      }

      // Draw active colored squares 
      const now = Date.now()
      activeSquares.forEach(square => {
        const squareX = (square.x * squareSize) - (gridOffset.current.x % squareSize)
        const squareY = (square.y * squareSize) - (gridOffset.current.y % squareSize)
        
        // Calculate opacity based on remaining duration
        const elapsed = now - square.createdAt
        const progress = Math.min(1, elapsed / square.duration)
        const opacity = progress < 0.2 
          ? progress * 5 // Fade in
          : progress > 0.8 
            ? (1 - progress) * 5 // Fade out 
            : 1 // Full opacity
        
        // Apply the color with calculated opacity
        ctx.fillStyle = square.color.replace(")", `, ${opacity})`).replace("rgb", "rgba")
        ctx.fillRect(squareX, squareY, squareSize, squareSize)
      })

      // Draw hovered square on top if any
      if (hoveredSquare) {
        const squareX = (hoveredSquare.x * squareSize) - (gridOffset.current.x % squareSize)
        const squareY = (hoveredSquare.y * squareSize) - (gridOffset.current.y % squareSize)
        
        ctx.fillStyle = hoverFillColor
        ctx.fillRect(squareX, squareY, squareSize, squareSize)
      }
    }

    const updateActiveSquares = () => {
      const now = Date.now()
      
      // Only update every 100ms to avoid excessive updates
      if (now - lastUpdateRef.current > 100) {
        lastUpdateRef.current = now
        
        // Remove expired squares
        const updatedSquares = activeSquares.filter(
          square => (now - square.createdAt) < square.duration
        )
        
        // Add new squares randomly
        if (Math.random() < 0.3 && numSquaresX.current && numSquaresY.current) {
          const x = Math.floor(Math.random() * numSquaresX.current)
          const y = Math.floor(Math.random() * numSquaresY.current)
          const colorIndex = Math.floor(Math.random() * colorPalette.length)
          const duration = 2000 + Math.random() * 3000 // 2-5 seconds
          
          updatedSquares.push({
            x,
            y,
            color: colorPalette[colorIndex],
            duration,
            createdAt: now
          })
        }
        
        // Limit total number of active squares
        if (updatedSquares.length > 25) {
          updatedSquares.splice(0, updatedSquares.length - 25)
        }
        
        setActiveSquares(updatedSquares)
      }
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)

      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          break
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize
          break
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize
          break
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
      }

      // Update active squares
      updateActiveSquares()
      
      // Draw everything
      drawGrid()
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    // Mouse event handlers defined outside useEffect
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const gridXPosition = mouseX + gridOffset.current.x % squareSize;
      const gridYPosition = mouseY + gridOffset.current.y % squareSize;
      
      const hoveredSquareX = Math.floor(gridXPosition / squareSize);
      const hoveredSquareY = Math.floor(gridYPosition / squareSize);

      setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY });
    };

    const handleMouseLeave = () => {
      setHoveredSquare(null);
    };

    // Initial setup
    resizeCanvas();
    requestRef.current = requestAnimationFrame(updateAnimation);

    // Add event listeners
    window.addEventListener("resize", resizeCanvas);
    
    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousemove", handleMouseMove);
      canvasRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousemove", handleMouseMove);
        canvasRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, activeSquares]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className || ''}`}
      style={{ 
        display: "block", 
        width: "100%", 
        height: "100%",
        cursor: "pointer" // Add cursor style to indicate interactivity
      }}
    />
  )
} 