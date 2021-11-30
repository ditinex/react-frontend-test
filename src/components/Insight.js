/* eslint-disable */ 
import React, { useEffect, useState } from 'react';
import {
    useLocation,
    useParams
} from "react-router-dom";
import axios from 'axios';


const Insight = () => {
    const location = useLocation()
    const hash = location.hash
    const search = location.search
    const { userId } = useParams();

    const [insights,setInsights] = useState([])
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        if (search !== ''){
            alert('Failed to share.')
            getDbInsights()
        }
        else if (hash !== '') {
            //Shared successfully
            verifyIsPostedInFacebook()
        }
        else{
            getDbInsights()
        }
    }, [])

    const verifyIsPostedInFacebook = () => {
        const nodeApiUrl = `${process.env.REACT_APP_API_URI}/verify-new-post-status/${userId}`
        axios.get(nodeApiUrl)
            .then(function (response) {
                getDbInsights()
                //console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const getDbInsights = () => {
        const nodeApiUrl = `${process.env.REACT_APP_API_URI}/show-latest-insights/${userId}`
        axios.get(nodeApiUrl)
            .then(function (response) {
                setInsights(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const fetchNewInsights = () => {
        setLoading(true)
        const nodeApiUrl = `${process.env.REACT_APP_API_URI}/fetch-insight-data/${userId}`
        axios.get(nodeApiUrl)
            .then(function (response) {
                setInsights(response.data)
                setLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false)
            });
    }

    return (
        <div style={{ marginTop: 200 }}>
            <p onClick={()=>fetchNewInsights()} style={{cursor: "pointer"}} className="fb btn">
                {loading ? 'Fetching .... ': 'Re-fetch Insight'}
            </p>
            {
                insights.map(item=>{
                    return(
                        <div key={item.post_id} style={{margin: 10, borderWidth: 1}}>
                            <p>Post Id : <a href={item.parmalink_url} rel="noreferrer" target="_blank">{item.post_id}</a></p>
                            <p>Reactions : {item.insight.reactions}</p>
                            <p>Summary : {JSON.stringify(item.reaction_summary)}</p>
                            <p>Comments : {item.insight.comments}</p>
                            <p>Summary : {JSON.stringify(item.comment_summary)}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Insight

