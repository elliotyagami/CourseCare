import models from './../models'

export const postAdd = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        models.Post.create({
            title: req.body.postTitle.trim(),
            description: req.body.postArea.trim(),
            creatorId: req.user.id,
            courseId: req.cookies.CourseId
        }).then(post => {
            if(post){
                res.status(201).json({status: "successfully created !"})
            }
        })
    } else {
        res.status(403).json({status: "User not authenticated"})
    }
}
