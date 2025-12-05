FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

ENV HOST=0.0.0.0
ENV PORT=5173
ENV VITE_API_BASE=https://tvertask.onrender.com

CMD ["npm", "run", "dev"]