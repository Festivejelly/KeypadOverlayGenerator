# Configuration File Format

The Keypad Overlay Generator saves configurations as JSON files. This allows you to:
- Save your work and continue later
- Share configurations with others
- Version control your keypad designs
- Create templates for similar keypads

## Important Notes

### Button Dimensions
- Button borders are drawn **inside** the button dimensions (not added to them)
- A 12mm button with a 0.5mm border will still be exactly 12mm total
- This ensures precise alignment when printing and measuring
- The spacing between buttons remains exactly as specified

### Outer Container Padding
- Individual padding values for Top, Bottom, Left, and Right
- Allows asymmetric padding (e.g., 10mm top/bottom, 7mm left/right)
- Perfect for creating cutting templates that match your keypad exactly
- Config version 1.1+ supports individual padding; version 1.0 uses single value for all sides

## Example Configuration

Here's an example of a saved configuration file (version 1.1):

```json
{
  "version": "1.1",
  "settings": {
    "rows": 4,
    "cols": 4,
    "buttonSize": 15,
    "spacing": 2,
    "cornerRadius": 2,
    "fontSize": 8,
    "borderWidth": 0.5,
    "buttonColor": "#ffffff",
    "borderColor": "#000000",
    "textColor": "#000000",
    "outerBorderWidth": 1,
    "outerBorderColor": "#000000",
    "outerBorderRadius": 3,
    "outerBorderPaddingTop": 10,
    "outerBorderPaddingBottom": 10,
    "outerBorderPaddingLeft": 7,
    "outerBorderPaddingRight": 7,
    "outerBackgroundColor": "#f0f0f0"
  },
  "buttons": [
    [
      {
        "text": "1",
        "contentType": "text",
        "fontSize": null,
        "buttonColor": null,
        "borderColor": null,
        "textColor": null
      },
      {
        "text": "2",
        "contentType": "text",
        "fontSize": null,
        "buttonColor": null,
        "borderColor": null,
        "textColor": null
      }
      // ... more buttons
    ]
    // ... more rows
  ]
}
```

## Usage

1. **Save**: Click the "Save Config" button to download your configuration as a `.json` file
2. **Load**: Click the "Load Config" button and select a previously saved `.json` file
3. **Share**: Send the JSON file to others who can load it in their browser

## Notes

- The configuration includes all settings and button customizations
- Button-specific settings (fontSize, colors) can be `null` to use global defaults
- The `contentType` can be: `text`, `circle`, `triangle`, `square`, `play`, or `stop`
- Multi-line text uses `|` as a separator (e.g., `"Zero|Probe"`)
