def check_brackets_debug(filename, start_line=1, end_line=None):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    if end_line is None:
        end_line = len(lines)
    
    stack = []
    brackets = {'(': ')', '[': ']', '{': '}'}
    
    print("=== Debugging bracket matching ===")
    
    for line_num in range(start_line - 1, end_line):
        line = lines[line_num]
        actual_line_num = line_num + 1
        for i, char in enumerate(line):
            if char in brackets:
                stack.append((char, actual_line_num, i))
                print(f"+ Line {actual_line_num}: Found '{char}' at position {i} - Stack: {[s[0] for s in stack]}")
            elif char in brackets.values():
                if not stack:
                    print(f"\nERROR: Unmatched closing bracket '{char}' at line {actual_line_num}, position {i}")
                    return False
                last_open, last_line, last_pos = stack.pop()
                if brackets[last_open] != char:
                    print(f"\nERROR: Mismatched brackets at line {actual_line_num}, position {i}")
                    print(f"  Expected '{brackets[last_open]}' for '{last_open}' at line {last_line}, position {last_pos}")
                    print(f"  Got '{char}'")
                    print(f"  Stack now: {[s[0] for s in stack]}")
                    return False
                print(f"- Line {actual_line_num}: Found '{char}' at position {i} - Stack: {[s[0] for s in stack]}")
    
    print("\n=== Final check ===")
    if stack:
        print(f"ERROR: Unclosed brackets found: {len(stack)} items")
        for open_bracket, line_num, pos in stack:
            print(f"  '{open_bracket}' at line {line_num}, position {pos}")
        return False
    else:
        print("SUCCESS: All brackets are balanced!")
        return True

# Check the critical area
print("\n===== Checking from line 1620 to 1690 =====")
check_brackets_debug('/Users/menmingfeng/Documents/菜单设计网站/src/components/preview/PreviewCanvas.tsx', 1620, 1690)
