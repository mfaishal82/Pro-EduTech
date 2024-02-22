const { User, Category, Profile, Course } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { formatDate } = require('../helper/formatter')

class Controller{
    static landing(req, res){
        res.render('landingPage')
    }

    static register(req, res){
        res.render('registerForm')
    }

    static async postRegister(req, res){
        
        try {
            const { username, password, email } = req.body
            await User.create({username, password, email})
            res.redirect('/')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static login(req, res){
        res.render('loginForm')
    }

    static async postLogin(req, res){
        // console.log(req.session)
        try {
            const { username, password } = req.body

            let user = await User.findOne({
                where: {
                    username
                }
            })

            if(!user) {
                throw new Error('User is not found!')
            }

            let isVerified = bcrypt.compareSync(password, user.password)

            if(!isVerified){
                throw new Error('Password is incorrect')
            }

            req.session.UserId = user.id
            req.session.role = user.role

            res.redirect('/courses')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async home(req, res){
        const {deleted} = req.query
        try {
            let course = await Course.findAll({
                include: {
                    model: Category
                },
                where : {
                    availability : true
                },
                order : [['createdAt', 'asc']]
            })
            console.log(course)
            res.render('home', {course, deleted})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async profile(req, res){
        try {
            let id = req.session.UserId
            let profile = await Profile.findOne({
                include : {
                    model: User,
                    where: { id }
                }
            })
            let course = await Course.findAll({
                include: {
                    model: Category
                },
                where : {
                    availability : false
                },
                order : [['createdAt', 'asc']]
            })
            // console.log(profile)
            formatDate
            res.render('profile', {profile, formatDate, course})
        } catch (error) {
            console.log(error)
            res.send(error.message) 
        }
    }

    static async addProfile(req, res){
        try {
            res.render('addFormProfile')
        } catch (error) {
            console.log(error)
            res.send(error.message) 
        }
    }

    static async postProfile(req, res) {
        try {
            // console.log(req.body)
            const id = req.session.UserId
            const {firstName, lastName, dateOfBirth, gender} = req.body
            await Profile.create({firstName, lastName, dateOfBirth, gender, UserId: id}, {
                include: User
            })
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
            res.send(error.message) 
        }
    }

    static async editForm(req, res){
        const {id} = req.params
        try {
            let profile = await Profile.findByPk(id)
            // console.log(profile)
            res.render('editProfile', {profile})         
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async postEdit(req, res){
        const {id} = req.params
        try {
            const {firstName, lastName, dateOfBirth, gender} = req.body
            await Profile.update({firstName, lastName, dateOfBirth, gender}, {
                where: {id}
            })
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async addCourseForm(req, res){
        try {
            let category = await Category.findAll()
            res.render('addCourseForm', {category})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async postCourse(req, res){
        // console.log(req.body)
        try {
            
            const {name, description, imageURL, CategoryId} = req.body
            await Course.create({name, description, imageURL, CategoryId })
            res.redirect('/courses')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async deleteCourse(req, res){
        let {id} = req.params
        try {
            
            const deleted = await Course.findByPk(id)
            await Course.destroy({where: { id }})
            res.redirect(`/courses?deleted=${deleted.name}`)
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async changeToFalse(req, res) {
        const { id } = req.params
        try {
            await Course.update({availability: false}, {where : { id }})
            res.redirect('/courses')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async incrRate(req, res) {
        const { id } = req.params
        try {
            await Course.increment({rating: +1}, {where: { id }})
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async decrRate(req, res) {
        const { id } = req.params
        try {
            await Course.increment({rating: -1}, {where: { id }})
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static logout(req, res){
        try {
            req.session.destroy()

            res.redirect('/login')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }
}

module.exports = Controller