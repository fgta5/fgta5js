#!/bin/bash


rm ./dist/*
npx rollup -c rollup-fgta5js.mjs
# npx rollup -c rollup-demo-crud.js
# npx rollup -c rollup-demo-appmanager.js

