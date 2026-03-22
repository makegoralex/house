#!/bin/bash

cd /var/www/house

echo "📥 Pulling latest code..."
git pull origin main || echo "⚠️ Нет ветки main или пустая репа"

if [ -f package.json ]; then
  echo "📦 Installing dependencies..."
  npm install

  echo "🏗 Building project..."
  npm run build || echo "⚠️ Нет build скрипта"

  echo "🚀 Restarting app..."
  pm2 restart house || pm2 start npm --name "house" -- start
else
  echo "⚠️ package.json не найден — пропускаем деплой"
fi

echo "✅ Deploy finished"
