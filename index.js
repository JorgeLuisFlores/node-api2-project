const express = require('express');

const server = express();

const commentRouter = require('./comments/commentRouter.js');
const postRouter = require('./posts/postRouter.js');

server.use(express.json());


server.use('/api/posts', postRouter);
server.use('/comments', commentRouter);

server.get('/api', (req, res) => {
    res.send(`
    <h2> API </h2>
    <p> Welcome to the API! </p>
  `);
});



server.listen(4000, () => {
    console.log('\n*** Server Running on http://localhost:4000 ***\n');
});