// cleanup.js - Script to remove .next and node_modules directories

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to safely remove a directory
function removeDirectory(dirPath) {
  console.log(`Attempting to remove directory: ${dirPath}`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return;
  }
  
  try {
    // Use rimraf-like functionality
    if (process.platform === "win32") {
      // Windows needs special handling for long paths
      execSync(`rmdir /s /q "${dirPath}"`);
    } else {
      // Unix systems
      execSync(`rm -rf "${dirPath}"`);
    }
    console.log(`Successfully removed: ${dirPath}`);
  } catch (error) {
    console.error(`Error removing directory ${dirPath}:`, error.message);
  }
}

// Define directories to clean
const projectRoot = __dirname;
const nextDir = path.join(projectRoot, '.next');
const nodeModulesDir = path.join(projectRoot, 'node_modules');

// Clean directories
console.log('Starting cleanup process...');
removeDirectory(nextDir);
removeDirectory(nodeModulesDir);
console.log('Cleanup process completed!');

// Instructions for next steps
console.log('\nTo reinstall dependencies and start the development server, run:');
console.log('npm install');
console.log('npm run dev');
