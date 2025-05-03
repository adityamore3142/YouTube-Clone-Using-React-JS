import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { api_key, value_converter } from '../../Data';
import { Link } from 'react-router-dom';

const Recommended = ({categoryId}) => {
  const [apidata,setApiData]=useState([]);

  const fetchData= async ()=>{
    const relatedvideo_url =`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&maxResults=45&videoCategoryId=${categoryId}&key=${api_key}`;

    fetch(relatedvideo_url).then((res=>res.json())).then((data=>setApiData(data.items)));
  }

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <div className='recommended'>
    {apidata.map((item,index)=>{
        return(
          <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
           <img src={item.snippet.thumbnails.medium.url} alt="" />
           <div className="vid-info">
             <h4>{item.snippet.title}</h4>
             <p>{item.snippet.channelTitle}</p>
             <p>{value_converter(item.statistics.viewCount)}</p>
           </div>
        </Link>
        )
    })}
    </div>
  )
}

export default Recommended;