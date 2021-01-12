# build
FROM node:lts-alpine AS builder
WORKDIR /tmp/app
COPY ./package.json /tmp/app/package.json
RUN yarn install
# __BUILD_ENV__ is defined in your .gitlab-ci.yml or Github Action files.
ARG BUILD_ENV=__BUILD_ENV__
COPY . /tmp/app
RUN npm run build:${BUILD_ENV}

# nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/
COPY --from=builder /tmp/app/dist /usr/share/nginx/html/
EXPOSE 80