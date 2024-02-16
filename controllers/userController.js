const Session = require('../models/sessionModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
//"YY-MM-DD"
const isValidDate = (dateString) => {
    try {
        const newDate = dateString.split('T')
        // First check for the pattern
        if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(newDate[0])) {
            return false;
        }

        // Parse the date parts to integers
        let parts = newDate[0].split("-");
        let day = parseInt(parts[2], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[0], 10);

        let timeParts = newDate[1].split(":")
        let hours = parseInt(timeParts[0], 10);
        let minutes = parseInt(timeParts[1], 10)
        if (hours >= 24 || minutes >= 60) {
            return false;
        }

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    } catch (err) {
    }
};

exports.getAllUser = (async (req, res, next) => {
    try {
        const user = await User.find().populate('sessions')
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (err) {
        console.error(err)
    }
})


exports.createUser = (async (req, res, next) => {
    const user = await User.create({
        name: req.body.name
    })
    res.status(200).json({
        status: 'success',
        data: user
    })
})
exports.getUser = (async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).populate('sessions')
        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (err) {
        console.error(err)
    }
})

exports.punchIn = (async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const isInputDateValid = isValidDate(req.body.inTime)
        if (!isInputDateValid) {
            throw new Error("Date format invalid. Please provide input in valid format YYYY-MM-DDTHH:MM")
        }
        const loginTime = new Date(req.body.inTime);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User Not Found')
        }
        const session = new Session({
            inTime: loginTime,
            userId: user._id
        })
        await session.save();
        user.sessions.push(session._id)
        await user.save()
        res.status(200).json({
            status: "Success",
            data: session
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

exports.punchOut = (async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const isInputDateValid = isValidDate(req.body.outTime)
        if (!isInputDateValid) {
            throw new Error("Date format invalid. Please provide input in valid format YYYY-MM-DDTHH:MM")
        }
        const logoutTime = new Date(req.body.outTime);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User Not Found')
        }

        const currSessionId = user.sessions[user.sessions.length - 1]
        const currSession = await Session.findById(currSessionId)

        if (currSession.inTime >= logoutTime) {
            throw new Error(`Out time not valid, Out time should be more than in time`)
        }
        currSession.outTime = logoutTime;
        await currSession.save();

        res.status(200).json({
            status: "Success",
            data: currSession
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: "Error",
            data: err.messages
        })
    }
})

exports.getStatisticsForMonth = async (req, res, next) => {

    const monthString = req.body.monthString;
    const [month, year] = monthString.split('/');
    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }
    const stats = await Session.aggregate([
        {
            $match: {
                inTime: {
                    $gte: new Date(`${year}-${month}-01`),
                    $lte: new Date(`${year}-${month}-${monthLength[month - 1]}`)
                }
            },

        },
        {
            $group: {
                _id: '$userId',
                totalHours: {
                    $sum: {
                        $divide: [{
                            $dateDiff: {
                                startDate: "$inTime", endDate: "$outTime", unit: "minute"
                            }
                        }, 60]
                    }
                }
            }
        }

    ])
    res.json({
        data: stats
    })
}