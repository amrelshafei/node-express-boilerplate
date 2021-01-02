# Downloading and deploying production build.

# 1. Update and install dependencies; Node, NginX, and PM2.
#    Reference: https://github.com/nodesource/distributions#installation-instructions

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# 2. Download and install the server.

cd /tmp
git clone https://github.com/amrelshafei/node-express-boilerplate.git
sudo rm -rf $HOME/server
sudo cp -r node-express-boilerplate $HOME/server
sudo rm -r node-express-boilerplate
cd $HOME/server
sudo npm install

# 4. Download and build static files.

cd /tmp
npx create-react-app my-app
cd my-app
sudo npm install
npm run build
sudo rm -rf $HOME/server/client
sudo cp -r ./build $HOME/server/client
cd ..
sudo rm -r my-app

# 4. Run the server as a daemon.

cd $HOME/server
npm run daemon
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu # For this setup PM2 is globally located at /usr/lib/node_modules.
