import React, { useState } from 'react';
import './App.css';
import List from "./Components/List"
import Form from "./Components/Form"


export interface messageType {
  0: string;
  1: string;
}

export interface messagesType {
  messages: messageType[];
}

export interface videoType {
  title: string;
  url: string;
  id: string;
  messages: messagesType["messages"];
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
    id: "someHash",
    messages: [["0:00", "TestMessage"]]
  }]);

  return (
    <>
      <h1 className="CenterNoWidth">
        Youtube with Chat
      </h1>
      <List videos={videos} setVideos={setVideos} favorites={favorites} setFavorites={setFavorites}/>
      <Form videos={videos} setVideos={setVideos}/>    
    </>
  );
}

export default App;
