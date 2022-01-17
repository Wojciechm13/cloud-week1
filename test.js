//first NodeJS app

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello Virtual Machine!')
})

app.listener(port, ()=> {
    console.log('Express Application listening at port 3000')
})