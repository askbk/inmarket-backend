const app = require('./app.js');
const http = require('http').Server(app);
const port = 80;

http.listen(port, () => {
    console.log(
        'listening on port ' + port + ' at ' + new Date().toTimeString()
    );
});
