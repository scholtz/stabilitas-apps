FROM scholtz2/ubuntu-dev-base:1.0.0-stable

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN npm fund
CMD [ "/bin/bash", "./run-ecb-oracle.sh" ]
COPY . .
#RUN npm run test