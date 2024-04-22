FROM node:latest AS builder

WORKDIR /client

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /client/dist/e-commerce-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g", "daemon off;"]
