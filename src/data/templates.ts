import type { Template } from '../types';

export const templateCategories = [
  '全部', '中餐', '西餐', '快餐', '日韩料理', '东南亚菜', 
  '街边小吃', '烧烤', '清真', '火锅', '咖啡酒馆', '甜品小食', '奶茶饮品'
];

const chineseDishes = {
  '招牌菜品': [
    { name: '糖醋排骨', price: 58, originalPrice: 68, description: '酸甜可口，外酥里嫩', image: 'https://picsum.photos/seed/cn-special1/300/200', order: 0, unit: '份' },
    { name: '红烧肉', price: 68, originalPrice: 82, description: '肥而不腻，入口即化', image: 'https://picsum.photos/seed/cn-special2/300/200', order: 1, unit: '份' },
    { name: '宫保鸡丁', price: 48, originalPrice: 58, description: '香辣爽脆，花生酥脆', image: 'https://picsum.photos/seed/cn-special3/300/200', order: 2, unit: '份' },
    { name: '鱼香肉丝', price: 42, originalPrice: 52, description: '酸甜微辣，香气浓郁', image: 'https://picsum.photos/seed/cn-special4/300/200', order: 3, unit: '份' }
  ],
  '特色小炒': [
    { name: '蒜蓉西兰花', price: 28, originalPrice: 35, description: '蒜香浓郁，清脆爽口', image: 'https://picsum.photos/seed/cn-veggie1/300/200', order: 0, unit: '份' },
    { name: '蚝油生菜', price: 26, originalPrice: 32, description: '蚝油香浓，生菜脆嫩', image: 'https://picsum.photos/seed/cn-veggie2/300/200', order: 1, unit: '份' },
    { name: '清炒时蔬', price: 22, originalPrice: 28, description: '清爽可口，营养健康', image: 'https://picsum.photos/seed/cn-veggie3/300/200', order: 2, unit: '份' }
  ],
  '汤羹主食': [
    { name: '酸辣汤', price: 28, originalPrice: 35, description: '酸辣开胃，暖心暖胃', image: 'https://picsum.photos/seed/cn-soup1/300/200', order: 0, unit: '份' },
    { name: '蛋炒饭', price: 22, originalPrice: 28, description: '颗粒分明，蛋香浓郁', image: 'https://picsum.photos/seed/cn-rice1/300/200', order: 1, unit: '份' },
    { name: '扬州炒饭', price: 32, originalPrice: 38, description: '配料丰富，鲜香可口', image: 'https://picsum.photos/seed/cn-rice2/300/200', order: 2, unit: '份' }
  ],
  '精美凉菜': [
    { name: '凉拌木耳', price: 18, originalPrice: 24, description: '爽脆可口，开胃小菜', image: 'https://picsum.photos/seed/cn-cold1/300/200', order: 0, unit: '份' },
    { name: '拍黄瓜', price: 16, originalPrice: 20, description: '清凉爽口，酸甜开胃', image: 'https://picsum.photos/seed/cn-cold2/300/200', order: 1, unit: '份' },
    { name: '皮蛋豆腐', price: 22, originalPrice: 28, description: '嫩滑爽口，风味独特', image: 'https://picsum.photos/seed/cn-cold3/300/200', order: 2, unit: '份' }
  ]
};

const westernDishes = {
  '牛排精选': [
    { name: '西冷牛排', price: 168, originalPrice: 198, description: '外焦里嫩，肉质鲜美', image: 'https://picsum.photos/seed/west-steak1/300/200', order: 0, unit: '份' },
    { name: '菲力牛排', price: 188, originalPrice: 228, description: '肉质细嫩，入口即化', image: 'https://picsum.photos/seed/west-steak2/300/200', order: 1, unit: '份' },
    { name: '肉眼牛排', price: 178, originalPrice: 218, description: '肥瘦相间，口感丰富', image: 'https://picsum.photos/seed/west-steak3/300/200', order: 2, unit: '份' }
  ],
  '意式披萨': [
    { name: '玛格丽特披萨', price: 68, originalPrice: 88, description: '经典意式，芝士香浓', image: 'https://picsum.photos/seed/west-pizza1/300/200', order: 0, unit: '份' },
    { name: '培根蘑菇披萨', price: 78, originalPrice: 98, description: '培根香脆，蘑菇鲜嫩', image: 'https://picsum.photos/seed/west-pizza2/300/200', order: 1, unit: '份' },
    { name: '海鲜披萨', price: 88, originalPrice: 108, description: '海鲜鲜美，风味独特', image: 'https://picsum.photos/seed/west-pizza3/300/200', order: 2, unit: '份' }
  ],
  '意面精选': [
    { name: '肉酱意面', price: 58, originalPrice: 72, description: '肉酱浓郁，面条劲道', image: 'https://picsum.photos/seed/west-pasta1/300/200', order: 0, unit: '份' },
    { name: '奶油蘑菇意面', price: 52, originalPrice: 65, description: '奶油香浓，蘑菇鲜嫩', image: 'https://picsum.photos/seed/west-pasta2/300/200', order: 1, unit: '份' },
    { name: '番茄海鲜意面', price: 62, originalPrice: 78, description: '番茄酸甜，海鲜鲜美', image: 'https://picsum.photos/seed/west-pasta3/300/200', order: 2, unit: '份' }
  ],
  '西式汤品': [
    { name: '罗宋汤', price: 32, originalPrice: 42, description: '酸甜开胃，营养丰富', image: 'https://picsum.photos/seed/west-soup1/300/200', order: 0, unit: '份' },
    { name: '奶油南瓜汤', price: 28, originalPrice: 38, description: '香甜细腻，口感顺滑', image: 'https://picsum.photos/seed/west-soup2/300/200', order: 1, unit: '份' },
    { name: '法式洋葱汤', price: 38, originalPrice: 48, description: '洋葱香甜，芝士浓郁', image: 'https://picsum.photos/seed/west-soup3/300/200', order: 2, unit: '份' }
  ]
};

