import {test} from 'node:test';import assert from 'node:assert/strict';import {handControl} from './public/core.js';
test('missing hand produces no control',()=>assert.equal(handControl([]),null));
test('pinch uses palm-relative distance and clamps zoom',()=>{const p=Array.from({length:21},()=>({x:.5,y:.5}));p[0]={x:.5,y:.9};p[9]={x:.5,y:.5};p[4]={x:.51,y:.5};p[8]={x:.52,y:.5};const r=handControl(p);assert.equal(r.pinching,true);assert.ok(r.zoom>=3.3&&r.zoom<=9)});
