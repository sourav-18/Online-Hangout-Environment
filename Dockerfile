FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install 

COPY . .

EXPOSE 4015

CMD ["node", "index.js"]