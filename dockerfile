FROM node:18-alpine
WORKDIR /app
RUN apk --no-cache add git
ARG FRONTEND_REPO_URL=https://github.com/Giagio546/app-palestra-fe
RUN git clone ${FRONTEND_REPO_URL} .
RUN npm install -g npm@latest
RUN rm -rf node_modules    
RUN rm package-lock.json   
RUN npm install
CMD npm start