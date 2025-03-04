const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build the React app
console.log('Building React app...');
try {
  execSync('CI=false react-scripts build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building React app:', error);
  process.exit(1);
}

// Ensure server directory exists in the build output
console.log('Setting up server files...');
const buildServerDir = path.join(__dirname, 'build', 'server');
if (!fs.existsSync(buildServerDir)) {
  fs.mkdirSync(buildServerDir, { recursive: true });
}

// Copy server files to the build directory
const serverDir = path.join(__dirname, 'server');
const serverFiles = fs.readdirSync(serverDir);

serverFiles.forEach(file => {
  const srcPath = path.join(serverDir, file);
  const destPath = path.join(buildServerDir, file);
  
  if (fs.statSync(srcPath).isFile()) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to build/server/`);
  }
});

console.log('Build completed successfully!'); 