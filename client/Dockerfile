FROM node:18
WORKDIR /app
COPY ./keys ./keys
COPY client.js .
RUN npm init -y && npm install axios
CMD ["node", "client.js"]
