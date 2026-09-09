FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npx", "prisma", "db", "push", "&&", "npm", "run", "dev"]
