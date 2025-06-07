// 提取游戏标题脚本
const fs = require('fs');
const path = require('path');

// 读取url.json文件
try {
  // 读取url.json文件
  const data = fs.readFileSync(path.join(__dirname, '..', 'url.json'), 'utf8');
  const games = JSON.parse(data);
  
  // 提取所有游戏标题
  const titles = games.map(game => game.title);
  
  // 将标题保存到titles.json文件
  fs.writeFileSync(path.join(__dirname, 'titles.json'), JSON.stringify(titles, null, 2));
  
  // 创建意大利语标题映射文件模板
  const italianTitlesTemplate = {};
  titles.forEach(title => {
    italianTitlesTemplate[title] = ""; // 空字符串，等待翻译
  });
  
  // 将意大利语标题映射模板保存到italian_titles.json文件
  fs.writeFileSync(path.join(__dirname, 'italian_titles_template.json'), JSON.stringify(italianTitlesTemplate, null, 2));
  
  console.log(`成功提取了 ${titles.length} 个游戏标题`);
  console.log('titles.json 和 italian_titles_template.json 文件已创建');
} catch (err) {
  console.error('处理文件时出错:', err);
} 