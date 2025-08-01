# Balloon Section Selection Logic

## Current Logic
- Selects balloon section based on CLI argument (e.g., --balloonNN).
- Defaults to lowest-numbered $balloonNN section if not specified.
- Falls back to generic balloon logic if no sections found.

## Limitations
- Only one balloon section can be selected per run.
- No support for multi-section selection or custom grouping.
- Limited flexibility for advanced balloon layouts.

## Proposed Improvements
- Allow selection of multiple balloon sections via CLI (e.g., --balloon=5,7).
- Support custom balloon grouping and layouts.
- Add validation for balloon section existence and compatibility.

## Example: Multi-Section Selection
```sh
node src/index.mjs --balloon=5,7 "Hello world!"
```

## Next Steps
- Document current logic and limitations in README.
- Prototype multi-section selection feature.
- Assign owners for enhancement implementation.