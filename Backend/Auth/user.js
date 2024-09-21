const express = require('express') //Import the Express module
const app = express() //Instantiate the express application
const bcrypt = require("bcrypt")
const {client} = require('../DB/db')
const db = client.db('blogs')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const jwt = require('jsonwebtoken')
const expressBrute = require('express-brute')
const store = new expressBrute.MemoryStore()
const brute = new expressBrute(store)


app.post('/signup', async(req, res) => {

    try
    {
        const password = await bcrypt.hash(req.body.password, 10)

        let userModel = 
        {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: password
        }

        const collection = await db.collection('users')
        const result = await collection.insertOne(userModel)

        res.status(201).send(result)
        console.log(password)
    }
    catch(err)
    {
        console.error(err)
    }   
})

app.post('/login', brute.prevent, async(req, res) => {

    const {email, password} = req.body

    try
    {
        const collection = await db.collection('users')
        const user = await collection.findOne({email})

        if(!user)
        {
            return res.status(401).send({message: 'Invalid email or password'})
        }

        const isPasswordValid = bcrypt.compare(password, user.password)

        if(!isPasswordValid)
        {
            return res.status(401).json({message: 'Invalid email or password'})
        }
        else
        {
            const token = jwt.sign({email: req.body.email, password: req.body.password}, 'ThisIsTheStringIWillBeUsingForEncryptingTheTokenGenerated', {expiresIn: '1h'})
            
            res.status(200).send({message: 'Authenticated Successfully'})
            console.log(token) //do not use this in creating genuine app, creates a weakness
        }
    }
    catch(err)
    {
        console.error(err)
        res.status(401).json({message: 'Failed Login Attempt'})
    }
})

module.exports = app