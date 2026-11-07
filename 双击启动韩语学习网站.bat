@echo off
chcp 65001 >nul
title 韩语学习平台 (Korean Master) - 本地启动器
cd /d "%~dp0"

echo ==========================================================
echo 🚀 正在启动「韩语学习平台 (Korean Master)」...
echo 🌐 启动成功后将自动打开浏览器访问：http://localhost:3000
echo 💡 关闭本窗口或按 Ctrl + C 即可停止网站服务
echo ==========================================================
echo.

start "" "http://localhost:3000"
call pnpm dev
pause
