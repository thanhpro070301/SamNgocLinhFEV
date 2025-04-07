import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Running prebuild script...');

// Đảm bảo thư mục node_modules/.bin có quyền thực thi
const binDir = path.resolve('./node_modules/.bin');
if (fs.existsSync(binDir)) {
  console.log(`Ensuring executable permissions for ${binDir}`);
  exec(`chmod -R +x ${binDir}`, (error) => {
    if (error) {
      console.error(`Error setting permissions: ${error}`);
      // Tiếp tục dù có lỗi
    } else {
      console.log('Permissions updated successfully');
    }
  });
}

// Đảm bảo vite có quyền thực thi
const vitePath = path.resolve('./node_modules/vite/bin/vite.js');
if (fs.existsSync(vitePath)) {
  console.log(`Ensuring executable permissions for ${vitePath}`);
  exec(`chmod +x ${vitePath}`, (error) => {
    if (error) {
      console.error(`Error setting permissions: ${error}`);
      // Tiếp tục dù có lỗi
    } else {
      console.log('Vite permissions updated successfully');
    }
  });
}

console.log('Prebuild script completed'); 