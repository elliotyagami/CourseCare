export const whiteboard = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr",{userData: req.user, type: 'whiteboard',layout: 'empty.handlebars'})
    } else {
        res.render("")
    }
}

export const addCourseTemplate = (req, res) => {
    if (req.isAuthenticated() && req.user.role ==  "tutor") {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr",{userData: req.user, type: 'add-course', layout: 'empty.handlebars'})
    } else {
        res.render("")
    }
}

export const registerCourseTemplate = (req, res) => {
    if (req.isAuthenticated() && req.user.role ==  "student") {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr",{userData: req.user, type: 'register-course', layout: 'empty.handlebars', courseId: req.params.id})
    } else {
        res.render("")
    }
}


export const discussion = (req, res) => {
    if (req.isAuthenticated()) {
        // res.redirect(`/${req.user.type}/whiteboard`)
        res.render("xhr",{layout: 'empty.handlebars', "posts": [
            {
                "authorpic": "/images/avatar/jenny.jpg",
                "authorname": "Jenny",
                "title": "Random text",
                "time": "3 days ago",
                "description": "Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.",
                "likecount": "5",
                "comments": [
                    {
                        "author": "Matt",
                        "pic": "/images/avatar/matthew.png",
                        "text": "How artistic!",
                        "time": "Today at 5:42PM",
                        "comments": [
                            {
                                "author": "Elliot Fu",
                                "pic": "/images/avatar/matthew.png",
                                "text": "This has been very useful for my research. Thanks as well!",
                                "time": "Yesterday at 12:30AM",
                                "comments" : []
                            }
                        ]
                    },
                    {
                        "author": "Matt",
                        "pic": "/images/avatar/matthew.png",
                        "text": "How artistic!",
                        "time": "Today at 5:42PM",
                        "comments" : []
                    }
                ]
            }
        ], type: 'discussion'})
    } else {
        res.render("")
    }
}
