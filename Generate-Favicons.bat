@echo off
echo ============================================
echo  RareGh0st Favicon Generator
echo ============================================
echo.
echo Generating favicons from public\logo.png...
echo.

python -m pip install Pillow --quiet --break-system-packages 2>nul
python -c "
from PIL import Image
import os
src = 'public/logo.png'
if not os.path.exists(src):
    print('ERROR: public/logo.png not found!')
    exit(1)
img = Image.open(src).convert('RGBA')
sizes = {'favicon-16.png':16,'favicon-32.png':32,'apple-touch-icon.png':180,'icon-192.png':192,'icon-512.png':512}
for name, s in sizes.items():
    img.resize((s,s), Image.LANCZOS).save(f'public/{name}')
    print(f'  Created public/{name} ({s}x{s})')
print()
print('All favicons generated!')
"
echo.
pause
