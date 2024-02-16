const express = require('express')
const app = express();
const morgan = require('morgan')
const userRouter = require('./routes/userRoutes')

app.use(express.json({
    limit: '10kb'
}))
app.use(morgan('dev'));

app.use('/api/v1', userRouter)

module.exports = app;