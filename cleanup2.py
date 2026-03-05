#!/usr/bin/env python3

# Read the file
with open('frontend/reports.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line number where "const chartOptions" starts without being in a function
# and where "// ===== VIEW REPORT =====" is
start_line = None
end_line = None

for i, line in enumerate(lines):
    if 'const chartOptions' in line and start_line is None:
        # Check if we're at the top level (this appears to be an orphaned const)
        if i > 0 and lines[i-1].strip() == '}':
            start_line = i - 1  # Include the closing brace before
    
    if '// ===== VIEW REPORT =====' in line and start_line is not None:
        end_line = i
        break

if start_line is not None and end_line is not None:
    print(f"Found orphaned code from line {start_line+1} to {end_line}")
    # Keep everything before start_line and after end_line
    new_lines = lines[:start_line+1] + ['\n', '        // ===== RENDER ADVANCED CHARTS =====\n'] + lines[end_line:]
    
    with open('frontend/reports.html', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print('File cleaned!')
else:
    print("Could not find the pattern to remove")
