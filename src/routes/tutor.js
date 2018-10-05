import express from 'express'
import { addCourse } from './../controllers/tutor'


let router = express.Router()

router.post('/addcourse', addCourse)

export default router
