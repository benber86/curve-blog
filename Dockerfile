FROM peaceiris/hugo:v0.122.0-mod

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app
COPY . /app

RUN npm install
RUN hugo --minify --gc -d public