const app = require('./app.js');
const { PORT = 3091 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));