# Keypad Overlay Generator

A web-based tool to create custom overlays for membrane keypads. Design, customize, and download professional keypad overlays in SVG format.

🔗 **[Live Demo](https://festivejelly.github.io/KeypadOverlayGenerator/)**

## Features

- 🎨 Fully customizable button layouts (up to 8x8 grid)
- 📏 Precise measurements in millimeters
- 🎯 Multiple button content types (text, symbols, shapes)
- 🌈 Individual button color customization
- 📝 Multi-line text support
- 🖼️ Outer border and padding options
- � Save/Load configurations as JSON files
- �📥 Export as SVG for perfect printing
- 🎯 Print-ready output at actual size

## Usage

1. **Configure Grid**: Set the number of rows and columns for your keypad
2. **Adjust Dimensions**: Enter the exact button size and spacing in millimeters
3. **Customize Appearance**: Choose colors, borders, and corner radius
4. **Edit Labels**: Add text or symbols to each button
5. **Save Configuration**: Save your work as a JSON file for later editing
6. **Load Configuration**: Restore a previously saved design to continue customizing
7. **Download SVG**: Export your overlay as an SVG file when ready
8. **Print**: Print at 100% scale (no fitting) on paper
9. **Laminate**: Laminate for durability and place over your keypad

## Development

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
