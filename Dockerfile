# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/app

ENV NODE_ENV=production

COPY ./packages/apps/api/dist/api.js ./api/dist
COPY ./packages/apps/api/package.json ./api

USER bun

ENTRYPOINT [ "bun", "run", "./api/dist/app.js" ]

# docker build . -t nestjs-bun-esm
# docker run -it -p 3000:3000 nestjs-bun-esm
# https://github.com/oven-sh/bun/tree/main/packages/bun-lambda