const fastFoodDishes = {
  '汉堡套餐': [
    { name: '经典牛肉堡', price: 38, originalPrice: 48, description: '牛肉鲜嫩，面包松软', image: 'https://picsum.photos/seed/ff-burger1/300/200', order: 0, unit: '份' },
    { name: '香辣鸡腿堡', price: 35, originalPrice: 45, description: '鸡腿香脆，辣味十足', image: 'https://picsum.photos/seed/ff-burger2/300/200', order: 1, unit: '份' },
    { name: '双层芝士堡', price: 48, originalPrice: 58, description: '双层牛肉，芝士浓郁', image: 'https://picsum.photos/seed/ff-burger3/300/200', order: 2, unit: '份' }
  ],
  '炸鸡系列': [
    { name: '脆皮炸鸡', price: 28, originalPrice: 35, description: '外酥里嫩，香气四溢', image: 'https://picsum.photos/seed/ff-fry1/300/200', order: 0, unit: '份' },
    { name: '香辣鸡翅', price: 22, originalPrice: 28, description: '鸡翅香辣，口感丰富', image: 'https://picsum.photos/seed/ff-fry2/300/200', order: 1, unit: '份' },
    { name: '鸡米花', price: 18, originalPrice: 24, description: '酥脆可口，追剧必备', image: 'https://picsum.photos/seed/ff-fry3/300/200', order: 2, unit: '份' }
  ],
  '薯条小食': [
    { name: '经典薯条', price: 16, originalPrice: 20, description: '金黄酥脆，外酥里嫩', image: 'https://picsum.photos/seed/ff-fries1/300/200', order: 0, unit: '份' },
    { name: '芝士薯条', price: 22, originalPrice: 28, description: '芝士浓郁，香气扑鼻', image: 'https://picsum.photos/seed/ff-fries2/300/200', order: 1, unit: '份' },
    { name: '玉米棒', price: 12, originalPrice: 16, description: '香甜可口，营养健康', image: 'https://picsum.photos/seed/ff-corn/300/200', order: 2, unit: '份' }
  ],
  '套餐组合': [
    { name: '单人套餐A', price: 58, originalPrice: 78, description: '汉堡+薯条+可乐', image: 'https://picsum.photos/seed/ff-combo1/300/200', order: 0, unit: '份' },
    { name: '双人套餐B', price: 98, originalPrice: 128, description: '双汉堡+双份薯条+双可乐', image: 'https://picsum.photos/seed/ff-combo2/300/200', order: 1, unit: '份' },
    { name: '全家桶套餐', price: 168, originalPrice: 218, description: '炸鸡+汉堡+薯条+可乐', image: 'https://picsum.photos/seed/ff-combo3/300/200', order: 2, unit: '份' }
  ]
};

const jpKrDishes = {
  '日式刺身': [
    { name: '三文鱼刺身', price: 88, originalPrice: 108, description: '新鲜肥美，口感细腻', image: 'https://picsum.photos/seed/jp-sashimi1/300/200', order: 0, unit: '份' },
    { name: '金枪鱼刺身', price: 98, originalPrice: 128, description: '肉质鲜嫩，入口即化', image: 'https://picsum.photos/seed/jp-sashimi2/300/200', order: 1, unit: '份' },
    { name: '北极贝刺身', price: 68, originalPrice: 88, description: '爽脆可口，鲜甜美味', image: 'https://picsum.photos/seed/jp-sashimi3/300/200', order: 2, unit: '份' }
  ],
  '寿司精选': [
    { name: '三文鱼寿司', price: 38, originalPrice: 48, description: '鱼肉新鲜，米饭劲道', image: 'https://picsum.photos/seed/jp-sushi1/300/200', order: 0, unit: '份' },
    { name: '鳗鱼寿司', price: 42, originalPrice: 52, description: '鳗鱼肥美，酱汁浓郁', image: 'https://picsum.photos/seed/jp-sushi2/300/200', order: 1, unit: '份' },
    { name: '综合寿司拼盘', price: 128, originalPrice: 158, description: '多种口味，一次满足', image: 'https://picsum.photos/seed/jp-sushi3/300/200', order: 2, unit: '份' }
  ],
  '韩式料理': [
    { name: '石锅拌饭', price: 38, originalPrice: 48, description: '米饭劲道，配料丰富', image: 'https://picsum.photos/seed/kr-bibimbap/300/200', order: 0, unit: '份' },
    { name: '部队火锅', price: 88, originalPrice: 108, description: '食材丰富，辣爽开胃', image: 'https://picsum.photos/seed/kr-hotpot/300/200', order: 1, unit: '份' },
    { name: '辣炒年糕', price: 28, originalPrice: 35, description: '甜辣可口，软糯劲道', image: 'https://picsum.photos/seed/kr-ricecake/300/200', order: 2, unit: '份' }
  ],
  '日式料理': [
    { name: '寿喜烧', price: 98, originalPrice: 128, description: '牛肉鲜嫩，汤底鲜甜', image: 'https://picsum.photos/seed/jp-sukiyaki/300/200', order: 0, unit: '份' },
    { name: '天妇罗', price: 58, originalPrice: 72, description: '外酥里嫩，香气四溢', image: 'https://picsum.photos/seed/jp-tempura/300/200', order: 1, unit: '份' },
    { name: '乌冬面', price: 32, originalPrice: 42, description: '面条劲道，汤鲜味美', image: 'https://picsum.photos/seed/jp-udon/300/200', order: 2, unit: '份' }
  ]
};

const southeastDishes = {
  '泰式料理': [
    { name: '冬阴功汤', price: 68, originalPrice: 88, description: '酸辣鲜香，海鲜丰富', image: 'https://picsum.photos/seed/se-thai1/300/200', order: 0, unit: '份' },
    { name: '咖喱蟹', price: 128, originalPrice: 158, description: '咖喱浓郁，蟹肉鲜嫩', image: 'https://picsum.photos/seed/se-thai2/300/200', order: 1, unit: '份' },
    { name: '泰式炒河粉', price: 48, originalPrice: 58, description: '河粉劲道，酸甜可口', image: 'https://picsum.photos/seed/se-thai3/300/200', order: 2, unit: '份' }
  ],
  '越南风味': [
    { name: '越南春卷', price: 32, originalPrice: 42, description: '清爽可口，米纸薄脆', image: 'https://picsum.photos/seed/se-vietnam1/300/200', order: 0, unit: '份' },
    { name: '越南米粉', price: 38, originalPrice: 48, description: '米粉爽滑，汤鲜味美', image: 'https://picsum.photos/seed/se-vietnam2/300/200', order: 1, unit: '份' },
    { name: '越南法棍', price: 28, originalPrice: 35, description: '面包酥脆，馅料丰富', image: 'https://picsum.photos/seed/se-vietnam3/300/200', order: 2, unit: '份' }
  ],
  '东南亚小吃': [
    { name: '沙爹肉串', price: 38, originalPrice: 48, description: '肉串鲜嫩，沙爹香浓', image: 'https://picsum.photos/seed/se-satay/300/200', order: 0, unit: '份' },
    { name: '娘惹咖喱', price: 58, originalPrice: 72, description: '风味独特，香气浓郁', image: 'https://picsum.photos/seed/se-curry/300/200', order: 1, unit: '份' },
    { name: '菠萝炒饭', price: 42, originalPrice: 52, description: '菠萝香甜，米饭可口', image: 'https://picsum.photos/seed/se-pineapple/300/200', order: 2, unit: '份' }
  ]
};

