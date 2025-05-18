FROM node:18
WORKDIR /app
COPY ./keys ./keys
COPY server.js .
RUN npm init -y && npm install express body-parser
CMD ["node", "server.js"]
