# Asset Validation & Freedom Checks

## Validation Criteria
- Supported file types: .pony, .asc, .txt, .json
- Maximum asset size: 100MB
- Required permissions: readable by application
- No executable or binary files allowed

## Automated Checks
- Validate file extension and size on asset load
- Reject assets exceeding size or with unsupported formats
- Log errors for permission issues

## Asset Requirements & Restrictions
- All assets must be text-based and UTF-8 encoded
- Asset names must not contain spaces or special characters
- Assets must comply with project licensing and freedom guidelines

## Example: Validation Logic
```js
import fs from 'fs';
import path from 'path';

function validateAsset(filePath) {
  const allowedExts = ['.pony', '.asc', '.txt', '.json'];
  const ext = path.extname(filePath).toLowerCase();
  if (!allowedExts.includes(ext)) return false;
  const stats = fs.statSync(filePath);
  if (stats.size > 100 * 1024 * 1024) return false;
  return true;
}
```

## Next Steps
- Implement validation logic in asset loader
- Document asset requirements in README
- Assign owners for validation implementation