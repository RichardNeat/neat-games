const app = require('./app');
const { PORT = 3091 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));