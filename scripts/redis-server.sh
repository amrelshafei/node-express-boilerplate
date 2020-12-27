# Installing Redis
# References: https://redis.io/topics/quickstart#installing-redis
#             https://gist.github.com/FUT/7db4608e4b8ee8423f31#file-install-redis-sh

# 1. Update and install installation dependencies

sudo apt-get update
sudo apt-get install gcc make

# 2. Download the latest Redis tar ball from the redis.io and make it

cd /tmp
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
sudo make install

# 3. Create installation directories and redis configuration file

sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo cp redis.conf /etc/redis/6379.conf
sudo mkdir /var/redis/6379
sudo vi /etc/redis/6379.conf
    bind 127.0.0.1
    port 6379
    daemonize yes
    pidfile /var/run/redis_6379.pid
    logfile /var/log/redis_6379.log
    dir /var/redis/6379

# 4. Create and setup the init script

sudo cp utils/redis_init_script /etc/init.d/redis_6379
sudo vi /etc/init.d/redis_6379
    REDISPORT=6379

# 5. Add the created Redis init script to all the default runlevels in order to 
#    start and stop Redis as a daemon service

sudo update-rc.d /etc/init.d/redis_6379 defaults

# 6. Start redis by running one of the following commands (prefereably the 
#    second command):

sudo service redis_6379 start
sudo /etc/init.d/redis_6379 start

# 6. Stop redis by running one of the following commands according to the 
#    previous start command:

sudo service redis_6379 stop
sudo /etc/init.d/redis_6379 stop

