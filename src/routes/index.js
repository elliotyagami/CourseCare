import express from 'express'
let router = express.Router();
import student from './students'
import tutor from './tutors'
import {registerUser, register} from './../controllers'

router.get('/', (req,res)=>{
    res.status(200).json({ "status": "running" });
})

router.get('/:role/register', register)
router.post('/:role/register', registerUser)

router.get('/tutor', tutor)

router.get('/student',student)

export default router
