import re

files = [
    'app/about/page.tsx',
    'app/projects/page.tsx',
    'app/skills/page.tsx',
    'app/contact/page.tsx',
    'app/page.tsx',
    'components/layout/Navbar.tsx',
    'components/BackgroundMusic.tsx',
    'components/CalendarWidget.tsx'
]

pattern = re.compile(r'[\'\"`](/(?:img|sounds|game)/[^\'\"`\s]+)[\'\"`]')
for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            matches = set(pattern.findall(content))
            print(f'=== {file} ===')
            for m in sorted(matches):
                print('  ', m)
    except Exception as e:
        print(f'Error reading {file}: {e}')

