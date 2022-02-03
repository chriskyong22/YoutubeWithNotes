import React, { useState } from 'react';
import './App.css';
import List from "./Components/List"
import Form from "./Components/Form"
import { ListFooter } from "./Components/ListFooter"

export interface videoType {
  title: string;
  url: string;
  id: string;
}

export interface videosType{
  videos: videoType[];
}

function App() {

  const [favorites, setFavorites] = useState<videosType["videos"]>([])

  const [videos, setVideos] = useState<videosType["videos"]>([{
    title: "Playlist",
    url : "https://www.youtube.com/embed/vr_IHczK9kc?enablejsapi=1",
    // url: "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
    id: "someHash"
  }]);

  return (
    <>
      <h1 className="CenterNoWidth">
        Youtube with Chat
      </h1>
      <List videos={videos} favorites={favorites} setFavorites={setFavorites}/>
      <ListFooter
        setVideos={setVideos}
      />
      <Form videos={videos} setVideos={setVideos}/>    
    </>
  );
}

export default App;
