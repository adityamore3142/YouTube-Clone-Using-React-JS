import React, { useEffect, useState } from 'react';
import './Playvideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { api_key } from '../../Data';
import { value_converter } from '../../Data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const Playvideo = () => {
  const {videoId} = useParams();

  const [apidata,setApiData]= useState(null);
  const [channeldata,setChannelData]= useState(null);
  const [commentdata,setCommentData]= useState([]);

  const fetchVideoData= async()=>{
    //fething video data 
     const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${api_key}`;
     await fetch(videoDetails_url).then(response=>response.json()).then(data=>setApiData(data.items[0]));
  }

  const fetchOtherData = async() =>{
    //fetching channel data
    const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apidata.snippet.channelId}&key=${api_key}`;
    await fetch(channelDetails_url).then(res=>res.json()).then(data=>setChannelData(data.items[0]));
    //fetching comments data
    const comments_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${api_key}`;
    await fetch(comments_url).then(res=>res.json()).then(data=>setCommentData(data.items));
  }
  useEffect(()=>{
    fetchVideoData();
 },[videoId])

 useEffect(()=>{
  fetchOtherData();
},[apidata])

  return (
    <div className='play-video'>
         {/* <video src={video1} controls autoPlay muted></video> */}
         <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
         <h3>{apidata?apidata.snippet.title:"title here"}</h3>
    <div className='play-video-info'>
        <p>{apidata?value_converter(apidata.statistics.viewCount):"views"} &bull; {apidata?moment(apidata.snippet.publishedAt).fromNow():""}</p>
    <div>
        <span><img src={like} alt="" /> {apidata?value_converter(apidata.statistics.likeCount):""}</span>
        <span><img src={dislike} alt="" /> </span>
        <span><img src={share} alt="" /> share</span>
        <span><img src={save} alt="" /> save</span>
    </div>
 </div>
 <hr />
<div className='publisher'>
      <img src={channeldata?channeldata.snippet.thumbnails.default.url:""} alt="" />
 <div>
   <p>{apidata?apidata.snippet.channelTitle:""}</p>
   <span>{channeldata?value_converter(channeldata.statistics.subscriberCount):"1M"} Subscribers</span>
 </div>
   <button>Subscribe</button>
    </div>
    <div className="vid-description">
        <p>{apidata?apidata.snippet.description.slice(0,400):"description"}</p>
        <hr />
        <h4>{apidata?value_converter(apidata.statistics.commentCount):"comments"} Comments</h4>
        {commentdata.map((item,index)=>{
            return(
              <div key={index} className='comment'>
              <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
      <div>
        <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span>1 day ago</span></h3>
        <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
        <div className='comment-action'>
            <img src={like} alt="" />
            <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
            <img src={dislike} alt="" />
        </div>
      </div>
    </div>
            )
        })}
    
  </div>
 </div>


  )
}

export default Playvideo