const streetFoodDishes = {
  '特色小吃': [
    { name: '煎饼果子', price: 12, originalPrice: 15, description: '外皮酥脆，内馅丰富', image: 'https://picsum.photos/seed/st-pancake/300/200', order: 0, unit: '份' },
    { name: '手抓饼', price: 10, originalPrice: 12, description: '面饼劲道，配料自选', image: 'https://picsum.photos/seed/st-handpie/300/200', order: 1, unit: '份' },
    { name: '鸡蛋灌饼', price: 10, originalPrice: 12, description: '鸡蛋鲜嫩，饼皮酥脆', image: 'https://picsum.photos/seed/st-eggpie/300/200', order: 2, unit: '份' }
  ],
  '炸物系列': [
    { name: '炸鸡腿', price: 15, originalPrice: 18, description: '外酥里嫩，香气扑鼻', image: 'https://picsum.photos/seed/st-fried1/300/200', order: 0, unit: '个' },
    { name: '炸薯条', price: 8, originalPrice: 10, description: '金黄酥脆，外酥里嫩', image: 'https://picsum.photos/seed/st-fried2/300/200', order: 1, unit: '份' },
    { name: '炸鸡排', price: 18, originalPrice: 22, description: '鸡排鲜嫩，外皮酥脆', image: 'https://picsum.photos/seed/st-fried3/300/200', order: 2, unit: '份' }
  ],
  '烧烤小串': [
    { name: '烤羊肉串', price: 25, originalPrice: 30, description: '羊肉鲜嫩，香气四溢', image: 'https://picsum.photos/seed/st-skewer1/300/200', order: 0, unit: '5串' },
    { name: '烤鱿鱼', price: 20, originalPrice: 25, description: '鱿鱼爽脆，香辣可口', image: 'https://picsum.photos/seed/st-skewer2/300/200', order: 1, unit: '份' },
    { name: '烤面筋', price: 12, originalPrice: 15, description: '面筋劲道，酱料香浓', image: 'https://picsum.photos/seed/st-skewer3/300/200', order: 2, unit: '5串' }
  ],
  '麻辣烫': [
    { name: '经典麻辣烫', price: 28, originalPrice: 35, description: '麻辣鲜香，食材自选', image: 'https://picsum.photos/seed/st-malatang1/300/200', order: 0, unit: '份' },
    { name: '麻辣拌', price: 26, originalPrice: 32, description: '干拌麻辣，风味独特', image: 'https://picsum.photos/seed/st-malatang2/300/200', order: 1, unit: '份' },
    { name: '酸辣粉', price: 18, originalPrice: 22, description: '酸辣开胃，粉条劲道', image: 'https://picsum.photos/seed/st-sournoodle/300/200', order: 2, unit: '份' }
  ]
};

const bbqDishes = {
  '招牌烤肉': [
    { name: '烤羊腿', price: 128, originalPrice: 158, description: '外皮酥脆，肉质鲜嫩', image: 'https://picsum.photos/seed/bbq-leg/300/200', order: 0, unit: '份' },
    { name: '烤牛排', price: 88, originalPrice: 108, description: '牛肉嫩滑，香气浓郁', image: 'https://picsum.photos/seed/bbq-steak/300/200', order: 1, unit: '份' },
    { name: '烤五花肉', price: 58, originalPrice: 72, description: '肥而不腻，外酥里嫩', image: 'https://picsum.photos/seed/bbq-pork/300/200', order: 2, unit: '份' }
  ],
  '特色烤串': [
    { name: '烤羊肉串', price: 38, originalPrice: 48, description: '羊肉鲜嫩，孜然香浓', image: 'https://picsum.photos/seed/bbq-skewer1/300/200', order: 0, unit: '10串' },
    { name: '烤鸡翅', price: 32, originalPrice: 42, description: '外酥里嫩，香气四溢', image: 'https://picsum.photos/seed/bbq-skewer2/300/200', order: 1, unit: '10串' },
    { name: '烤鱿鱼须', price: 28, originalPrice: 35, description: '爽脆可口，香辣美味', image: 'https://picsum.photos/seed/bbq-skewer3/300/200', order: 2, unit: '份' }
  ],
  '海鲜烧烤': [
    { name: '烤生蚝', price: 58, originalPrice: 72, description: '生蚝鲜嫩，蒜香浓郁', image: 'https://picsum.photos/seed/bbq-oyster/300/200', order: 0, unit: '6只' },
    { name: '烤扇贝', price: 48, originalPrice: 58, description: '扇贝肥美，粉丝爽滑', image: 'https://picsum.photos/seed/bbq-scallop/300/200', order: 1, unit: '6只' },
    { name: '烤大虾', price: 68, originalPrice: 88, description: '大虾鲜嫩，香气扑鼻', image: 'https://picsum.photos/seed/bbq-shrimp/300/200', order: 2, unit: '份' }
  ],
  '素菜烧烤': [
    { name: '烤茄子', price: 22, originalPrice: 28, description: '茄子软嫩，蒜香浓郁', image: 'https://picsum.photos/seed/bbq-eggplant/300/200', order: 0, unit: '份' },
    { name: '烤金针菇', price: 18, originalPrice: 22, description: '金针菇爽脆，酱香浓郁', image: 'https://picsum.photos/seed/bbq-mushroom/300/200', order: 1, unit: '份' },
    { name: '烤玉米', price: 16, originalPrice: 20, description: '玉米香甜，外酥里嫩', image: 'https://picsum.photos/seed/bbq-corn/300/200', order: 2, unit: '根' }
  ]
};

const halalDishes = {
  '清真牛羊肉': [
    { name: '红烧牛肉', price: 68, originalPrice: 82, description: '牛肉鲜嫩，酱香浓郁', image: 'https://picsum.photos/seed/halal-beef1/300/200', order: 0, unit: '份' },
    { name: '清炖羊肉', price: 78, originalPrice: 98, description: '羊肉鲜嫩，汤鲜味美', image: 'https://picsum.photos/seed/halal-lamb1/300/200', order: 1, unit: '份' },
    { name: '孜然羊肉', price: 62, originalPrice: 78, description: '孜然香浓，羊肉鲜嫩', image: 'https://picsum.photos/seed/halal-lamb2/300/200', order: 2, unit: '份' }
  ],
  '清真小吃': [
    { name: '手抓饭', price: 28, originalPrice: 35, description: '米饭油亮，羊肉香浓', image: 'https://picsum.photos/seed/halal-rice/300/200', order: 0, unit: '份' },
    { name: '烤包子', price: 18, originalPrice: 22, description: '外皮酥脆，内馅鲜美', image: 'https://picsum.photos/seed/halal-bun/300/200', order: 1, unit: '份' },
    { name: '馕坑肉', price: 58, originalPrice: 72, description: '肉质鲜嫩，香气扑鼻', image: 'https://picsum.photos/seed/halal-nan/300/200', order: 2, unit: '份' }
  ],
  '清真面食': [
    { name: '牛肉面', price: 28, originalPrice: 35, description: '牛肉软烂，面条劲道', image: 'https://picsum.photos/seed/halal-noodle1/300/200', order: 0, unit: '碗' },
    { name: '炒面片', price: 26, originalPrice: 32, description: '面片劲道，配料丰富', image: 'https://picsum.photos/seed/halal-noodle2/300/200', order: 1, unit: '份' },
    { name: '油泼面', price: 22, originalPrice: 28, description: '热油泼香，面条爽滑', image: 'https://picsum.photos/seed/halal-noodle3/300/200', order: 2, unit: '碗' }
  ]
};

