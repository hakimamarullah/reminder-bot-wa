FROM node:20-alpine AS development

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node


FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./


COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Set NODE_ENV environment variable
ENV NODE_ENV production


RUN npm ci --omit=dev && npm cache clean --force


###################
# PRODUCTION
###################

FROM node:20-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules


USER node

CMD [ "node", "main.js" ]