#!/bin/bash
echo "PORT="$PORT > .env
cd client && npm start & cd server && python3 main.py && pkill react-scripts