const hotpotDishes = {
  '招牌锅底': [
    { name: '麻辣锅底', price: 68, originalPrice: 88, description: '麻辣鲜香，正宗川味', image: 'https://picsum.photos/seed/hp-base1/300/200', order: 0, unit: '份' },
    { name: '番茄锅底', price: 58, originalPrice: 72, description: '酸甜可口，番茄香浓', image: 'https://picsum.photos/seed/hp-base2/300/200', order: 1, unit: '份' },
    { name: '菌汤锅底', price: 62, originalPrice: 78, description: '菌香浓郁，鲜美可口', image: 'https://picsum.photos/seed/hp-base3/300/200', order: 2, unit: '份' },
    { name: '鸳鸯锅底', price: 78, originalPrice: 98, description: '一锅两味，满足不同口味', image: 'https://picsum.photos/seed/hp-base4/300/200', order: 3, unit: '份' }
  ],
  '肉类精选': [
    { name: '雪花牛肉', price: 98, originalPrice: 128, description: '雪花纹理，入口即化', image: 'https://picsum.photos/seed/hp-meat1/300/200', order: 0, unit: '份' },
    { name: '手切羊肉', price: 68, originalPrice: 88, description: '羊肉鲜嫩，口感细腻', image: 'https://picsum.photos/seed/hp-meat2/300/200', order: 1, unit: '份' },
    { name: '鲜毛肚', price: 58, originalPrice: 72, description: '爽脆可口，七上八下', image: 'https://picsum.photos/seed/hp-meat3/300/200', order: 2, unit: '份' },
    { name: '黄喉', price: 48, originalPrice: 58, description: '爽脆可口，口感独特', image: 'https://picsum.photos/seed/hp-meat4/300/200', order: 3, unit: '份' }
  ],
  '海鲜水产': [
    { name: '鲜虾滑', price: 58, originalPrice: 72, description: '虾肉鲜嫩，爽滑可口', image: 'https://picsum.photos/seed/hp-sea1/300/200', order: 0, unit: '份' },
    { name: '墨鱼仔', price: 42, originalPrice: 52, description: '口感Q弹，味道鲜美', image: 'https://picsum.photos/seed/hp-sea2/300/200', order: 1, unit: '份' },
    { name: '蟹棒', price: 28, originalPrice: 35, description: '蟹肉香浓，口感鲜嫩', image: 'https://picsum.photos/seed/hp-sea3/300/200', order: 2, unit: '份' }
  ],
  '蔬菜豆制品': [
    { name: '娃娃菜', price: 18, originalPrice: 22, description: '清甜爽口，鲜嫩多汁', image: 'https://picsum.photos/seed/hp-veg1/300/200', order: 0, unit: '份' },
    { name: '冻豆腐', price: 22, originalPrice: 28, description: '口感多孔，吸汁入味', image: 'https://picsum.photos/seed/hp-veg2/300/200', order: 1, unit: '份' },
    { name: '土豆片', price: 16, originalPrice: 20, description: '口感软糯，土豆香浓', image: 'https://picsum.photos/seed/hp-veg3/300/200', order: 2, unit: '份' },
    { name: '金针菇', price: 18, originalPrice: 22, description: '口感爽滑，菌香浓郁', image: 'https://picsum.photos/seed/hp-veg4/300/200', order: 3, unit: '份' }
  ]
};

const coffeeBarDishes = {
  '经典咖啡': [
    { name: '拿铁', price: 28, originalPrice: 35, description: '奶香浓郁，丝滑顺口', image: 'https://picsum.photos/seed/cb-coffee1/300/200', order: 0, unit: '杯' },
    { name: '美式咖啡', price: 22, originalPrice: 28, description: '香醇浓郁，回味悠长', image: 'https://picsum.photos/seed/cb-coffee2/300/200', order: 1, unit: '杯' },
    { name: '卡布奇诺', price: 28, originalPrice: 35, description: '奶泡绵密，咖啡香浓', image: 'https://picsum.photos/seed/cb-coffee3/300/200', order: 2, unit: '杯' }
  ],
  '特色饮品': [
    { name: '焦糖玛奇朵', price: 32, originalPrice: 42, description: '焦糖香甜，咖啡醇厚', image: 'https://picsum.photos/seed/cb-drink1/300/200', order: 0, unit: '杯' },
    { name: '抹茶拿铁', price: 32, originalPrice: 42, description: '抹茶清香，奶香浓郁', image: 'https://picsum.photos/seed/cb-drink2/300/200', order: 1, unit: '杯' },
    { name: '榛果拿铁', price: 32, originalPrice: 42, description: '榛果香浓，咖啡丝滑', image: 'https://picsum.photos/seed/cb-drink3/300/200', order: 2, unit: '杯' }
  ],
  '精酿啤酒': [
    { name: 'IPA', price: 48, originalPrice: 58, description: '果香浓郁，苦味均衡', image: 'https://picsum.photos/seed/cb-beer1/300/200', order: 0, unit: '杯' },
    { name: '小麦啤酒', price: 38, originalPrice: 48, description: '清爽可口，麦香浓郁', image: 'https://picsum.photos/seed/cb-beer2/300/200', order: 1, unit: '杯' },
    { name: '黑啤酒', price: 42, originalPrice: 52, description: '焦香浓郁，口感醇厚', image: 'https://picsum.photos/seed/cb-beer3/300/200', order: 2, unit: '杯' }
  ],
  '佐酒小食': [
    { name: '薯条', price: 22, originalPrice: 28, description: '金黄酥脆，外酥里嫩', image: 'https://picsum.photos/seed/cb-food1/300/200', order: 0, unit: '份' },
    { name: '鸡米花', price: 28, originalPrice: 35, description: '酥脆可口，佐酒佳品', image: 'https://picsum.photos/seed/cb-food2/300/200', order: 1, unit: '份' },
    { name: '坚果拼盘', price: 38, originalPrice: 48, description: '多种坚果，营养丰富', image: 'https://picsum.photos/seed/cb-food3/300/200', order: 2, unit: '份' }
  ]
};

