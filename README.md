## .env

The .env files should be ignored and therefore if you clone this repo you will need to set these up yourself.
Create two files:
".env.development"
".env.test"
The development file should contain the text "PGDATABASE=nc_games" to connect to the main development database.
The test file should containt the text "PGDATABASE=nc_games_test" to connect to the test database.
add to your .gitignore file along with your node_modules:
".env.*"