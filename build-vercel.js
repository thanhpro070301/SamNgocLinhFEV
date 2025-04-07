import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting custom build process for Vercel...');

// Tạm thời bỏ qua lỗi chmod vì có thể Vercel không cho phép
try {
  console.log('Building project with Vite...');
  
  // Sử dụng đường dẫn module trực tiếp
  const vitePath = path.resolve('./node_modules/vite/bin/vite.js');
  
  // Kiểm tra xem tệp vite.js có tồn tại không
  if (!fs.existsSync(vitePath)) {
    console.error(`Error: ${vitePath} does not exist!`);
    console.log('Trying to use npx instead...');
    
    // Nếu không tìm thấy, thử phương pháp khác
    const buildResult = spawnSync('npx', ['vite', 'build'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    if (buildResult.status !== 0) {
      console.error('Build failed with npx vite build!');
      process.exit(1);
    }
  } else {
    // Sử dụng Node để chạy vite.js trực tiếp
    console.log(`Found Vite at: ${vitePath}`);
    const buildResult = spawnSync('node', [vitePath, 'build'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    if (buildResult.status !== 0) {
      console.error('Build failed with direct Node execution!');
      process.exit(1);
    }
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
} 