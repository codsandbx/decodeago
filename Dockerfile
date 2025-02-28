FROM node:slim

WORKDIR /app

COPY . .

EXPOSE 3000

RUN apt update -y &&\
    chmod +x index_decode.js &&\
    npm install 
    
CMD ["node", "index_decode.js"]