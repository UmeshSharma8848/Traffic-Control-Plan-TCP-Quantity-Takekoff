# Contributing

Thanks for taking a look. The most valuable contributions are corrections to the data.

## Reporting a wrong size

Open an issue with:

- the sign code (for example `W20-5a`)
- the size the tool shows and the size it should be
- the table you're reading from (for example "MUTCD 2009 Table 6F-1, conventional road column") or the agency standard sheet

Screenshots of the table help.

## Fixing data yourself

Sign data lives in `src/signs3.js`, one object per sign:

```js
{"c":"W20-1","n":"Road (Street) Work (with distance)","t":"W","sh":"dia",
 "conv":"36x36","ml":"","e":"48x48","f":"48x48","min":"30x30","ov":"",
 "note":"","src":"6F-1","ttc":true,"id":"W20-1"}
```

- `t` — type: `R` regulatory, `W` warning, `G` guide/detour, `S` school
- `sh` — shape: `rect`, `dia`, `oct`, `tri`, `circ`, `pen`, `pent`, `xbuck`
- sizes are `WxH` in inches, `SxSxS` for triangles, `48x48x36` for the pennant, `36d` for a circle
- `ttc` — true for work zone signs from Table 6F-1
- leave a size empty when the table has no size for that road type

Barricades, channelizing devices, lights and other devices are in `src/devices.js`. Sign faces are drawn in `src/faces3.js`.

After any edit, rebuild the single-file app:

```bash
cd src && python3 assemble.py
```

That regenerates `index.html`. Commit both the source change and the rebuilt `index.html`.

## Ground rules

- No build tooling, frameworks or npm dependencies. It stays one static HTML file that works offline
- Keep the tool honest: where a size is uncertain, mark it "verify" rather than guessing silently
- The MUTCD tables are the reference for sizes. State supplements belong in the notes field, not in place of the national size
