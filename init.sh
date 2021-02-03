#!/bin/bash
echo "Installing dependencies..."
cd ./web && npm install && cd ..
cd ./electron && npm install && cd ..
echo "Dependencies installed. Have fun"
