/* eslint-disable */ 
import React, { useEffect, useState } from 'react';
import {
    useLocation
} from "react-router-dom";
import axios from 'axios';

const loginUrl = 'https://www.facebook.com/v12.0/dialog/oauth?client_id=' + process.env.REACT_APP_FB_ID + '&redirect_uri=' + process.env.REACT_APP_URI + '&scope=public_profile,user_posts&response_type=token&state={state-param}'

const Home = () => {
    const location = useLocation()
    const hash = location.hash
    const [access_token, set_access_token] = useState(null)
    const [user_data, set_user_data] = useState(null)

    useEffect(() => {
        if (hash.length > 10) {
            let myRegexp = new RegExp("access_token=(.*?)&", "g");
            let match = myRegexp.exec(hash);
            if (match.length > 1) {
                let access_token = match[1];
                getLongLivedAccessToken(access_token)
            }
        }
    }, [])

    useEffect(() => {
        let data = getStoredAccessToken()
        if (data && data.access_token) {
            set_access_token(data.access_token)
            fetchUserDetails(data.access_token)
        }
    }, [])

    const getLongLivedAccessToken = (access_token) => {
        const longLivedUrl = `https://graph.facebook.com/v12.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.REACT_APP_FB_ID}&client_secret=${process.env.REACT_APP_FB_SECRET}&fb_exchange_token=${access_token}`
        axios.get(longLivedUrl)
            .then(function (response) {
                if (response.data && response.data.access_token) {
                    storeAccessToken(response.data)
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }


    const getStoredAccessToken = () => {
        return JSON.parse(window.localStorage.getItem('access_token'))
    }

    const removeStoredAccessToken = () => {
        localStorage.removeItem('access_token')
        set_access_token(null)
        alert('Cookie Cleared !')
    }

    const storeAccessToken = (token) => {
        window.localStorage.setItem('access_token', JSON.stringify(token));
        set_access_token(token.access_token)
        fetchUserDetails(token.access_token, true)
    }

    const fetchUserDetails = (access_token, newToken = false) => {
        const graphApiUrl = `https://graph.facebook.com/v12.0/me?fields=name,id,picture&access_token=${access_token}`
        axios.get(graphApiUrl)
            .then(function (response) {
                if (response.data) {
                    set_user_data(response.data)
                    if (newToken)
                        storeInServer(response.data)
                }
            })
            .catch(function (error) {
                // handle error
                removeStoredAccessToken()
                console.log(error);
            })
    }

    const storeInServer = (data) => {
        const nodeApiUrl = `${process.env.REACT_APP_API_URI}/add-or-update-user`
        const access_token_data = getStoredAccessToken()
        const postData = {
            name: data.name,
            user_id: data.id,
            access_token: access_token_data.access_token,
            expiry: access_token_data.expires_in
        }

        axios.post(nodeApiUrl, postData)
            .then(function (response) {
                //console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div style={{ marginTop: 200 }}>
            {access_token ? <ShareButton userData={user_data} /> : <LoginButton />}
            <div onClick={() => removeStoredAccessToken()} style={{ marginTop: 100, marginBottom: 100, cursor: 'pointer' }}>Clean Cookie</div>
        </div>
    )
}
export default Home

const LoginButton = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: 100 }}>
            <a href={loginUrl} className="fb btn">
                Login with Facebook
            </a>
        </div>
    )
}

const ShareButton = ({ userData }) => {
    const shareUrl = userData ? 'https://www.facebook.com/dialog/share?app_id=' + process.env.REACT_APP_FB_ID + '&href=https://stackoverflow.com/questions/49283231/using-facebook-graph-api-to-post-on-user-wall&quote=Hello+WOrld&redirect_uri=' + process.env.REACT_APP_URI + '/insight/' + userData.id : '/'

    return (
        <div style={{ textAlign: 'center', marginTop: 100 }}>

            {
                userData ?
                    <p> Hello {userData.name} </p>
                    :
                    <p>Loading user data ...</p>
            }

            <a href={shareUrl} className="fb btn">
                Share On Facebook
            </a>
            <br /><br />
            {
                userData && <a href={`/insight/${userData.id}`}>View Insight</a>
            }
        </div>
    )
}