const dessertDishes = {
  '蛋糕甜点': [
    { name: '提拉米苏', price: 38, originalPrice: 48, description: '咖啡香浓，口感细腻', image: 'https://picsum.photos/seed/ds-cake1/300/200', order: 0, unit: '份' },
    { name: '芝士蛋糕', price: 35, originalPrice: 45, description: '芝士浓郁，口感顺滑', image: 'https://picsum.photos/seed/ds-cake2/300/200', order: 1, unit: '份' },
    { name: '黑森林蛋糕', price: 38, originalPrice: 48, description: '巧克力香浓，口感丰富', image: 'https://picsum.photos/seed/ds-cake3/300/200', order: 2, unit: '份' }
  ],
  '中式甜品': [
    { name: '双皮奶', price: 22, originalPrice: 28, description: '奶香浓郁，口感嫩滑', image: 'https://picsum.photos/seed/ds-chinese1/300/200', order: 0, unit: '份' },
    { name: '杨枝甘露', price: 28, originalPrice: 35, description: '芒果香浓，层次丰富', image: 'https://picsum.photos/seed/ds-chinese2/300/200', order: 1, unit: '份' },
    { name: '芋圆烧仙草', price: 26, originalPrice: 32, description: 'Q弹软糯，清凉解暑', image: 'https://picsum.photos/seed/ds-chinese3/300/200', order: 2, unit: '份' }
  ],
  '冰淇淋': [
    { name: '抹茶冰淇淋', price: 28, originalPrice: 35, description: '抹茶清香，口感细腻', image: 'https://picsum.photos/seed/ds-ice1/300/200', order: 0, unit: '份' },
    { name: '草莓冰淇淋', price: 28, originalPrice: 35, description: '草莓香甜，口感顺滑', image: 'https://picsum.photos/seed/ds-ice2/300/200', order: 1, unit: '份' },
    { name: '巧克力冰淇淋', price: 28, originalPrice: 35, description: '巧克力香浓，口感醇厚', image: 'https://picsum.photos/seed/ds-ice3/300/200', order: 2, unit: '份' }
  ]
};

const milkTeaDishes = {
  '经典奶茶': [
    { name: '珍珠奶茶', price: 18, originalPrice: 22, description: '珍珠Q弹，奶香浓郁', image: 'https://picsum.photos/seed/mt-classic1/300/200', order: 0, unit: '杯' },
    { name: '椰果奶茶', price: 18, originalPrice: 22, description: '椰果爽口，奶香醇厚', image: 'https://picsum.photos/seed/mt-classic2/300/200', order: 1, unit: '杯' },
    { name: '红豆奶茶', price: 18, originalPrice: 22, description: '红豆香甜，口感丰富', image: 'https://picsum.photos/seed/mt-classic3/300/200', order: 2, unit: '杯' }
  ],
  '芝士奶盖': [
    { name: '芝士奶盖绿茶', price: 22, originalPrice: 28, description: '奶盖浓郁，茶底清爽', image: 'https://picsum.photos/seed/mt-cheese1/300/200', order: 0, unit: '杯' },
    { name: '芝士奶盖红茶', price: 22, originalPrice: 28, description: '茶香醇厚，奶盖香浓', image: 'https://picsum.photos/seed/mt-cheese2/300/200', order: 1, unit: '杯' },
    { name: '芝士奶盖乌龙茶', price: 24, originalPrice: 30, description: '乌龙清香，奶盖浓郁', image: 'https://picsum.photos/seed/mt-cheese3/300/200', order: 2, unit: '杯' }
  ],
  '鲜果茶': [
    { name: '霸气橙子', price: 22, originalPrice: 28, description: '新鲜橙汁，维C满满', image: 'https://picsum.photos/seed/mt-fruit1/300/200', order: 0, unit: '杯' },
    { name: '多肉葡萄', price: 25, originalPrice: 32, description: '葡萄香甜，果肉多汁', image: 'https://picsum.photos/seed/mt-fruit2/300/200', order: 1, unit: '杯' },
    { name: '满杯百香果', price: 22, originalPrice: 28, description: '百香果香浓，酸甜可口', image: 'https://picsum.photos/seed/mt-fruit3/300/200', order: 2, unit: '杯' }
  ],
  '特调饮品': [
    { name: '生椰拿铁', price: 28, originalPrice: 35, description: '椰香浓郁，丝滑顺口', image: 'https://picsum.photos/seed/mt-special1/300/200', order: 0, unit: '杯' },
    { name: '抹茶拿铁', price: 28, originalPrice: 35, description: '抹茶清香，奶香浓郁', image: 'https://picsum.photos/seed/mt-special2/300/200', order: 1, unit: '杯' },
    { name: '焦糖布丁奶茶', price: 26, originalPrice: 32, description: '焦糖香甜，布丁嫩滑', image: 'https://picsum.photos/seed/mt-special3/300/200', order: 2, unit: '杯' }
  ]
};

type LayoutType = 'vertical' | 'horizontal' | 'grid' | 'card' | 'list' | 'magazine' | 'compact' | 'premium' | 'carousel' | 'polaroid' | 'featured' | 'masonry' | 'alternating' | 'minimal' | 'elegant' | 'mosaic' | 'custom' | 'spotlight' | 'gallery' | 'newspaper' | 'tag';

function buildCategories(dishes: any, layoutTypes: LayoutType[]) {
  return Object.entries(dishes).map(([name, items], index) => ({
    name,
    dishes: (items as any[]).map((dish, i) => ({
      ...dish,
      order: dish.order ?? i,
      priceString: dish.priceString ?? dish.price.toString(),
      originalPriceString: dish.originalPrice ? dish.originalPriceString ?? dish.originalPrice.toString() : undefined
    })),
    layoutType: layoutTypes[index % layoutTypes.length] || 'vertical'
  }));
}

