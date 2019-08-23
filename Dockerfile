from pandoc/latex:2.7.3

run apk add --update \
    nodejs \
    npm \
    ttf-liberation

run mkdir -p /usr/src/app

workdir /usr/src/app

copy package.json package.json
copy package-lock.json package-lock.json
run npm install --production

copy source source
copy templates templates

run mkdir /workdir
workdir /workdir

entrypoint ["/usr/src/app/source/cli.js"]
