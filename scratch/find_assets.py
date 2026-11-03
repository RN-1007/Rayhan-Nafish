import os, re
pattern = re.compile(r'(/img/[^"\'\s>]+|/game/[^"\'\s>]+|/sounds/[^"\'\s>]+)')
found = set()
for root, dirs, files in os.walk('.'):
    if any(x in root for x in ['node_modules', '.next', '.git', 'scratch']): continue
    for f in files:
        if f.endswith(('.tsx', '.ts', '.jsx', '.json')):
            try:
                with open(os.path.join(root, f), 'r', encoding='utf-8') as fp:
                    for m in pattern.findall(fp.read()):
                        found.add((m, os.path.join(root, f)))
            except: pass
for path, src in sorted(found):
    print(f'{path} -> {src}')

