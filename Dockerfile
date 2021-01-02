# Setting the base image to the latest version of Ubuntu.
FROM ubuntu
# Defining the network port that any container running from this image will 
# listen to.
EXPOSE 5000
# Setting up the latest version of Node.
RUN sudo apt-get update
RUN curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
# Setting the working directory for any subsequent ADD, COPY, CMD, ENTRYPOINT, 
# or RUN instructions.
WORKDIR /app
# Setting the PATH directory that will have all the installed dependencies in 
# the docker container. 
ENV PATH ./node_modules/.bin:$PATH
# Setting up the project dependencies.
COPY package.json .
COPY package-lock.json .
RUN npm install
# Copying all the project files and directories that are not included in the 
# .dockerignore file.
COPY . .
# Installing a production-ready version of the client.

# Providing the default command for executing the container
CMD ["npm", "start"]
