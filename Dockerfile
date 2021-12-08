FROM node:16-alpine

WORKDIR /webapp

RUN apk add --update curl && rm -rf /var/cache/apk/*
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@6

COPY ./* ./
COPY ./packages/adapters ./packages/adapters
COPY ./packages/domain ./packages/domain
COPY ./packages/express ./packages/express


RUN pnpm install --prefix packages/domain  --shamefully-hoist \
    && pnpm --prefix packages/domain run build 

RUN pnpm install --prefix packages/adapters  --shamefully-hoist \
    && pnpm --prefix packages/adapters run build 

RUN pnpm --prefix packages/express run build 


CMD [ "pnpm", "run", "start", "--prefix", "packages/express" ]