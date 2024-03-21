# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/app

ENV NODE_ENV=production

COPY ./packages/server/dist/app.js ./server/dist
COPY ./packages/server/package.json ./server

USER bun

ENTRYPOINT [ "bun", "run", "./server/dist/app.js" ]

# docker build . -t nestjs-bun-esm
# docker run -it -p 3000:3000 nestjs-bun-esm