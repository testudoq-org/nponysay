# Platform-Specific Support (Windows/Docker)

## Supported Platforms
- Unix/Linux (tested)
- Windows (limited, needs batch scripts)
- Docker (recommended for cross-platform deployment)

## Known Limitations
- Windows: Path handling, asset permissions, and CLI differences may cause issues.
- Docker: Asset persistence and volume mounting must be configured.

## Platform-Specific Scripts
- `Dockerfile`: Automates build and run in container.
- `setup.bat`: Windows batch script for asset setup and install.

## Example: Dockerfile
```Dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.mjs", "Hello from Docker!"]
```

## Example: Windows Setup
```bat
REM setup.bat
npm install
xcopy assets %APPDATA%\ponysay-node\assets /E /I
echo Ponysay Node installed for Windows.
```

## Next Steps
- Develop and test platform-specific scripts.
- Document platform requirements and troubleshooting.
- Assign owners and set deadlines for platform support tasks.