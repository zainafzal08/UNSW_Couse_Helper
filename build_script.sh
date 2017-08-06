#!/bin/bash
cd my-app
npm run build
cd ..
rm -r prod-server
cp -r base-server prod-server
mv my-app/build/index.html prod-server/templates/
mv my-app/build/* prod-server/
cd prod-server
python main.py
