
import re

with open('./src/data/templates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取templateCategories
categories_match = re.search(r"export const templateCategories = \[([^\]]+)\]", content)
if not categories_match:
    print("无法找到templateCategories")
    exit(1)

categories_str = categories_match.group(1)
# 提取分类名称
categories = re.findall(r"'([^']+)'", categories_str)
# 去掉'全部'
categories = [c for c in categories if c != '全部']
print("所有分类:", categories)

# 统计每个分类的模板数量
category_count = {cat: 0 for cat in categories}

# 查找所有category属性
category_matches = re.findall(r"category:\s*'([^']+)'", content)

for cat in category_matches:
    if cat in category_count:
        category_count[cat] += 1

print("\n各分类模板数量统计:")
print("=" * 40)

needs_more = []
all_good = []

for cat in categories:
    count = category_count.get(cat, 0)
    if count &lt; 3:
        needs_more.append((cat, count))
    else:
        all_good.append((cat, count))
    print(f"{cat}: {count}个模板")

print("\n" + "=" * 40)
print(f"\n已满足要求的分类 (≥3个): {len(all_good)}个")
for cat, count in all_good:
    print(f"  - {cat}: {count}个")

print(f"\n需要补充的分类 (&lt;3个): {len(needs_more)}个")
for cat, count in needs_more:
    print(f"  - {cat}: 当前{count}个，还需{3 - count}个")

total = sum(category_count.values())
print(f"\n模板总数: {total}个")
