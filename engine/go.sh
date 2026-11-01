#!/bin/bash
# usage: go.sh NN "Title" DUR   → /home/claude/ownpace-videos/NN. Title.mp4 (fast renderer, medium preset)
cd /home/claude/rat-race
PRESET=medium node rf.cjs v$1.html "/home/claude/ownpace-videos/$1. $2.mp4" sound$1.wav $3 > render$1.log 2>&1
tail -2 render$1.log
