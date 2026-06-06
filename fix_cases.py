
# 正确的代码片段，从 'case 'staircase':' 开始到 'case 'vertical':' 之前
correct_code = '''      case 'staircase':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="flex flex-col" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.8, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      const marginLeft = index * 16;
                      
                      return (
                        <div key={dish.id} className="flex items-start gap-4" style={{ gap: `${16 * optimalScale * finalScale}px`, marginLeft: `${marginLeft * optimalScale * finalScale}px` }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0" style={{ width: `${64 * optimalScale * finalScale}px`, height: `${64 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            {dish.description && (
                              <div style={descStyle}>
                                {dish.description}
                              </div>
                            )}
                            <div className="flex items-baseline gap-2 mt-1" style={{ gap: `${8 * optimalScale * finalScale}px`, marginTop: `${4 * optimalScale * finalScale}px` }}>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.6
                                )
                              )}
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'collage':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3" style={{ gap: `${style.spacing.dishGap * 0.8 * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize * 0.85, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const rotateDeg = (index % 3 - 1) * 2;
                      
                      return (
                        <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow p-2" style={{ padding: `${8 * optimalScale * finalScale}px`, transform: `rotate(${rotateDeg}deg)` }}>
                          {dish.image && dish.image.trim() !== '' && (
                            <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 mb-2" style={{ height: `${96 * optimalScale * finalScale}px`, marginBottom: `${8 * optimalScale * finalScale}px` }}>
                              {renderDishImage(dish)}
                            </div>
                          )}
                          <div className="text-center">
                            <div className="font-medium" style={nameStyle}>{dish.name}</div>
                            <div className="mt-1" style={{ marginTop: `${4 * optimalScale * finalScale}px` }}>
                              <span className="font-semibold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'newspaper':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b-2 flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.5 * optimalScale * finalScale}px`,
                    borderColor: style.textColor,
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-8" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.75, style.textColor + '99', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="flex flex-col border-b border-dashed pb-4" style={{ paddingBottom: `${16 * optimalScale * finalScale}px` }}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-bold" style={nameStyle}>{dish.name}</div>
                              {dish.description && (
                                <div className="mt-1" style={descStyle}>
                                  {dish.description}
                                </div>
                              )}
                            </div>
                            <div className="ml-2" style={{ marginLeft: `${8 * optimalScale * finalScale}px` }}>
                              {dish.originalPrice && (
                                renderOriginalPrice(
                                  formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                  priceStyle,
                                  0.5
                                )
                              )}
                              <span className="font-bold" style={priceStyle}>
                                {formatPrice(dish.price, dish.priceString, dish.unit)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'tag':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="flex flex-wrap gap-3" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize * 0.9, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const colors = ['#FFF3CD', '#D1FAE5', '#DBEAFE', '#FCE7F3', '#FEF3C7', '#E0E7FF', '#FEE2E2', '#F0FDF4'];
                      const bgColor = colors[index % colors.length];
                      
                      return (
                        <div key={dish.id} className="px-4 py-3 rounded-lg shadow-sm" style={{ padding: `${12 * optimalScale * finalScale}px`, backgroundColor: bgColor }}>
                          <div className="font-medium text-center" style={nameStyle}>{dish.name}</div>
                          <div className="text-center mt-1" style={{ marginTop: `${4 * optimalScale * finalScale}px` }}>
                            <span className="font-semibold" style={priceStyle}>
                              {formatPrice(dish.price, dish.priceString, dish.unit)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'stack':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="space-y-4" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px` }}>
                    {category.dishes.map((dish, index) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.8, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      const offset = Math.min(index * 12, 48);
                      
                      return (
                        <div key={dish.id} className="relative">
                          <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100" style={{ padding: `${20 * optimalScale * finalScale}px`, marginLeft: `${offset * optimalScale * finalScale}px`, marginTop: index > 0 ? `-${8 * optimalScale * finalScale}px` : 0 }}>
                            <div className="flex items-center gap-4" style={{ gap: `${16 * optimalScale * finalScale}px` }}>
                              {dish.image && dish.image.trim() !== '' && (
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0" style={{ width: `${96 * optimalScale * finalScale}px`, height: `${96 * optimalScale * finalScale}px` }}>
                                  {renderDishImage(dish)}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-medium" style={nameStyle}>{dish.name}</div>
                                {dish.description && (
                                  <div className="mt-1" style={descStyle}>
                                    {dish.description}
                                  </div>
                                )}
                                <div className="flex items-baseline gap-2 mt-2" style={{ gap: `${8 * optimalScale * finalScale}px`, marginTop: `${8 * optimalScale * finalScale}px` }}>
                                  {dish.originalPrice && (
                                    renderOriginalPrice(
                                      formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                      priceStyle,
                                      0.6
                                    )
                                  )}
                                  <span className="font-semibold" style={priceStyle}>
                                    {formatPrice(dish.price, dish.priceString, dish.unit)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'diagonal':
        return (
          <div className="flex flex-col" style={{ gap: `${style.spacing.categoryGap * optimalScale * finalScale}px` }}>
            {categories.map((category) => (
              <div key={category.id}>
                <h2
                  className="font-semibold mb-4 pb-2 border-b flex items-center gap-2"
                  style={{
                    fontSize: `${style.fontSize * 1.2 * optimalScale * finalScale}px`,
                    borderColor: style.textColor + '30',
                    marginBottom: `${16 * optimalScale * finalScale}px`,
                    paddingBottom: `${8 * optimalScale * finalScale}px`}}
                >
                  {category.icon && (category.icon.startsWith('data:') || category.icon.startsWith('http') ? <img src={category.icon} alt="" className="w-6 h-6 rounded-full mr-2 object-cover" style={{ width: `${24 * optimalScale * finalScale}px`, height: `${24 * optimalScale * finalScale}px` }} /> : <span className="mr-2 text-lg">{category.icon}</span>)}
                  {category.name}
                </h2>

                {category.dishes.length === 0 ? (
                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>暂无菜品</p>
                ) : (
                  <div className="flex flex-col" style={{ gap: `${style.spacing.dishGap * optimalScale * finalScale}px`, transform: 'skewX(-3deg)' }}>
                    {category.dishes.map((dish) => {
                      const nameStyle = getTextStyle(dish.nameStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const priceStyle = getTextStyle(dish.priceStyle, style.fontFamily, style.fontSize, style.textColor, deviceConfig.scale * optimalScale, finalScale);
                      const descStyle = getTextStyle(dish.descriptionStyle, style.fontFamily, style.fontSize * 0.8, style.textColor + 'B3', deviceConfig.scale * optimalScale, finalScale);
                      
                      return (
                        <div key={dish.id} className="bg-white rounded-xl p-4 shadow-md border-l-4" style={{ padding: `${16 * optimalScale * finalScale}px`, borderColor: style.textColor + '30', transform: 'skewX(3deg)' }}>
                          <div className="flex items-center gap-4" style={{ gap: `${16 * optimalScale * finalScale}px` }}>
                            {dish.image && dish.image.trim() !== '' && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0" style={{ width: `${80 * optimalScale * finalScale}px`, height: `${80 * optimalScale * finalScale}px` }}>
                                {renderDishImage(dish)}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium" style={nameStyle}>{dish.name}</div>
                              {dish.description && (
                                <div className="mt-1" style={descStyle}>
                                  {dish.description}
                                </div>
                              )}
                              <div className="flex items-baseline gap-2 mt-2" style={{ gap: `${8 * optimalScale * finalScale}px`, marginTop: `${8 * optimalScale * finalScale}px` }}>
                                {dish.originalPrice && (
                                  renderOriginalPrice(
                                    formatPrice(dish.originalPrice, dish.originalPriceString, dish.unit),
                                    priceStyle,
                                    0.6
                                  )
                                )}
                                <span className="font-semibold" style={priceStyle}>
                                  {formatPrice(dish.price, dish.priceString, dish.unit)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );'''

# 读取原始文件
with open("/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 找到需要替换的部分
start_marker = "      case 'staircase':"
end_marker = "      case 'vertical':"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    print(f"Found start at {start_idx}, end at {end_idx}")
    # 替换这部分内容
    new_content = content[:start_idx] + correct_code + "\n\n" + content[end_idx:]
    
    # 写回文件
    with open("/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print("File successfully fixed!")
else:
    print("Couldn't find markers!")
    print(f"Start marker found: {start_idx != -1}")
    print(f"End marker found: {end_idx != -1}")
