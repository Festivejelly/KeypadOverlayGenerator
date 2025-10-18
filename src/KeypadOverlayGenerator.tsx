import React, { useState, useRef } from 'react';
import { Download, Save, Upload } from 'lucide-react';

export default function KeypadOverlayGenerator() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [buttonSize, setButtonSize] = useState(15);
  const [spacing, setSpacing] = useState(2);
  const [cornerRadius, setCornerRadius] = useState(2);
  const [fontSize, setFontSize] = useState(8);
  const [borderWidth, setBorderWidth] = useState(0.5);
  const [buttonColor, setButtonColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#000000');
  const [outerBorderWidth, setOuterBorderWidth] = useState(0);
  const [outerBorderColor, setOuterBorderColor] = useState('#000000');
  const [outerBorderRadius, setOuterBorderRadius] = useState(0);
  const [outerBorderPaddingTop, setOuterBorderPaddingTop] = useState(5);
  const [outerBorderPaddingBottom, setOuterBorderPaddingBottom] = useState(5);
  const [outerBorderPaddingLeft, setOuterBorderPaddingLeft] = useState(5);
  const [outerBorderPaddingRight, setOuterBorderPaddingRight] = useState(5);
  const [outerBackgroundColor, setOuterBackgroundColor] = useState('#ffffff');
  const [buttons, setButtons] = useState(
    Array(4).fill(null).map((_, i) => 
      Array(4).fill(null).map((_, j) => ({
        text: `${i * 4 + j + 1}`,
        contentType: 'text', // 'text', 'circle', 'triangle', 'square', 'play', 'stop', 'menu', 'gear'
        fontSize: null,
        buttonColor: null,
        borderColor: null,
        textColor: null
      }))
    )
  );

  // Update button grid when rows/cols change
  React.useEffect(() => {
    setButtons(prev => {
      const newButtons = Array(rows).fill(null).map((_, i) => 
        Array(cols).fill(null).map((_, j) => 
          prev[i]?.[j] || { 
            text: `${i * cols + j + 1}`, 
            contentType: 'text',
            fontSize: null, 
            buttonColor: null, 
            borderColor: null, 
            textColor: null 
          }
        )
      );
      return newButtons;
    });
  }, [rows, cols]);

  const updateButton = (row: number, col: number, field: string, value: any) => {
    setButtons(prev => {
      const newButtons = [...prev];
      newButtons[row] = [...newButtons[row]];
      newButtons[row][col] = { ...newButtons[row][col], [field]: value };
      return newButtons;
    });
  };

  const totalWidth = cols * buttonSize + (cols - 1) * spacing;
  const totalHeight = rows * buttonSize + (rows - 1) * spacing;
  
  // Small padding to prevent edge clipping (since borders are now inside buttons, we need minimal padding)
  const padding = 0.5;
  
  // Calculate container size (buttons + padding + outer border padding for each side)
  const containerWidth = totalWidth + padding * 2 + outerBorderPaddingLeft + outerBorderPaddingRight;
  const containerHeight = totalHeight + padding * 2 + outerBorderPaddingTop + outerBorderPaddingBottom;
  
  // Add extra space for outer border stroke (so it doesn't get clipped)
  const outerBorderStrokeOffset = outerBorderWidth;
  
  const viewBoxWidth = containerWidth + outerBorderStrokeOffset * 2;
  const viewBoxHeight = containerHeight + outerBorderStrokeOffset * 2;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSVG = () => {
    const svg = document.getElementById('keypad-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keypad-overlay-${rows}x${cols}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveConfiguration = () => {
    const config = {
      version: '1.1',
      settings: {
        rows,
        cols,
        buttonSize,
        spacing,
        cornerRadius,
        fontSize,
        borderWidth,
        buttonColor,
        borderColor,
        textColor,
        outerBorderWidth,
        outerBorderColor,
        outerBorderRadius,
        outerBorderPaddingTop,
        outerBorderPaddingBottom,
        outerBorderPaddingLeft,
        outerBorderPaddingRight,
        outerBackgroundColor,
      },
      buttons,
    };

    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keypad-config-${rows}x${cols}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        
        // Validate config structure
        if (!config.settings || !config.buttons) {
          alert('Invalid configuration file format');
          return;
        }

        // Load settings
        setRows(config.settings.rows);
        setCols(config.settings.cols);
        setButtonSize(config.settings.buttonSize);
        setSpacing(config.settings.spacing);
        setCornerRadius(config.settings.cornerRadius);
        setFontSize(config.settings.fontSize);
        setBorderWidth(config.settings.borderWidth);
        setButtonColor(config.settings.buttonColor);
        setBorderColor(config.settings.borderColor);
        setTextColor(config.settings.textColor);
        setOuterBorderWidth(config.settings.outerBorderWidth);
        setOuterBorderColor(config.settings.outerBorderColor);
        setOuterBorderRadius(config.settings.outerBorderRadius);
        
        // Handle backward compatibility with old config format (v1.0)
        if (config.settings.outerBorderPadding !== undefined) {
          // Old format - single padding value for all sides
          const oldPadding = config.settings.outerBorderPadding;
          setOuterBorderPaddingTop(oldPadding);
          setOuterBorderPaddingBottom(oldPadding);
          setOuterBorderPaddingLeft(oldPadding);
          setOuterBorderPaddingRight(oldPadding);
        } else {
          // New format (v1.1+) - individual padding for each side
          setOuterBorderPaddingTop(config.settings.outerBorderPaddingTop ?? 5);
          setOuterBorderPaddingBottom(config.settings.outerBorderPaddingBottom ?? 5);
          setOuterBorderPaddingLeft(config.settings.outerBorderPaddingLeft ?? 5);
          setOuterBorderPaddingRight(config.settings.outerBorderPaddingRight ?? 5);
        }
        
        setOuterBackgroundColor(config.settings.outerBackgroundColor);
        
        // Load buttons
        setButtons(config.buttons);
      } catch (error) {
        alert('Error loading configuration file. Please check the file format.');
        console.error('Configuration load error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input so the same file can be loaded again
    if (event.target) {
      event.target.value = '';
    }
  };

  const renderShape = (fillColor: string, strokeColor: string) => {
    // Draw border inside the button dimensions to maintain exact button size
    // Inset the rectangle by half the border width and reduce size accordingly
    const inset = borderWidth / 2;
    const adjustedSize = buttonSize - borderWidth;
    const adjustedRadius = Math.max(0, cornerRadius - inset);
    
    return (
      <rect
        x={inset}
        y={inset}
        width={adjustedSize}
        height={adjustedSize}
        rx={adjustedRadius}
        ry={adjustedRadius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={borderWidth}
      />
    );
  };

  const renderContent = (contentType: string, text: string, size: number, color: string, customFontSize: number | null) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const symbolSize = size * 0.5; // Symbols take up 50% of button size
    const textFontSize = customFontSize || fontSize;

    switch(contentType) {
      case 'circle':
        return (
          <circle
            cx={centerX}
            cy={centerY}
            r={symbolSize / 2}
            fill="none"
            stroke={color}
            strokeWidth={borderWidth * 1.5}
          />
        );
      
      case 'triangle':
        const triPoints = [
          [centerX, centerY - symbolSize * 0.4],
          [centerX + symbolSize * 0.4, centerY + symbolSize * 0.3],
          [centerX - symbolSize * 0.4, centerY + symbolSize * 0.3]
        ].map(p => p.join(',')).join(' ');
        return (
          <polygon
            points={triPoints}
            fill="none"
            stroke={color}
            strokeWidth={borderWidth * 1.5}
          />
        );
      
      case 'square':
        return (
          <rect
            x={centerX - symbolSize / 2}
            y={centerY - symbolSize / 2}
            width={symbolSize}
            height={symbolSize}
            fill="none"
            stroke={color}
            strokeWidth={borderWidth * 1.5}
          />
        );
      
      case 'play':
        // Right-pointing triangle
        const playPoints = [
          [centerX - symbolSize * 0.3, centerY - symbolSize * 0.4],
          [centerX + symbolSize * 0.4, centerY],
          [centerX - symbolSize * 0.3, centerY + symbolSize * 0.4]
        ].map(p => p.join(',')).join(' ');
        return (
          <polygon
            points={playPoints}
            fill={color}
            stroke="none"
          />
        );
      
      case 'stop':
        // Square (filled)
        return (
          <rect
            x={centerX - symbolSize / 2}
            y={centerY - symbolSize / 2}
            width={symbolSize}
            height={symbolSize}
            fill={color}
            stroke="none"
          />
        );
      
      case 'menu':
        // Hamburger menu (three horizontal lines)
        const lineSpacing = symbolSize * 0.25;
        const lineWidth = symbolSize * 0.8;
        const lineThickness = borderWidth * 1.5;
        return (
          <g>
            <line
              x1={centerX - lineWidth / 2}
              y1={centerY - lineSpacing}
              x2={centerX + lineWidth / 2}
              y2={centerY - lineSpacing}
              stroke={color}
              strokeWidth={lineThickness}
              strokeLinecap="round"
            />
            <line
              x1={centerX - lineWidth / 2}
              y1={centerY}
              x2={centerX + lineWidth / 2}
              y2={centerY}
              stroke={color}
              strokeWidth={lineThickness}
              strokeLinecap="round"
            />
            <line
              x1={centerX - lineWidth / 2}
              y1={centerY + lineSpacing}
              x2={centerX + lineWidth / 2}
              y2={centerY + lineSpacing}
              stroke={color}
              strokeWidth={lineThickness}
              strokeLinecap="round"
            />
          </g>
        );
      
      case 'gear':
        // Render the exact gear path from Antu_AdobeBridge.svg (viewBox 0 0 48 48)
        // Use a single combined path with evenodd fill to create the center hole.
        const gearPath = "m39.835 21.241c-.111-.146-.256-.233-.438-.261l-3.812-.583c-.208-.667-.493-1.347-.854-2.042.25-.347.625-.837 1.125-1.469.5-.632.854-1.094 1.062-1.385.111-.153.166-.312.166-.479 0-.194-.048-.347-.146-.458-.5-.709-1.646-1.889-3.438-3.542-.166-.139-.34-.208-.52-.208-.208 0-.375.062-.5.187l-2.958 2.229c-.57-.292-1.195-.549-1.875-.772l-.583-3.833c-.014-.181-.094-.33-.24-.448-.146-.118-.316-.177-.511-.177h-4.626c-.403 0-.653.194-.75.583-.181.694-.382 1.986-.604 3.874-.653.209-1.284.473-1.896.792l-2.875-2.229c-.181-.139-.361-.208-.542-.208-.306 0-.962.496-1.969 1.49-1.01.993-1.691 1.74-2.053 2.24-.125.181-.187.34-.187.479 0 .167.069.333.208.5.931 1.125 1.674 2.083 2.229 2.875-.347.639-.618 1.278-.812 1.917l-3.874.583c-.153.028-.285.118-.396.271-.111.153-.167.312-.167.479v4.626c0 .181.055.344.167.489.111.146.256.233.438.261l3.813.563c.194.68.479 1.368.854 2.061-.25.347-.625.837-1.125 1.469-.5.632-.854 1.094-1.062 1.385-.111.153-.167.312-.167.479 0 .181.049.34.146.479.542.75 1.687 1.917 3.438 3.5.153.153.327.229.521.229.208 0 .382-.062.521-.187l2.938-2.23c.57.292 1.195.549 1.875.772l.583 3.833c.014.181.094.33.24.448.146.118.316.177.51.177h4.626c.403 0 .653-.194.751-.583.18-.695.382-1.986.604-3.874.653-.208 1.286-.473 1.896-.792l2.875 2.25c.194.125.375.187.542.187.305 0 .958-.493 1.958-1.479 1-.986 1.688-1.736 2.061-2.25.125-.139.188-.298.188-.479 0-.181-.069-.355-.208-.521-1-1.222-1.743-2.18-2.229-2.875.278-.514.549-1.146.813-1.896l3.854-.583c.166-.028.306-.118.417-.271.111-.153.166-.313.166-.479v-4.626c0-.181-.055-.343-.166-.489m-12.06 6.531c-1.042 1.042-2.299 1.563-3.771 1.563-1.472 0-2.729-.521-3.771-1.563-1.042-1.042-1.562-2.298-1.562-3.771 0-1.472.521-2.729 1.562-3.771 1.042-1.042 2.299-1.562 3.771-1.562 1.472 0 2.729.521 3.771 1.562 1.042 1.042 1.562 2.299 1.562 3.771 0 1.472-.521 2.729-1.562 3.771";
  // Scale gear to ~80% of the button width so it looks balanced across sizes.
  // This yields gearScale = 0.25 when button size is 15mm (15 * 0.8 / 48 = 0.25).
  const gearScale = (size * 0.8) / 48;
  const gearTx = centerX - 24 * gearScale;
  const gearTy = centerY - 24 * gearScale;
        return (
          <g transform={`translate(${gearTx}, ${gearTy}) scale(${gearScale})`}>
            <path d={gearPath} fill={color} fillRule="evenodd" />
          </g>
        );
      
      case 'text':
      default:
        // Check if text contains line breaks (using | as separator)
        const lines = text.split('|');
        if (lines.length > 1) {
          // Multi-line text
          const lineHeight = textFontSize * 1.2;
          const totalHeight = (lines.length - 1) * lineHeight;
          const startY = centerY - totalHeight / 2;
          
          return (
            <text
              x={centerX}
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize={textFontSize}
              fill={color}
            >
              {lines.map((line: string, i: number) => (
                <tspan
                  key={i}
                  x={centerX}
                  y={startY + i * lineHeight}
                  dominantBaseline="central"
                >
                  {line}
                </tspan>
              ))}
            </text>
          );
        }
        
        // Single line text
        return (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={textFontSize}
            fontFamily="Arial, sans-serif"
            fill={color}
          >
            {text}
          </text>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Keypad Overlay Generator</h1>
        <p className="text-gray-600 mb-8">Create custom overlays for membrane keypads</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Button Size (mm)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={buttonSize}
                  onChange={(e) => setButtonSize(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Spacing (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={spacing}
                  onChange={(e) => setSpacing(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Corner Radius (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Font Size (mm)</label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Border Width (mm)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Border drawn inside button dimensions</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Button Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-16 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Border Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-16 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-16 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Outer Container</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Border Width (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={outerBorderWidth}
                    onChange={(e) => setOuterBorderWidth(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Border Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={outerBorderColor}
                      onChange={(e) => setOuterBorderColor(e.target.value)}
                      className="w-16 h-10 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={outerBorderColor}
                      onChange={(e) => setOuterBorderColor(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Corner Radius (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={outerBorderRadius}
                    onChange={(e) => setOuterBorderRadius(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-2">Padding (mm)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Top</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={outerBorderPaddingTop}
                        onChange={(e) => setOuterBorderPaddingTop(parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Bottom</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={outerBorderPaddingBottom}
                        onChange={(e) => setOuterBorderPaddingBottom(parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Left</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={outerBorderPaddingLeft}
                        onChange={(e) => setOuterBorderPaddingLeft(parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Right</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={outerBorderPaddingRight}
                        onChange={(e) => setOuterBorderPaddingRight(parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Space between border and buttons on each side</p>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={outerBackgroundColor}
                      onChange={(e) => setOuterBackgroundColor(e.target.value)}
                      className="w-16 h-10 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={outerBackgroundColor}
                      onChange={(e) => setOuterBackgroundColor(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded font-mono text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Button Grid Size
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {totalWidth.toFixed(1)} × {totalHeight.toFixed(1)} mm
                </p>
                <p className="text-xs text-gray-500">
                  Each button is exactly {buttonSize}mm (borders included)
                </p>
              </div>
            </div>
          </div>

          {/* Preview and Button Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold">Preview</h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <Upload size={20} />
                    Load Config
                  </button>
                  <button
                    onClick={saveConfiguration}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    <Save size={20} />
                    Save Config
                  </button>
                  <button
                    onClick={downloadSVG}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <Download size={20} />
                    Download SVG
                  </button>
                </div>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={loadConfiguration}
                className="hidden"
              />
              
              <div className="border-2 border-gray-300 rounded p-4 bg-gray-50 overflow-auto">
                <svg
                  id="keypad-svg"
                  width={viewBoxWidth * 3.7795275591}
                  height={viewBoxHeight * 3.7795275591}
                  viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: '100%', height: 'auto' }}
                >
                  {/* Outer container (background + border) */}
                  <rect
                    x={outerBorderStrokeOffset}
                    y={outerBorderStrokeOffset}
                    width={containerWidth}
                    height={containerHeight}
                    rx={outerBorderRadius}
                    ry={outerBorderRadius}
                    fill={outerBackgroundColor}
                    stroke={outerBorderWidth > 0 ? outerBorderColor : 'none'}
                    strokeWidth={outerBorderWidth}
                  />
                  
                  {/* Button grid - offset by border stroke, padding, and outer border padding */}
                  {buttons.map((row, i) =>
                    row.map((button, j) => {
                      const x = j * (buttonSize + spacing);
                      const y = i * (buttonSize + spacing);
                      const buttonFontSize = button.fontSize || fontSize;
                      const btnColor = button.buttonColor || buttonColor;
                      const btnBorderColor = button.borderColor || borderColor;
                      const btnTextColor = button.textColor || textColor;
                      const offsetX = outerBorderStrokeOffset + outerBorderPaddingLeft + padding;
                      const offsetY = outerBorderStrokeOffset + outerBorderPaddingTop + padding;
                      return (
                        <g key={`${i}-${j}`} transform={`translate(${x + offsetX}, ${y + offsetY})`}>
                          {renderShape(btnColor, btnBorderColor)}
                          {renderContent(button.contentType, button.text, buttonSize, btnTextColor, buttonFontSize)}
                        </g>
                      );
                    })
                  )}
                </svg>
              </div>
            </div>

            {/* Button Editor */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Button Labels</h2>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {buttons.map((row, i) =>
                  row.map((button, j) => (
                    <div key={`${i}-${j}`} className="border rounded p-2 space-y-1">
                      <div className="text-xs text-gray-500 mb-1">
                        [{i + 1},{j + 1}]
                      </div>
                      <select
                        value={button.contentType}
                        onChange={(e) => updateButton(i, j, 'contentType', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-xs font-semibold"
                      >
                        <option value="text">Text</option>
                        <option value="circle">○ Circle</option>
                        <option value="triangle">△ Triangle</option>
                        <option value="square">□ Square</option>
                        <option value="play">▶ Play</option>
                        <option value="stop">■ Stop</option>
                        <option value="menu">☰ Menu</option>
                        <option value="gear">⚙ Gear</option>
                      </select>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) => updateButton(i, j, 'text', e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Label (use | for line break)"
                        disabled={button.contentType !== 'text'}
                      />
                      <input
                        type="number"
                        min="3"
                        max="20"
                        value={button.fontSize || ''}
                        onChange={(e) => updateButton(i, j, 'fontSize', e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full px-2 py-1 border rounded text-xs"
                        placeholder={`Font: ${fontSize}mm`}
                        disabled={button.contentType !== 'text'}
                      />
                      <div className="grid grid-cols-3 gap-1">
                        <input
                          type="color"
                          value={button.buttonColor || buttonColor}
                          onChange={(e) => updateButton(i, j, 'buttonColor', e.target.value)}
                          className="w-full h-8 border rounded cursor-pointer"
                          title="Button Color"
                        />
                        <input
                          type="color"
                          value={button.borderColor || borderColor}
                          onChange={(e) => updateButton(i, j, 'borderColor', e.target.value)}
                          className="w-full h-8 border rounded cursor-pointer"
                          title="Border Color"
                        />
                        <input
                          type="color"
                          value={button.textColor || textColor}
                          onChange={(e) => updateButton(i, j, 'textColor', e.target.value)}
                          className="w-full h-8 border rounded cursor-pointer"
                          title="Symbol Color"
                        />
                      </div>
                      <button
                        onClick={() => {
                          updateButton(i, j, 'buttonColor', null);
                          updateButton(i, j, 'borderColor', null);
                          updateButton(i, j, 'textColor', null);
                          updateButton(i, j, 'fontSize', null);
                        }}
                        className="w-full px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                        title="Reset to defaults"
                      >
                        Reset
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Measure your keypad's button size and spacing</li>
            <li>Adjust the settings to match your keypad dimensions</li>
            <li>Edit each button's label and shape</li>
            <li>Use <code className="px-1 py-0.5 bg-gray-100 rounded">|</code> for multi-line text (e.g., "Zero|Probe")</li>
            <li><strong>Save Config</strong> to download your customization as JSON (for later editing)</li>
            <li><strong>Load Config</strong> to restore a previously saved configuration</li>
            <li><strong>Download SVG</strong> when ready to print</li>
            <li>Print on paper at actual size (100% scale, no fitting)</li>
            <li>Laminate for durability</li>
            <li>Cut holes for buttons if needed</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            <strong>Tip:</strong> Save your configuration regularly! You can reload it anytime to continue customizing. Most printers can handle SVG files directly, or convert to PDF using Inkscape or a browser's print function.
          </p>
        </div>
      </div>
    </div>
  );
}