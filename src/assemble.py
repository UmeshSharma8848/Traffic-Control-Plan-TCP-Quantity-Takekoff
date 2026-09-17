#!/usr/bin/env python3
"""Build ../index.html from the source files in this folder.

Usage:  python3 assemble.py
"""
from pathlib import Path

here = Path(__file__).parent
out = here.parent / "index.html"

css = (here / "app.css").read_text()
body = (here / "body.html").read_text()
js = "\n".join((here / f).read_text() for f in
               ["signs3.js", "faces3.js", "devices.js", "app.js"])

head = ('<title>Work Zone Sign SF Finder</title>\n'
        '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
        'family=Overpass:wght@400;600;700;800&family=Overpass+Mono:wght@400;600&display=swap">\n'
        '<style>\n' + css + '</style>\n')

scripts = ('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n'
           '<script>\n' + js + '\n</script>\n')

page = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="description" content="Look up MUTCD sign sizes and square footage, '
        'sort signs into pay ranges, and build work zone quantity summaries with barricades, '
        'channelizing devices and warning lights.">\n'
        + head + '</head>\n<body>\n' + body + scripts + '</body>\n</html>\n')

out.write_text(page)
print(f"wrote {out} ({len(page):,} bytes)")
