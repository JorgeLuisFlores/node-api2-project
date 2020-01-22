const express = require('express');
const db = require('../data/db.js');
const router = express.Router();

router.get('/', (req, res) => {
    db.find(req.query)
        .then(db => {
            res.status(200).json(db);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the hubs',
            });
        });
});

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(db => {
            if (db) {
                res.status(200).json(db);
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'The post information could not be retrieved.',
            });
        });
});

router.post('/', (req, res) => {
    const postInfo = req.body;
    const {
        title,
        contents
    } = postInfo

    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post."
        })
        res.status(400).end()
    }

    db.insert(postInfo)
        .then(db => {
            res.status(201).json(db);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Here was an error while saving the post to the database.',
            })
            res.status(500).end();
        });
});

router.delete('/:id', (req, res) => {
    db.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({
                    message: 'Post has been deleted!'
                });
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'The post could not be removed.',
            })
            res.status(500).end();
        });
});

router.put('/:id', (req, res) => {
    const {
        id
    } = req.params;
    const changes = req.body;
    const {
        title,
        contents
    } = changes

    if (!title || !contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
        res.status(400).end();
    }

    db.update(id, changes)
        .then(db => {
            if (db) {
                res.status(200).json(db);
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'The post information could not be modified.',
            })
            res.status(500).end();
        });
});

router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await db.findPostComments(req.params.id);

        if (comments.length > 0) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'The comments information could not be retrieved.',
        });
    }
});

router.post('/:id/comments', async (req, res) => {
    const commentInfo = {
        ...req.body,
        post_id: req.params.id
    };

    const {
        text,
        id
    } = commentInfo


    if (!id) {
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        })
    }

    if (!text) {
        res.status(400).json({
            message: "Please provide text for the comment."
        })
        res.status(400).end();
    }

    try {
        const comment = await db.insertComment(commentInfo);
        res.status(201).json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'There was an error while saving the comment to the database.',
            err
        });
    }
})

module.exports = router;