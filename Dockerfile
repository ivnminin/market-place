FROM node:18

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install

CMD /bin/sh start.sh