import React, { useState } from 'react';
import './App.css';
import List from "./Components/List"
import Form from "./Components/Form"
import { ListFooter } from "./Components/ListFooter"
import { videosType } from "./Models/Video"
import { VideosViewer } from "./Components/VideosViewer"

function App() {

  const [favorites, setFavorites] = useState<videosType["videos"]>([])

  const [videos, setVideos] = useState<videosType["videos"]>([
    {
      title: "Playlist",
      url : "https://www.youtube.com/watch?v=vr_IHczK9kc",
      // url: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
      id: "someHash"
    }
  ]);

  return (
    <>
      <h1 className="CenterNoWidth">
        Youtube with Notes
      </h1>
      <List videos={videos} favorites={favorites} setFavorites={setFavorites}/>
      <ListFooter
        setVideos={setVideos}
      />
      <Form setVideos={setVideos}/>    
      <VideosViewer 
        displayedVideos={videos}
        setDisplayedVideos={setVideos}
      />
    </>
  );
}

export default App;
