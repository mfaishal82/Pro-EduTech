const express = require('express')
const { home, register, postRegister, login, postLogin, landing, addProfile, profile, postProfile, editForm, postEdit, addCourseForm, postCourse, deleteCourse, changeToFalse, incrRate, decrRate, logout, getInvoice, userCourseList } = require('../Controllers/controller')
const { isLoggedIn, isAdmin } = require('../Middlewares/middleware')
const router = express.Router()

//home
router.get('/', landing)

//login
router.get('/login', login)
router.post('/login', postLogin)

//registr
router.get('/register', register)
router.post('/register', postRegister)

//middleware

router.use(isLoggedIn)

//read cousres
router.get('/courses', home)

router.get('/takeCourse/:id', changeToFalse)



//add courses
router.get('/addCourse', isAdmin, addCourseForm)
router.post('/addCourse', isAdmin, postCourse)

router.get('/addRate/:id', incrRate)
router.get('/decreaseRate/:id', decrRate)

router.get('/listUserCourse', isAdmin, userCourseList)

//delete course
router.get('/deleteCourse/:id', isAdmin, deleteCourse)

//read profile
router.get('/profile', profile)
router.get('/profile/getInvoice', getInvoice)

//add profile
router.get('/addProfile', addProfile)
router.post('/addProfile', postProfile)

//edit profile
router.get('/editProfile/:id', editForm)
router.post('/editProfile/:id', postEdit)

router.get('/logout', logout)

module.exports = router