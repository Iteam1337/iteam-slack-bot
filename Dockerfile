FROM node
ADD . /app
WORKDIR /app
RUN rm -rf node_modules
RUN npm install --production
CMD node bot.js