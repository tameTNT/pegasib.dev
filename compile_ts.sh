#!/bin/bash

for file in *.ts; do
  deno bundle -o "${file%%.*}.js" "$file"
done