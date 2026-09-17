# Source files

`index.html` in the repository root is generated from these files. Edit here, then run:

```bash
python3 assemble.py
```

- `signs3.js` — sign data (513 signs)
- `devices.js` — barricades, channelizing devices, warning lights, other devices
- `faces3.js` — sign legends and the SVG sign-face drawing code
- `app.js` — application logic (search, quantities, summary, Excel export, storage)
- `app.css` — styles, including the light and dark themes
- `body.html` — page markup
- `assemble.py` — builds `../index.html`
- `build.py` — regenerates `signs3.js` from the MUTCD table CSVs (the CSVs are not committed; see the script header)

There is no build system beyond `assemble.py`, and no dependencies. The published page loads two things from a CDN: Google Fonts and SheetJS for the Excel export. Everything else is inline.
