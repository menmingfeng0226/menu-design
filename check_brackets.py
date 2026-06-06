def check_brackets(filename, start_line=1, end_line=None):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    if end_line is None:
        end_line = len(lines)
    
    stack = []
    brackets = {'(': ')', '[': ']', '{': '}'}
    
    for line_num in range(start_line - 1, end_line):
        line = lines[line_num]
        actual_line_num = line_num + 1
        for i, char in enumerate(line):
            if char in brackets:
                stack.append((char, actual_line_num, i, line.strip()))
            elif char in brackets.values():
                if not stack:
                    print(f"Error: Unmatched closing bracket '{char}' at line {actual_line_num}, position {i}")
                    print(f"Line content: {line.strip()}")
                    return False
                last_open, last_line, last_pos, last_line_content = stack.pop()
                if brackets[last_open] != char:
                    print(f"Error: Mismatched brackets at line {actual_line_num}, position {i}")
                    print(f"  Expected '{brackets[last_open]}' but got '{char}'")
                    print(f"  Opened at line {last_line}, position {last_pos}: {last_line_content}")
                    print(f"  Closed at line {actual_line_num}, position {i}: {line.strip()}")
                    return False
    
    if stack:
        print("Error: Unclosed brackets found:")
        for open_bracket, line_num, pos, line_content in stack:
            print(f"  '{open_bracket}' at line {line_num}, position {pos}: {line_content}")
        return False
    
    print("All brackets are balanced!")
    return True

# Check the problematic area more carefully
print("=== Checking brackets from line 1680 to 1820 ===")
check_brackets('/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx', 1680, 1820)

print("\n=== Checking brackets from line 1750 to 1870 ===")
check_brackets('/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx', 1750, 1870)

print("\n=== Checking entire switch statement ===")
check_brackets('/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx', 429, 2123)
