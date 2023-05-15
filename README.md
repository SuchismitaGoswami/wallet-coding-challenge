

## Description

*Wallet Coding Challenge*


## Developer Guide

### Installing Dependencies

```bash
$ npm install
```

## Running the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Testing the application

```bash
# unit tests
$ npm run test:unit

# Unit Test Coverage
$ npm run unit-test:cov

# e2e tests
$ npm run test:e2e

```

## Setup application 

```
docker-compose up -d
```
### Access the api
Please use the below server url to access the api server 

```
curl --location --request POST 'localhost:3000/wallet' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test",
    "balance": 125
}'

```

## License

The project is [MIT licensed](LICENSE).
