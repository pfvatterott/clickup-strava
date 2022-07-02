const axios = require('axios');
const express = require("express")
const bodyParser = require("body-parser");
const e = require('express');
const app = express()
const PORT = process.env.PORT || 3000;
require('dotenv').config();
app.use(bodyParser.json())
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
let refreshToken;

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




getUserKey().then(userRes => {
    console.log(userRes)
    getUserActivities(userRes.access_token).then(userActivitiesRes => {
        console.log(userActivitiesRes)
    })
})
