#!/usr/bin/env python3

with open('frontend/reports.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find buildMetricsInterpretation closing and remove everything until 'async function viewReport'
# We're looking for the pattern: closing backtick and brace, followed by orphaned code, 
# then VIEW REPORT comment

import re

# Pattern: Match the closing of buildMetricsInterpretation and everything until async function viewReport
pattern = r'(            `;\n        \})\n            destroyDashboardCharts\(\);[\s\S]*?(        // ===== VIEW REPORT =====)'

replacement = r'\1\n\n\2'

content_fixed = re.sub(pattern, replacement, content)

if content != content_fixed:
    print("Found and removed orphaned code")
    with open('frontend/reports.html', 'w', encoding='utf-8') as f:
        f.write(content_fixed)
    print("File cleaned successfully!")
else:
    print("Pattern not found, trying alternative pattern...")
    # Try with less specific pattern
    pattern2 = r'(\n        \})\s*destroyDashboardCharts\(\);[\s\S]*?(// ===== VIEW REPORT =====)'
    replacement2 = r'\1\n\n        \2'
    content_fixed2 = re.sub(pattern2, replacement2, content)
    
    if content != content_fixed2:
        with open('frontend/reports.html', 'w', encoding='utf-8') as f:
            f.write(content_fixed2)
        print("File cleaned with alternative pattern!")
    else:
        print("Could not find pattern to remove")
