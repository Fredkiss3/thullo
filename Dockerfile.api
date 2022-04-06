FROM node:16-alpine

# Build time args to be passed as env variables
ARG MONGO_URI
ARG ISSUER_BASE_URL
ARG OAUTH_CLIENT_ID
ARG OAUTH_REDIRECT_URI
ARG UNSPLASH_API_KEY
ARG OAUTH_CLIENT_SECRET
ARG JWT_SECRET
ARG CLOUDINARY_URL
ARG CLOUDINARY_ASSET_URL

# ENV variables

# With default values
ENV ALLOWED_URLS=https://thullo.fredkiss.dev,https://thullo-front.netlify.app
ENV PORT=80

# should be specified
ENV MONGO_URI=$MONGO_URI
ENV OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID
ENV ISSUER_BASE_URL=$ISSUER_BASE_URL
ENV OAUTH_REDIRECT_URI=$OAUTH_REDIRECT_URI
ENV OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET
ENV JWT_SECRET=$JWT_SECRET
ENV UNSPLASH_API_KEY=$UNSPLASH_API_KEY
ENV CLOUDINARY_URL=$CLOUDINARY_URL
ENV CLOUDINARY_ASSET_URL=$CLOUDINARY_ASSET_URL

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

RUN pnpm install --prefix packages/express  --shamefully-hoist \
    && pnpm --prefix packages/express run build 

ENV NODE_ENV production

CMD [ "pnpm", "run", "start", "--prefix", "packages/express" ]