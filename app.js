const axios = require('axios');
const express = require("express")
const bodyParser = require("body-parser");
const e = require('express');
const { create } = require('domain');
const app = express()
const PORT = process.env.PORT || 3000;
require('dotenv').config();
app.use(bodyParser.json())
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
let refreshToken;
let distance;
let movingTime
let elapsedTime
let elevationGain
let sportType
let averageSpeed
let maxSpeed
let maxHeart
let averageHeart

async function getUserKey() {
    if (refreshToken != null) {
        try {
            let res = await axios({
                 url: `https://www.strava.com/oauth/token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=refresh_token&refresh_token=${refreshToken}`,
                 method: 'post',
                 headers: {
                     'Content-Type': 'application/json'
                 }
             })
             if(res.status == 200){
                 console.log(res.status)
             }     
             return res.data
         }
         catch (err) {
             console.error(err);
         }
    }
    else {
        try {
            let res = await axios({
                 url: `https://www.strava.com/oauth/token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=refresh_token&refresh_token=${process.env.refresh_token}`,
                 method: 'post',
                 headers: {
                     'Content-Type': 'application/json'
                 }
             })
             if(res.status == 200){
                 console.log(res.status)
             }     
             return res.data
         }
         catch (err) {
             console.error(err);
         }
    }
}

async function getUserActivities(access_token) {
    try {
       let res = await axios({
            url: `https://www.strava.com/api/v3/athlete/activities?per_page=30&access_token=${access_token}`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(res.status == 200){
            console.log(res.status)
        }     
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}

async function createTask(activityInfo) {
    try {
       let res = await axios({
            url: `https://api.clickup.com/api/v2/list/193709015/task`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.clickup_api
            },
            data: {
                'name': activityInfo.name,
                "custom_fields": [
                    {
                        'id': elapsedTime,
                        'value': activityInfo.elapsed_time
                    },
                    {
                        'id': elevationGain,
                        'value': activityInfo.total_elevation_gain
                    },
                    {
                        'id': averageSpeed,
                        'value': activityInfo.average_speed
                    },
                ]
            }
        })
        if(res.status == 200){
            console.log(res.status)
        }     
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}

async function mapCustomFields() {
    try {
       let res = await axios({
            url: `https://api.clickup.com/api/v2/list/193709015/field`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.clickup_api
            }
        })
        if(res.status == 200){
            console.log(res.status)
        }     
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}


getUserKey().then(userRes => {
    console.log(userRes)
    getUserActivities(userRes.access_token).then(userActivitiesRes => {
        mapCustomFields().then(customFields => {
            for (let i = 0; i < customFields.fields.length; i++) {
                if (customFields.fields[i].name === 'Elapsed Time') {
                    elapsedTime = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Elevation Gain') {
                    elevationGain = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Average Speed') {
                    averageSpeed = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Distance') {
                    distance = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Average Heartrate') {
                    averageHeart = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Moving Time') {
                    movingTime = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Sport Type') {
                    sportType = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Max Speed') {
                    maxSpeed = customFields.fields[i].id
                }
                else if (customFields.fields[i].name === 'Max Heartrate') {
                    maxHeart = customFields.fields[i].id
                }
            }
        }).then(() => {
            console.log(userActivitiesRes)
            for (let i = 0; i < userActivitiesRes.length; i++) {
                createTask(userActivitiesRes[i])
                
            }
        })
        // console.log(userActivitiesRes)
        // for (let i = 0; i < userActivitiesRes.length; i++) {
        //     createTask(userActivitiesRes[i])
            
        // }
    })
})
