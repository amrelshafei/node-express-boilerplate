# Install Node and npm 
# https://github.com/nodesource/distributions#installation-instructions

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo /etc/init.d/redis_6379 stop
sudo npm install pm2 -g
cd my-web-api
pm2 start src/index.js
pm2 logs # make sure the program started with no errors
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo apt-get install nginx
sudo vi /etc/nginx/sites-available/default
    server_name api.amrelshafei.com;
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
