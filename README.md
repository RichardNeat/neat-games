## Hosted Version Link



## Project Summary

The purpose of this project was to build an API for the purpose of accessing application data programmatically. The idea was to mimic the building of a real world backend service which should provide this information to the front end architecture.

The database is PSQL and I am interacting with it using node-postgres.

If you wish to 'clone' this repo from Github you will need to install dependencies and seed the database.

## Install Dependencies

By default, 'npm install' will install all modules listed as dependencies in package.json. In this case this will install: 

"dotenv": "^16.0.0", "express": "^4.18.1", "pg": "^8.7.3" and "pg-format": "^1.0.4".

If you would like to run the tests contained in the test folder you will also need to install the following as devDependencies (npm install -D "jest" for example):

"husky": "^7.0.0", "jest": "^27.5.1", "jest-extended": "^2.0.0", "jest-sorted": "^1.0.14", "supertest": "^6.2.4".

"husky" is optional and is only relevant if you are wishing to run your tests before committing to gitHub, each time you attempt a commit.

## .env

Along with the node_modules the .env files have also been ignored and therefore if you clone this repo you will need to set these up yourself.
Create two files:
".env.development"
".env.test"
The development file should contain the text "PGDATABASE=nc_games" to connect to the main development database.
The test file should containt the text "PGDATABASE=nc_games_test" to connect to the test database.
add to your .gitignore file along with your node_modules:
".env.*"

## Version Requirements

In order to run this project the minimimum version requirements are as follows:

Node.js: "17.0.29"
Postgres: "Perl 5.8"