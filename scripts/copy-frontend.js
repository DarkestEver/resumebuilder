/**
 * Copy Frontend Build to Backend Public Folder
 * 
 * This script copies the Next.js standalone build output
 * to the backend public folder for production deployment.
 */

const fs = require('fs');
const path = require('path');

const frontendOut = path.join(__dirname, '../frontend/.next/standalone');
const frontendStatic = path.join(__dirname, '../frontend/.next/static');
const frontendPublic = path.join(__dirname, '../frontend/public');
const backendPublic = path.join(__dirname, '../backend/public');

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source not found: ${src}`);
    return false;
  }
  
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

// Helper function to clear directory
function clearDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

console.log('🚀 Copying Next.js build to backend/public...\n');

// Clear backend public folder
clearDir(backendPublic);

// Check if standalone build exists
if (!fs.existsSync(frontendOut)) {
  console.log('❌ Next.js standalone build not found!');
  console.log('   Make sure output: "standalone" is in next.config.js');
  console.log('   Then run: cd frontend && npm run build\n');
  
  // Fallback: Copy static export if available
  const outDir = path.join(__dirname, '../frontend/out');
  if (fs.existsSync(outDir)) {
    console.log('📦 Found static export in frontend/out, copying...');
    copyDir(outDir, backendPublic);
    console.log('✅ Static export copied successfully!\n');
  } else {
    console.log('⚠️  No build output found. Please run: npm run build');
  }
  process.exit(1);
}

// Copy standalone server
console.log('📦 Copying standalone server...');
copyDir(frontendOut, backendPublic);

// Copy static files (_next/static)
console.log('📦 Copying static assets...');
const staticDest = path.join(backendPublic, '.next/static');
fs.mkdirSync(staticDest, { recursive: true });
copyDir(frontendStatic, staticDest);

// Copy public folder contents
if (fs.existsSync(frontendPublic)) {
  console.log('📦 Copying public assets...');
  copyDir(frontendPublic, backendPublic);
}

console.log('\n✅ Frontend build copied to backend/public successfully!');
console.log('\n📍 Production deployment ready!');
console.log('   Run: npm run start:prod');
console.log('   Or:  cd backend && node dist/server.js\n');
