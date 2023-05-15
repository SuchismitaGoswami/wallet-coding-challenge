
###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json ./
RUN npm ci

# COPY source code
COPY --chown=node:node . .

# build the project
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

# ###################
# # PRODUCTION
# ###################

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
EXPOSE 3000
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
