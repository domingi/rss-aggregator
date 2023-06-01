develop:
		npx webpack serve

install:
		npm ci

build:
		NODE_ENV=prodaction npx webpack

test:
		npm test

lint:
		npx eslint .