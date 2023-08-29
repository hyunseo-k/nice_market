# backend/Dockerfile
FROM node:14


WORKDIR /code
COPY package*.json /code/
RUN npm install
COPY ./backend /code/
EXPOSE 3000

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Use dockerize tool to wait for the database service

CMD ["sh", "-c", "./wait-for-it.sh database:3306 -- node index.js"]
