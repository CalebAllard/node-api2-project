const router = require('express').Router();
const db = require('../data/db');

router.get('/',(req,res) => {
    db.find()
    .then(resp => {
        
        res.status(200).json(resp);
    })
    .catch(err => {
        console.log(err);
        
    });
        
});

router.post('/', (req,res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post." })
    }else{
        db.insert(req.body)
        .then(resp => {
            db.findById(resp.id).then(post => {
                res.status(201).json(post);
            })


        })
        .catch(err => {
            res.status(500).json({error: "There was an error while saving the post to the database"})
        });
    }
});

router.post('/:id/comments', (req,res) => {
    const id = req.params.id;
    if(!req.body.text){
        res.status(400).json({errorMessage: "Please provide text for the comment."});
    }else{
        db.findById(id)
        .then(post => {
            db.insertComment(req.body)
            .then(resp => {
                db.findCommentById(resp.id)
                .then(ret => {
                    res.status(201).json(ret);
                })
            }).catch(err => {
                console.log(err);
                res.status(500).json({error: "There was an error while saving the comment to the database"});

            });
        }).catch(err => {
            res.status(404).json({essage: "The post with the specified ID does not exist."});
        });
    }
});


router.get('/:id/comments', (req,res) => {
    const id = req.params.id;
    db.findById(id)
    .then(post => {
        console.log(post);
        if(!post)
            throw(err);    
        db.findPostComments(id)
        .then(ret => {
            res.status(200).json(ret);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "The comments information could not be retrieved."})
        });
    }).catch(err => {
        console.log(err);
        res.status(404).json({ message: "The post with the specified ID does not exist."})
    })

});

router.get('/:id', (req,res) => {
    const { id } = req.params;
    db.findById(id).then(resp => {
        if(!resp)
        throw(err);  
        res.status(200).json(resp);  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "The post with the specified ID does not exist." });

    })
})

router.delete('/:id', (req,res) => {
    const { id } = req.params;
    db.findById(id)
    .then(post => {
        if (!post)
            throw(err);
        db.remove(id)
        .then(resp => {
                res.status(200).json(({resp}))
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "The post with the specified ID does not exist."});
        })
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: "The post could not be removed"});
    })


});

router.put('/:id', (req,res) => {
    const { id } = req.params;
    if(!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }else{
        db.findById(id)
        .then(post => {
            if (!post)
                throw(err);
            db.update(id,req.body)
            .then(resp => {
                db.findById(id)
                .then(post => {
                   
                    res.status(201).json(post);
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: "The post information could not be modified."})
            })
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({message: "The post with the specified ID does not exist."});
        })
    }
});



module.exports = router;