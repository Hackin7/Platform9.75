#!/bin/bash
cd client
sudo npm start &
cd ../server
python3 main.py
sudo pkill react-scripts
