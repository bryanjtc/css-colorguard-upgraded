#!/bin/bash

# Navigate to the dist directory
cd dist

# Replace "fs/promises" with "fs-extra" in index.cjs
sed -i 's/"fs\/promises"/"fs-extra"/g' index.cjs
