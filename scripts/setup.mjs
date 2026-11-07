import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env');
const dataDir = path.join(rootDir, 'data');

console.warn('🚀 [Setup] 正在初始化韩语学习平台 (Korean Master) 本地开发环境...');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.warn('✅ [Setup] 已根据 .env.example 自动创建 .env 配置文件');
} else {
  console.warn('ℹ️ [Setup] .env 文件已存在，跳过复制');
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.warn('✅ [Setup] 已创建本地数据存储目录 data/');
}

try {
  execSync('pnpm exec husky', { stdio: 'inherit' });
  console.warn('✅ [Setup] Husky Git Hooks 已激活');
} catch {
  console.warn('⚠️ [Setup] Husky 初始化跳过（请确认当前目录已执行 git init）');
}

console.warn(
  '🎉 [Setup] 本地环境初始化完成！可执行 pnpm dev 启动服务，或执行 pnpm check 进行全量自检。',
);
