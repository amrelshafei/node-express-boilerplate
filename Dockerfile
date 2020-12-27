FROM node:15.2.1
EXPOSE 5000
WORKDIR /app
ENV PATH ./node_modules/.bin:$PATH
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
