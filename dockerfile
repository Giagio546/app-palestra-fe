FROM node:18-alpine
WORKDIR /app
RUN apk --no-cache add git
ARG FRONTEND_REPO_URL=https://github.com/Giagio546/app-palestra-fe
RUN git clone ${FRONTEND_REPO_URL} .
RUN npm install -g npm@latest
RUN npm install --userconfig .npmrc
RUN npm run build
EXPOSE 4200
CMD ["npm", "start"]