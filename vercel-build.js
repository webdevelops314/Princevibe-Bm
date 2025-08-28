const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Vercel build process...');

try {
  // Change to client directory
  process.chdir(path.join(__dirname, 'client'));
  console.log('📁 Changed to client directory:', process.cwd());

  // Install dependencies
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the React app
  console.log('🔨 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build output
  const buildPath = path.join(process.cwd(), 'build');
  const indexPath = path.join(buildPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log('✅ Build successful! index.html found at:', indexPath);
    console.log('📁 Build directory contents:', fs.readdirSync(buildPath));
  } else {
    console.error('❌ Build failed! index.html not found');
    process.exit(1);
  }

  console.log('🎉 Vercel build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
