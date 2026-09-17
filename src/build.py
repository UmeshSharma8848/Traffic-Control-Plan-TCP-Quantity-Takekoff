#!/usr/bin/env python3
"""Regenerate signs3.js from the MUTCD table CSVs.

Reads t2b1.csv, t2c2.csv, t7b1.csv and tguide.csv (transcriptions of MUTCD 2009
Tables 2B-1, 2C-2, 7B-1, 9B-1 and 2D-2) plus the Table 6F-1 work zone list, and
writes signs3.js. The CSVs are not committed — most corrections are easier to
make directly in signs3.js.
"""
import re, json
def js_arrays(path):
    txt=open(path).read()
    body=txt[txt.index('const SIGNS = [')+len('const SIGNS = ['):txt.rindex('];')]
    return json.loads('['+body.strip().rstrip(',')+']')
old=js_arrays('../data2.js')
ML={"R1-1":"36x36","R2-1":"30x36","R3-1":"36x36","R3-2":"36x36","R3-3":"36x36","R3-4":"36x36","R3-18":"36x36","R3-27":"36x36","R3-7":"36x36","R5-1":"36x36","R5-1a":"42x30","R6-1":"54x18","R6-2":"30x36"}
OV={"R1-1":"48x48","R2-1":"30x36","R5-1":"36x36","R5-1a":"42x30","R6-1":"54x18","R6-2":"36x48"}
TYP={'R':'R','W':'W','G':'G','S':'S'}
signs=[]; seen=set()
for c,n,t,sh,conv,fwy,mn,note in old:
    paddle='paddle' in n
    o=dict(c=c,n=n,t=t,sh=sh,conv=conv,ml='' if paddle else ML.get(c,''),e='' if paddle else fwy,f='' if paddle else fwy,min=mn,ov='',note=note.replace('Larger multi-lane size (Table 2B-1)','').strip(),src='6F-1',ttc=True)
    if c=='R1-1' and not paddle: o['e']='36x36'; o['note']='Not used on freeways'
    if c=='R2-1': o['f']='48x60'
    signs.append(o); seen.add(c)
def expand(desig):
    toks=desig.split()
    first=toks[0]; m=re.match(r'^([A-Z]+)(\d+)-(.*)$',first)
    out=[first]
    for t in toks[1:]:
        if re.match(r'^[A-Z]+\d',t): out.append(t)
        elif '-' in t: out.append(m.group(1)+t)
        else: out.append(f"{m.group(1)}{m.group(2)}-{t}")
    return out
def clean(s):
    s=s.strip().replace(' ','').replace('*','')
    return '' if s in ('-','') or 'aries' in s else s
RECTW={'W1-6','W1-7','W1-8','W7-4','W7-4b','W7-4c','W8-19','W9-7','W12-2a','W13-2','W13-3','W13-6','W13-7','W14-1a','W14-2a','W19-1','W19-2','W19-5','W25-1','W25-2','W11-12P'}
def shape_for(code,conv):
    if code.startswith('R15-1'): return 'xbuck'
    if code=='S1-1': return 'pent'
    if code in('S3-1','S3-2','S4-5','S4-5a'): return 'dia'
    w,h=(conv.split('x')+[''])[:2]
    if code[0]=='W' and w==h and not code.endswith('P') and code not in RECTW: return 'dia'
    return 'rect'
for f,src in [('t2b1.csv','2B-1'),('t2c2.csv','2C-2'),('t7b1.csv','7B-1'),('tguide.csv','9B-1 / 2D')]:
    for line in open(f):
        line=line.strip()
        if not line: continue
        p=line.split(',')
        des,name=p[0],p[1]
        conv,ml,e,fw,mn,ov=[clean(x) for x in p[2:8]]
        if not conv: conv = ml or e or fw
        if not conv: continue
        codes=expand(des)
        for code in codes:
            if code in seen: continue
            seen.add(code)
            pre=re.match(r'^[A-Z]+',code).group(0)
            t={'R':'R','W':'W','OM':'W','S':'S'}.get(pre,'G')
            note=''
            if src=='9B-1 / 2D' and pre=='M' and code[:3] in('M1-','M2-','M3-','M4-','M5-','M6-') and code not in('M1-8','M1-8a','M1-9') and not code.startswith('M5-2') and not (code.startswith('M6') and name.startswith('Bicycle')): note='Size from Table 2D-2 — verify'
            if code.startswith('W10-2') or code.startswith('W10-3') or code.startswith('W10-4') or code=='W10-5': note='Size from Table 8B-1 — verify'
            if len(codes)>1: note=(note+' · ' if note else '')+'Same size as '+', '.join(x for x in codes if x!=code)
            signs.append(dict(c=code,n=name,t=t,sh=shape_for(code,conv),conv=conv,ml='' if ml==conv else ml,e=e,f=fw,min=mn,ov=ov,note=note,src=src,ttc=False))
# ids
cnt={}
for s in signs:
    k=s['c']; cnt[k]=cnt.get(k,0)+1
    s['id']=k if cnt[k]==1 else f"{k}~{cnt[k]}"
open('signs3.js','w').write('const SIGNS = '+json.dumps(signs,separators=(',',':'))+';\n')
print(len(signs), sum(1 for s in signs if s['ttc']))
import collections; print(collections.Counter(s['t'] for s in signs), collections.Counter(s['sh'] for s in signs))
