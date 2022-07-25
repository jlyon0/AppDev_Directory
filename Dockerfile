FROM node

# Anything related to my app will be in this directory
WORKDIR /app

#copy package.json into /app ( bc we set WORKDIR we can just use .)
COPY package.json .

#install dependencies
RUN npm install

# Copy the rest of files into container( copy current directory into working directory)
COPY . .

# for env variables
COPY next.config.js .

EXPOSE 3000

CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "dev-ssl"]
# CMD ["build", "run", "prod"]
