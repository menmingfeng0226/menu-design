
const fs = require('fs');
const path = require('path');

// 读取模板文件
const fileContent = fs.readFileSync(path.join(__dirname, 'src/data/templates.ts'), 'utf8');

// 匹配所有的模板
const templateMatches = [...fileContent.matchAll(/category:\s*['"](.*?)['"]/g)];

// 统计每个分类的模板数量
const categoryCount = {};
for (const match of templateMatches) {
    const category = match[1];
    if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
}

console.log('模板分类统计：');
console.log(JSON.stringify(categoryCount, null, 2));

// 获取所有需要的分类（从模板分类列表中提取）
const categoriesMatch = fileContent.match(/templateCategories\s*=\s*\[(.*?)\]/s);
if (categoriesMatch) {
    console.log('\n所有分类列表：');
    console.log(categoriesMatch[1]);
}
