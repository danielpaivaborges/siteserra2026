@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo Portal da Transparencia - Serra da Saudade
echo Acesse http://localhost:3000 apos iniciar o servidor
node index.js
pause
