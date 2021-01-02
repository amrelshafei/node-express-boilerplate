# Installing NginX Server

# 1. Update and install dependencies.

sudo apt-get update
sudo apt-get install nginx

# 2. Download the NginX virtual host configuration file for the NginX server.
#
#    listen 80 default_server;
#    listen [::]:80 default_server;
#    server_name amrelshafei.com www.amrelshafei.com;
#    location / {
#        proxy_pass http://localhost:5000;
#        proxy_http_version 1.1;
#        proxy_set_header Upgrade $http_upgrade;
#        proxy_set_header Connection 'upgrade';
#        proxy_set_header Host $host;
#        proxy_cache_bypass $http_upgrade;
#    }

cd /tmp
wget https://gist.githubusercontent.com/amrelshafei/d4d31b080911d17780c9b3f98c20a8ee/raw/32c8452db9113c66c8c8fc509f74168651c56880/reverse_proxy_ssl_nginx
sudo cp reverse_proxy_ssl_nginx /etc/nginx/sites-available/amrelshafei.com
sudo rm reverse_proxy_ssl_nginx

# 3. Enable the downloaded configurations for the NginX server and disable any 
#    default configurations (use absolute paths for creating symlinks).

sudo ln -sf /etc/nginx/sites-available/amrelshafei.com /etc/nginx/sites-enabled/amrelshafei.com
sudo rm /etc/nginx/sites-enabled/default

# 4. Test and start the NginX server.

sudo nginx -t
sudo service nginx start

# Stop the NginX server by running the following command:
# $ sudo service nginx stop
