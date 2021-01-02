# Installing Redis Server
#
# References: https://redis.io/topics/quickstart#installing-redis
#             https://gist.github.com/FUT/7db4608e4b8ee8423f31#file-install-redis-sh

# 1. Update and install installation dependencies.

sudo apt-get update
sudo apt-get install gcc make

# 2. Create installation directories for Redis. Also, deletes these directories 
#    and its contents pre-installation if they exist.

sudo rm -rf /etc/redis
sudo rm -rf /var/redis
sudo rm -rf /var/redis/6379
sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo mkdir /var/redis/6379

# 3. Download the latest Redis tar ball from the redis.io and make it.

cd /tmp
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
sudo rm redis-stable.tar.gz
cd redis-stable
sudo make install

# 4. Create and setup the init script. Make sure the value for REDISPORT on line 
#    14 is set to 6379.

sudo rm -f /etc/init.d/redis_6379
sudo cp utils/redis_init_script /etc/init.d/redis_6379

# 5. Create and setup the Redis configuration file. Downloads a modified version 
#    of redis-stable/redis.conf with the following configuration changes: 
#
#    bind 127.0.0.1
#    port 6379
#    daemonize yes
#    pidfile /var/run/redis_6379.pid
#    logfile /var/log/redis_6379.log
#    dir /var/redis/6379.

cd /tmp
sudo rm -r redis-stable
wget https://gist.githubusercontent.com/amrelshafei/6571f17a2bab887bf9a2cc8ef4be432c/raw/45111bc7e8a6af6ab03fe8574c1a4721f048aa96/redis_6379.conf
sudo cp redis_6379.conf /etc/redis/6379.conf
sudo rm redis_6379.conf

# 6. Add the created Redis init script to all the default runlevels in order to 
#    start and stop Redis as a daemon service.

sudo update-rc.d redis_6379 defaults

# 7. Start the Redis server by running the following command:

sudo /etc/init.d/redis_6379 start

# Stop the Redis server by running the following command:
# $ sudo /etc/init.d/redis_6379 stop
