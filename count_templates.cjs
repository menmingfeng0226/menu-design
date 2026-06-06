
const fs = require('fs');

const content = fs.readFileSync('./src/data/templates.ts', 'utf8');

// 提取templateCategories数组
const categoriesMatch = content.match(/export const templateCategories = \[([^\]]+)\]/);
if (!categoriesMatch) {
  console.error('无法找到templateCategories');
  process.exit(1);
}

const categories = categoriesMatch[1]
  .replace(/['",\s]/g, '')
  .split(',')
  .filter(c =&gt; c);

console.log('所有分类:', categories);

// 统计每个分类的模板数量
const categoryCount = {};
categories.forEach(cat =&gt; {
  if (cat !== '全部') {
    categoryCount[cat] = 0;
  }
});

// 查找所有category属性
const categoryRegex = /category:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = categoryRegex.exec(content)) !== null) {
  const cat = match[1];
  if (categoryCount.hasOwnProperty(cat)) {
    categoryCount[cat]++;
  }
}

console.log('\n各分类模板数量统计:');
console.log('========================');

let needsMoreTemplates = [];
let allGood = [];

for (const cat of Object.keys(categoryCount)) {
  const count = categoryCount[cat];
  if (count &lt; 3) {
    needsMoreTemplates.push({ category: cat, count });
  } else {
    allGood.push({ category: cat, count });
  }
  console.log(`${cat}: ${count}个模板`);
}

console.log('\n========================');
console.log(`\n已满足要求的分类 (≥3个): ${allGood.length}个`);
if (allGood.length &gt; 0) {
  allGood.forEach(item =&gt; {
    console.log(`  - ${item.category}: ${item.count}个`);
  });
}

console.log(`\n需要补充的分类 (&lt;3个): ${needsMoreTemplates.length}个`);
if (needsMoreTemplates.length &gt; 0) {
  needsMoreTemplates.forEach(item =&gt; {
    console.log(`  - ${item.category}: 当前${item.count}个，还需${3 - item.count}个`);
  });
}

const totalTemplates = Object.values(categoryCount).reduce((a, b) =&gt; a + b, 0);
console.log(`\n模板总数: ${totalTemplates}个`);
