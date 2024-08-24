const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log(req.url);
    res.send('gool');
})

app.listen(3000, () => console.log('server is listing...'));