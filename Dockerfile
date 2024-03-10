FROM peaceiris/hugo:v0.122.0-mod

WORKDIR /app
COPY . /app
RUN hugo -d public --minify --gc