export const templates: Template[] = [
  {
    id: 'chinese-classic-1',
    name: '中式经典版',
    category: '中餐',
    thumbnail: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=400&fit=crop&auto=format',
    usageCount: 120,
    backgroundOptions: [{ label: '温暖米色', type: 'solid', value: '#FFF9F5' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#2c3e50',
      backgroundColor: '#FFF9F5',
      backgroundType: 'solid',
      layoutType: 'vertical',
      spacing: { categoryGap: 32, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '中式经典菜单',
      categories: buildCategories(chineseDishes, ['vertical', 'horizontal', 'grid', 'list'])
    }
  },
  {
    id: 'chinese-elegant-2',
    name: '中式雅致版',
    category: '中餐',
    thumbnail: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&h=400&fit=crop&auto=format',
    usageCount: 95,
    backgroundOptions: [{ label: '水墨灰', type: 'solid', value: '#F5F5F5' }],
    style: {
      fontFamily: 'Noto Serif SC',
      fontSize: 15,
      textColor: '#333333',
      backgroundColor: '#F5F5F5',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 40, dishGap: 24 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '雅致中餐厅',
      categories: buildCategories(chineseDishes, ['elegant', 'premium', 'card', 'vertical'])
    }
  },
  {
    id: 'chinese-premium-3',
    name: '中式豪华版',
    category: '中餐',
    thumbnail: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop&auto=format',
    usageCount: 78,
    backgroundOptions: [{ label: '奢华金', type: 'solid', value: '#FFFDF5' }],
    style: {
      fontFamily: 'Playfair Display',
      fontSize: 17,
      textColor: '#2c2c2c',
      backgroundColor: '#FFFDF5',
      backgroundType: 'solid',
      layoutType: 'premium',
      spacing: { categoryGap: 48, dishGap: 28 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '尊享中餐厅',
      categories: buildCategories(chineseDishes, ['premium', 'elegant', 'card', 'featured'])
    }
  },
  {
    id: 'western-classic-1',
    name: '西式经典版',
    category: '西餐',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&auto=format',
    usageCount: 88,
    backgroundOptions: [{ label: '优雅米白', type: 'solid', value: '#FAFAFA' }],
    style: {
      fontFamily: 'Playfair Display',
      fontSize: 16,
      textColor: '#1a1a1a',
      backgroundColor: '#FAFAFA',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 40, dishGap: 24 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '西式经典菜单',
      categories: buildCategories(westernDishes, ['elegant', 'card', 'vertical', 'list'])
    }
  },
  {
    id: 'western-modern-2',
    name: '西式时尚版',
    category: '西餐',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format',
    usageCount: 72,
    backgroundOptions: [{ label: '简约白', type: 'solid', value: '#FFFFFF' }],
    style: {
      fontFamily: 'Montserrat',
      fontSize: 15,
      textColor: '#333333',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      layoutType: 'grid',
      spacing: { categoryGap: 32, dishGap: 20 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '时尚西餐厅',
      categories: buildCategories(westernDishes, ['grid', 'masonry', 'card', 'compact'])
    }
  },
  {
    id: 'western-luxury-3',
    name: '西式奢华版',
    category: '西餐',
    thumbnail: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&h=400&fit=crop&auto=format',
    usageCount: 65,
    backgroundOptions: [{ label: '深邃黑', type: 'solid', value: '#1a1a2e' }],
    style: {
      fontFamily: 'Playfair Display',
      fontSize: 18,
      textColor: '#FFFFFF',
      backgroundColor: '#1a1a2e',
      backgroundType: 'solid',
      backgroundMask: 'dark',
      layoutType: 'premium',
      spacing: { categoryGap: 48, dishGap: 28 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '奢华西餐',
      categories: buildCategories(westernDishes, ['premium', 'elegant', 'featured', 'vertical'])
    }
  },
  {
    id: 'fastfood-casual-1',
    name: '快餐活力版',
    category: '快餐',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format',
    usageCount: 150,
    backgroundOptions: [{ label: '活力橙', type: 'solid', value: '#FFF5E6' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#333333',
      backgroundColor: '#FFF5E6',
      backgroundType: 'solid',
      layoutType: 'grid',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '快餐速食菜单',
      categories: buildCategories(fastFoodDishes, ['grid', 'horizontal', 'card', 'list'])
    }
  },
  {
    id: 'fastfood-colorful-2',
    name: '快餐缤纷版',
    category: '快餐',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format',
    usageCount: 130,
    backgroundOptions: [{ label: '清新绿', type: 'solid', value: '#E6FFF5' }],
    style: {
      fontFamily: 'Montserrat',
      fontSize: 15,
      textColor: '#2d5a4a',
      backgroundColor: '#E6FFF5',
      backgroundType: 'solid',
      layoutType: 'masonry',
      spacing: { categoryGap: 24, dishGap: 14 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '缤纷快餐',
      categories: buildCategories(fastFoodDishes, ['masonry', 'grid', 'compact', 'vertical'])
    }
  },
  {
    id: 'fastfood-minimal-3',
    name: '快餐简约版',
    category: '快餐',
    thumbnail: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&h=400&fit=crop&auto=format',
    usageCount: 110,
    backgroundOptions: [{ label: '纯净白', type: 'solid', value: '#FFFFFF' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 15,
      textColor: '#1a1a1a',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      layoutType: 'list',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '简约快餐',
      categories: buildCategories(fastFoodDishes, ['list', 'vertical', 'horizontal', 'card'])
    }
  },
  {
    id: 'jpkorean-traditional-1',
    name: '日韩料理经典版',
    category: '日韩料理',
    thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop&auto=format',
    usageCount: 92,
    backgroundOptions: [{ label: '淡雅米白', type: 'solid', value: '#FAFAFA' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 15,
      textColor: '#2c3e50',
      backgroundColor: '#FAFAFA',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 36, dishGap: 20 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '日韩料理',
      categories: buildCategories(jpKrDishes, ['elegant', 'card', 'vertical', 'featured'])
    }
  },
  {
    id: 'jpkorean-modern-2',
    name: '日韩料理时尚版',
    category: '日韩料理',
    thumbnail: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&h=400&fit=crop&auto=format',
    usageCount: 78,
    backgroundOptions: [{ label: '深邃黑', type: 'solid', value: '#1a1a1a' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#FFFFFF',
      backgroundColor: '#1a1a1a',
      backgroundType: 'solid',
      backgroundMask: 'dark',
      layoutType: 'premium',
      spacing: { categoryGap: 40, dishGap: 24 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '精致日韩料理',
      categories: buildCategories(jpKrDishes, ['premium', 'elegant', 'grid', 'masonry'])
    }
  },
  {
    id: 'jpkorean-casual-3',
    name: '日韩料理清新版',
    category: '日韩料理',
    thumbnail: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&h=400&fit=crop&auto=format',
    usageCount: 85,
    backgroundOptions: [{ label: '清新蓝', type: 'solid', value: '#F0F8FF' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 15,
      textColor: '#1e3a5f',
      backgroundColor: '#F0F8FF',
      backgroundType: 'solid',
      layoutType: 'grid',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '清新日韩',
      categories: buildCategories(jpKrDishes, ['grid', 'list', 'card', 'horizontal'])
    }
  },
  {
    id: 'southeast-traditional-1',
    name: '东南亚风味版',
    category: '东南亚菜',
    thumbnail: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&h=400&fit=crop&auto=format',
    usageCount: 76,
    backgroundOptions: [{ label: '热带橙', type: 'solid', value: '#FFF5E6' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#8B4513',
      backgroundColor: '#FFF5E6',
      backgroundType: 'solid',
      layoutType: 'vertical',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '东南亚风味',
      categories: buildCategories(southeastDishes, ['vertical', 'card', 'grid', 'list'])
    }
  },
  {
    id: 'southeast-vibrant-2',
    name: '东南亚缤纷版',
    category: '东南亚菜',
    thumbnail: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop&auto=format',
    usageCount: 68,
    backgroundOptions: [{ label: '热情红', type: 'solid', value: '#FFF0F0' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#8B0000',
      backgroundColor: '#FFF0F0',
      backgroundType: 'solid',
      layoutType: 'masonry',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '缤纷东南亚',
      categories: buildCategories(southeastDishes, ['masonry', 'grid', 'featured', 'vertical'])
    }
  },
  {
    id: 'southeast-elegant-3',
    name: '东南亚雅致版',
    category: '东南亚菜',
    thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&auto=format',
    usageCount: 62,
    backgroundOptions: [{ label: '典雅米', type: 'solid', value: '#FFFFF0' }],
    style: {
      fontFamily: 'Noto Serif SC',
      fontSize: 15,
      textColor: '#2c2c2c',
      backgroundColor: '#FFFFF0',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 40, dishGap: 24 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '雅致东南亚',
      categories: buildCategories(southeastDishes, ['elegant', 'premium', 'card', 'vertical'])
    }
  },
  {
    id: 'streetfood-casual-1',
    name: '街边小吃烟火版',
    category: '街边小吃',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format',
    usageCount: 145,
    backgroundOptions: [{ label: '烟火橙', type: 'solid', value: '#FFFAF0' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#3d2914',
      backgroundColor: '#FFFAF0',
      backgroundType: 'solid',
      layoutType: 'list',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '街边小吃',
      categories: buildCategories(streetFoodDishes, ['list', 'vertical', 'horizontal', 'card'])
    }
  },
  {
    id: 'streetfood-vibrant-2',
    name: '街边小吃热闹版',
    category: '街边小吃',
    thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&auto=format',
    usageCount: 125,
    backgroundOptions: [{ label: '热情红', type: 'solid', value: '#FFF5F5' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 17,
      textColor: '#8B0000',
      backgroundColor: '#FFF5F5',
      backgroundType: 'solid',
      layoutType: 'grid',
      spacing: { categoryGap: 24, dishGap: 14 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '热闹小吃',
      categories: buildCategories(streetFoodDishes, ['grid', 'masonry', 'compact', 'vertical'])
    }
  },
  {
    id: 'streetfood-minimal-3',
    name: '街边小吃简约版',
    category: '街边小吃',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format',
    usageCount: 105,
    backgroundOptions: [{ label: '纯净白', type: 'solid', value: '#FFFFFF' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 15,
      textColor: '#333333',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      layoutType: 'horizontal',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '简约小吃',
      categories: buildCategories(streetFoodDishes, ['horizontal', 'card', 'list', 'vertical'])
    }
  },
  {
    id: 'bbq-night-1',
    name: '烧烤夜场版',
    category: '烧烤',
    thumbnail: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=400&fit=crop&auto=format',
    usageCount: 138,
    backgroundOptions: [{ label: '深夜蓝', type: 'solid', value: '#1a1a2e' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#FFD700',
      backgroundColor: '#1a1a2e',
      backgroundType: 'solid',
      backgroundMask: 'dark',
      layoutType: 'masonry',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '夜猫烧烤',
      categories: buildCategories(bbqDishes, ['masonry', 'grid', 'card', 'vertical'])
    }
  },
  {
    id: 'bbq-warm-2',
    name: '烧烤温馨版',
    category: '烧烤',
    thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&auto=format',
    usageCount: 118,
    backgroundOptions: [{ label: '温暖橙', type: 'solid', value: '#FFF8E7' }],
    style: {
      fontFamily: 'Noto Serif SC',
      fontSize: 16,
      textColor: '#5D4037',
      backgroundColor: '#FFF8E7',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 36, dishGap: 20 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '温馨烧烤',
      categories: buildCategories(bbqDishes, ['elegant', 'card', 'list', 'featured'])
    }
  },
  {
    id: 'bbq-vibrant-3',
    name: '烧烤热情版',
    category: '烧烤',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format',
    usageCount: 125,
    backgroundOptions: [{ label: '热情红', type: 'solid', value: '#B22222' }],
    style: {
      fontFamily: 'Ma Shan Zheng',
      fontSize: 18,
      textColor: '#FFD700',
      backgroundColor: '#B22222',
      backgroundType: 'solid',
      backgroundMask: 'dark',
      layoutType: 'vertical',
      spacing: { categoryGap: 32, dishGap: 20 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '热情烧烤',
      categories: buildCategories(bbqDishes, ['vertical', 'masonry', 'grid', 'spotlight'])
    }
  },
  {
    id: 'halal-traditional-1',
    name: '清真传统版',
    category: '清真',
    thumbnail: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop&auto=format',
    usageCount: 88,
    backgroundOptions: [{ label: '纯净白', type: 'solid', value: '#FFFFFF' }],
    style: {
      fontFamily: 'Noto Serif SC',
      fontSize: 16,
      textColor: '#1a1a1a',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 36, dishGap: 20 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '清真美食',
      categories: buildCategories(halalDishes, ['elegant', 'card', 'vertical', 'list'])
    }
  },
  {
    id: 'halal-warm-2',
    name: '清真温馨版',
    category: '清真',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format',
    usageCount: 75,
    backgroundOptions: [{ label: '温暖米', type: 'solid', value: '#FFFDF5' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#3d2914',
      backgroundColor: '#FFFDF5',
      backgroundType: 'solid',
      layoutType: 'vertical',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '清真餐厅',
      categories: buildCategories(halalDishes, ['vertical', 'list', 'card', 'horizontal'])
    }
  },
  {
    id: 'halal-minimal-3',
    name: '清真简约版',
    category: '清真',
    thumbnail: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&h=400&fit=crop&auto=format',
    usageCount: 68,
    backgroundOptions: [{ label: '淡雅灰', type: 'solid', value: '#F8F8F8' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 15,
      textColor: '#333333',
      backgroundColor: '#F8F8F8',
      backgroundType: 'solid',
      layoutType: 'list',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '清真小吃',
      categories: buildCategories(halalDishes, ['list', 'horizontal', 'card', 'vertical'])
    }
  },
  {
    id: 'hotpot-spicy-1',
    name: '火锅麻辣版',
    category: '火锅',
    thumbnail: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=600&h=400&fit=crop&auto=format',
    usageCount: 142,
    backgroundOptions: [{ label: '热情红', type: 'solid', value: '#FFF0F0' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#8B0000',
      backgroundColor: '#FFF0F0',
      backgroundType: 'solid',
      layoutType: 'vertical',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '麻辣火锅',
      categories: buildCategories(hotpotDishes, ['vertical', 'horizontal', 'grid', 'card'])
    }
  },
  {
    id: 'hotpot-warm-2',
    name: '火锅温馨版',
    category: '火锅',
    thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&auto=format',
    usageCount: 118,
    backgroundOptions: [{ label: '温暖橙', type: 'solid', value: '#FFF8E7' }],
    style: {
      fontFamily: 'Noto Serif SC',
      fontSize: 16,
      textColor: '#5D4037',
      backgroundColor: '#FFF8E7',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 40, dishGap: 24 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '温馨火锅',
      categories: buildCategories(hotpotDishes, ['elegant', 'card', 'list', 'featured'])
    }
  },
  {
    id: 'hotpot-night-3',
    name: '火锅夜场版',
    category: '火锅',
    thumbnail: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=600&h=400&fit=crop&auto=format',
    usageCount: 130,
    backgroundOptions: [{ label: '深夜黑', type: 'solid', value: '#1a1a1a' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#FFD700',
      backgroundColor: '#1a1a1a',
      backgroundType: 'solid',
      backgroundMask: 'dark',
      layoutType: 'masonry',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '夜火锅',
      categories: buildCategories(hotpotDishes, ['masonry', 'grid', 'card', 'vertical'])
    }
  },
  {
    id: 'coffeebar-modern-1',
    name: '咖啡酒馆时尚版',
    category: '咖啡酒馆',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&auto=format',
    usageCount: 95,
    backgroundOptions: [{ label: '深邃黑', type: 'solid', value: '#1a1a2e' }],
    style: {
      fontFamily: 'Montserrat',
      fontSize: 15,
      textColor: '#FFFFFF',
      backgroundColor: '#1a1a2e',
      backgroundType: 'solid',
      backgroundMask: 'dark',
      layoutType: 'grid',
      spacing: { categoryGap: 32, dishGap: 20 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '咖啡酒馆',
      categories: buildCategories(coffeeBarDishes, ['grid', 'masonry', 'card', 'list'])
    }
  },
  {
    id: 'coffeebar-cozy-2',
    name: '咖啡酒馆温馨版',
    category: '咖啡酒馆',
    thumbnail: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop&auto=format',
    usageCount: 82,
    backgroundOptions: [{ label: '温暖棕', type: 'solid', value: '#FFF8F0' }],
    style: {
      fontFamily: 'Playfair Display',
      fontSize: 16,
      textColor: '#3d2914',
      backgroundColor: '#FFF8F0',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 40, dishGap: 24 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '温馨咖啡馆',
      categories: buildCategories(coffeeBarDishes, ['elegant', 'card', 'vertical', 'featured'])
    }
  },
  {
    id: 'coffeebar-minimal-3',
    name: '咖啡酒馆简约版',
    category: '咖啡酒馆',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&auto=format',
    usageCount: 75,
    backgroundOptions: [{ label: '纯净白', type: 'solid', value: '#FFFFFF' }],
    style: {
      fontFamily: 'Montserrat',
      fontSize: 15,
      textColor: '#1a1a1a',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      layoutType: 'list',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '简约咖啡',
      categories: buildCategories(coffeeBarDishes, ['list', 'vertical', 'horizontal', 'card'])
    }
  },
  {
    id: 'dessert-sweet-1',
    name: '甜品小食甜蜜版',
    category: '甜品小食',
    thumbnail: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop&auto=format',
    usageCount: 108,
    backgroundOptions: [{ label: '甜蜜粉', type: 'solid', value: '#FFF0F5' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#8B0047',
      backgroundColor: '#FFF0F5',
      backgroundType: 'solid',
      layoutType: 'grid',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '甜蜜甜品',
      categories: buildCategories(dessertDishes, ['grid', 'card', 'vertical', 'list'])
    }
  },
  {
    id: 'dessert-elegant-2',
    name: '甜品小食雅致版',
    category: '甜品小食',
    thumbnail: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&h=400&fit=crop&auto=format',
    usageCount: 92,
    backgroundOptions: [{ label: '优雅米', type: 'solid', value: '#FFFFF0' }],
    style: {
      fontFamily: 'Playfair Display',
      fontSize: 16,
      textColor: '#2c2c2c',
      backgroundColor: '#FFFFF0',
      backgroundType: 'solid',
      layoutType: 'elegant',
      spacing: { categoryGap: 40, dishGap: 24 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '雅致甜品',
      categories: buildCategories(dessertDishes, ['elegant', 'premium', 'card', 'featured'])
    }
  },
  {
    id: 'dessert-minimal-3',
    name: '甜品小食简约版',
    category: '甜品小食',
    thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop&auto=format',
    usageCount: 85,
    backgroundOptions: [{ label: '纯净白', type: 'solid', value: '#FFFFFF' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 15,
      textColor: '#333333',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      layoutType: 'list',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '简约甜品',
      categories: buildCategories(dessertDishes, ['list', 'horizontal', 'card', 'vertical'])
    }
  },
  {
    id: 'milktea-colorful-1',
    name: '奶茶饮品缤纷版',
    category: '奶茶饮品',
    thumbnail: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&h=400&fit=crop&auto=format',
    usageCount: 135,
    backgroundOptions: [{ label: '清新绿', type: 'solid', value: '#E6FFF5' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#2d5a4a',
      backgroundColor: '#E6FFF5',
      backgroundType: 'solid',
      layoutType: 'grid',
      spacing: { categoryGap: 28, dishGap: 16 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '缤纷奶茶',
      categories: buildCategories(milkTeaDishes, ['grid', 'masonry', 'card', 'list'])
    }
  },
  {
    id: 'milktea-pink-2',
    name: '奶茶饮品甜美版',
    category: '奶茶饮品',
    thumbnail: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop&auto=format',
    usageCount: 120,
    backgroundOptions: [{ label: '甜美粉', type: 'solid', value: '#FFE4E9' }],
    style: {
      fontFamily: 'Noto Sans SC',
      fontSize: 16,
      textColor: '#C41E3A',
      backgroundColor: '#FFE4E9',
      backgroundType: 'solid',
      layoutType: 'vertical',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '甜美奶茶',
      categories: buildCategories(milkTeaDishes, ['vertical', 'horizontal', 'card', 'featured'])
    }
  },
  {
    id: 'milktea-minimal-3',
    name: '奶茶饮品简约版',
    category: '奶茶饮品',
    thumbnail: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop&auto=format',
    usageCount: 105,
    backgroundOptions: [{ label: '纯净白', type: 'solid', value: '#FFFFFF' }],
    style: {
      fontFamily: 'Montserrat',
      fontSize: 15,
      textColor: '#1a1a1a',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      layoutType: 'list',
      spacing: { categoryGap: 32, dishGap: 18 },
      currency: '¥',
      pageSize: 'A4'
    },
    initialContent: {
      menuName: '简约奶茶',
      categories: buildCategories(milkTeaDishes, ['list', 'vertical', 'horizontal', 'card'])
    }
  }
];
