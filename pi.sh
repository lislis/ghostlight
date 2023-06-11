#! bash

pm2 start app.js
cp frontend/app.py frontend/dist/app.py
cd frontend/dist/
pm2 start app.py --interpreter python3

echo "All done 👻"
