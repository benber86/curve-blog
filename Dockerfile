FROM peaceiris/hugo:v0.122.0-mod

WORKDIR /app
COPY . /app
RUN npm install
RUN hugo --minify --gc -d public