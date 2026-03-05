#!/usr/bin/env python3
import re

# Read the file
with open('frontend/reports.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove orphaned code between buildMetricsInterpretation closing and viewReport
# The orphaned code starts with 'destroyDashboardCharts();' after the closing brace
pattern = r'(\})\s{8,}destroyDashboardCharts\(\);.*?(// ===== VIEW REPORT ===== )'
replacement = r'\1\n\n        \2'

content_fixed = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open('frontend/reports.html', 'w', encoding='utf-8') as f:
    f.write(content_fixed)

print('File cleaned successfully!')
