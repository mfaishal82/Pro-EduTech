const { User, Category, Profile, Course, UserCourse } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const easyinvoice = require('easyinvoice')
const fs = require('fs')
const { formatDate } = require('../helper/formatter')

class Controller{

    static landing(req, res){
        res.render('landingPage')
    }

    static register(req, res){
        const {error} = req.query
        try {
            res.render('registerForm', {error})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async postRegister(req, res){
        
        try {
            const { username, password, email } = req.body
            await User.create({username, password, email})
            res.redirect('/')
        } catch (error) {
            console.log(error)
            if(error.name === 'SequelizeValidationError'){
                const msg = error.errors.map(each => each.message)
                res.redirect(`/register?error=${msg}`)
            } else {
                res.render(`errPage`, {error})
            }
        }
    }

    static login(req, res){
        const {error} = req.query
        try {
            res.render('loginForm', {error})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async postLogin(req, res){
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
            if(error.name === "SequelizeValidationError"){
                const msg = error.errors.map(each => each.message)
                res.redirect(`/login?error=${msg}`)
            } else {
                res.render(`errPage`, {error})
            }
        }
    }

    static async home(req, res){
        let id = req.session.UserId
        const {deleted, search, error} = req.query
        try {
            let options = {
                include: {
                    model: Category
                },
                // include: {
                //     model: UserCourse
                // },
                where : {
                    availability : true
                },
                order : [['createdAt', 'asc']]
            }

            if(search){
                options.where = {
                    name: {
                        [Op.iLike] : `%${search}%`
                    }
                }
            }

            let greeting = Course.greetUser()

            let category = await Category.findAll()

            // let test = await User.findAll({
            //     include: Course
            // })
            let course = await Course.findAll(options)
            // console.log(req.body)
            res.render('home', {course, deleted, search, error, id, greeting, category})
            // res.send(test)
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
            res.render('profile', {profile, formatDate, course})
        } catch (error) {
            res.send(error.message)
        }
    }

    static async addProfile(req, res){
        const {error} = req.query
        try {
            res.render('addFormProfile', {error})
        } catch (error) {
            console.log(error)
            res.send(error.message) 
        }
    }

    static async postProfile(req, res) {
        try {
            const id = req.session.UserId
            const {firstName, lastName, dateOfBirth, gender} = req.body
            await Profile.create({firstName, lastName, dateOfBirth, gender, UserId: id}, {
                include: User
            })
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
            if(error.name === 'SequelizeValidationError'){
                const msg = error.errors.map(each => each.message)
                res.redirect(`/addProfile?error=${msg}`)
            } else {
                res.render(`errPage`, {error})
            }
        }
    }

    static async editForm(req, res){
        const {error} = req.query
        const {id} = req.params
        try {
            let profile = await Profile.findByPk(id)
            res.render('editProfile', {profile, error})         
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
            if(error.name === 'SequelizeValidationError'){
                const msg = error.errors.map(each => each.message)
                res.redirect(`/editProfile?error=${msg}`)
            } else {
                res.render(`errPage`, {error})
            }
        }
    }

    static async addCourseForm(req, res){
        const {error} = req.query
        try {
            let category = await Category.findAll()
            res.render('addCourseForm', {category, error})
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async postCourse(req, res){
        try {
            
            const {name, description, imageURL, CategoryId} = req.body
            await Course.create({name, description, imageURL, CategoryId })
            res.redirect('/courses')
        } catch (error) {
            console.log(error)
            if(error.name === 'SequelizeValidationError'){
                const msg = error.errors.map(each => each.message)
                res.redirect(`/addCourse?error=${msg}`)
            } else {
                res.render(`errPage`, {error})
            }
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

    static async userGetCourse(req, res){
        try {
            
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async changeToFalse(req, res) {
        const { id } = req.params
        try {
            let course = await Course.findByPk(id)

            // if(course.rating === 0){
                await Course.update({availability: false}, {where : { id }})
            // }
            
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

    static async getInvoice(req, res){
        try {
            let course = await Course.findAll({
                include: User,
                where: {
                    availability: false
                }
            })
            let data = {
                apiKey: "GjSGR1qkC7GgHDZjalNu1SboXgHvl1x1U51p84PHFDXzxq22XYNGXeeEC7SztQng", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
                mode: "development", // Production or development, defaults to production
                products: [
                    {
                        quantity: course.length,
                        description: "Ruang Hacktiv",
                        taxRate: 6,
                        price: 500000
                    }
                ]
            }
            
            const invoice = await easyinvoice.createInvoice(data)
            // console.log(invoice)
            await fs.writeFileSync('invoice.pdf', invoice.pdf, 'base64')
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async userCourseList(req, res){
        try {
            let list = await User.findAll({
                include : {
                    model: Course,
                },
                where: {
                    role: {
                        [Op.ne] : 'admin'
                    }
                }
            })
            // console.log(list)
            // res.render('listUserCourse', {list})
            res.send(list)
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }
}

module.exports = Controller