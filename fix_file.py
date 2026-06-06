
with open("/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx", "rb") as f:
    content = f.read()

# 查找那一行的位置，从第 1810 行到 1830 行
lines = content.split(b"\n")

print("Checking lines 1810-1840:")
for i in range(1809, 1840):
    print(f"Line {i+1}: {lines[i]!r}")

# 找到有问题的字节并替换
# 我们需要把那些奇怪的字节替换成"暂无菜品"
fixed_lines = []
for line in lines:
    if b"346 232 202" not in str(line):
        # 查找可能包含乱码的行
        if b"\xe6\x9a\x82\xe6\x97\xa0\xe8\x8f\x9c\xe5\x93\x81" not in line:
            # 检查是否有乱码模式
            if b"\xb6\xa0\xe4\xba\x8c" in line or b"\xe6\x9a" in line:
                print(f"Found problematic line: {line!r}")
                # 替换为正确的中文
                fixed_line = line.replace(line, b'                  <p className="text-sm text-gray-400" style={{ fontSize: `${14 * optimalScale * finalScale}px` }}>\u6682\u65e0\u83dc\u54c1</p>')
                fixed_lines.append(fixed_line)
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
    else:
        fixed_lines.append(line)

fixed_content = b"\n".join(fixed_lines)

with open("/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx", "wb") as f:
    f.write(fixed_content)

print("File fixed!")
