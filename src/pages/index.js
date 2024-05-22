import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import React, { useState, useEffect, useRef } from "react";

const playlist = [
  { name: "In This Darkness", src: "/music/In This Darkness.mp3" },
  { name: "Let U Go", src: "/music/Let-U-Go.mp3" },
  { name: "Tip Toe", src: "/music/Tip Toe.mp3" },
  { name: "二十歳の恋", src: "/music/二十歳の恋.mp3" },
];

const helloGif = { name: "helloGif", src: "/music/hi.gif" };

const quotes = [
  "Confessing your feelings to someone isn’t an easy thing. You spend every day in anguish, yet you still can’t do it. The words “I love you” hang in your throat, and you can’t seem to force them out. I think her earnest feelings deserve a proper answer, don’t you?",
  "At any rate, humans change over time based on their actions. Truth be told, at the end of the day, equality is just a fantasy. And most of us go through life denying the fact that we live in a meritocracy.",
  "Never turn your back on family, even when they hurt you. And if you remember nothing else, remember to find time to eat together as a family. Even when times are rough; especially when times are rough.",
  "Those who stand at the top determine what’s wrong and what’s right. Whoever wins this war becomes justice!",
  "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.",
  "It’s more important to master the cards you’re holding than to complain about the ones your opponent was dealt.",
  "Hard work is worthless for those that don’t believe in themselves.",
  "When you give up, that’s when the game ends.",
  "You see, sometimes friends have to go away, but a part of them stays behind with you.",
  "It’s not dying that frightens us. It’s living without ever having done our best.",
  "Dead people receive more flowers than living ones because regret is stronger than gratitude.",
  "We are not defined by our past, but by the choices we make in the present.",
  "No matter how deep the night, it always turns to day, eventually.",
];

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [audio, setAudio] = useState(null);
  const [clickAudio, setClickAudio] = useState(null);
  const [currentSongName, setCurrentSongName] = useState(playlist[currentSongIndex].name);
  const birthdate = new Date("2006-01-11T03:20:23");
  const [age, setAge] = useState("");
  const [greeting, setGreeting] = useState("");
  const [typedGreeting, setTypedGreeting] = useState("");
  const [showBox1, setShowBox1] = useState(true);
  const [showBox2, setShowBox2] = useState(false);
  const [showBox3, setShowBox3] = useState(false);
  const [typedQuote] = useState(getRandomQuote());
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [queue, setQueue] = useState([...playlist]);
  const [stack, setStack] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);
  
  useEffect(() => {
    setAudio(new Audio(playlist[currentSongIndex].src));
    setClickAudio(new Audio("/music/click.mp3"));
    audioRef.current = new Audio();
  }, []);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const handleEnded = () => {
      playNext();
    };
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current.removeEventListener("ended", handleEnded);
    };
  }, [queue, stack]);

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        return " Good Morning!";
      } else if (currentHour >= 12 && currentHour < 18) {
        return " Good Afternoon!";
      } else {
        return " Good Evening!";
      }
    };
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    if (greeting) {
      const typeGreeting = () => {
        let index = 0;
        const typingDelay = 100;
        const greetingText = greeting || "";
        const typeNextCharacter = () => {
          if (index < greetingText.length) {
            setTypedGreeting(
              (prevTypedGreeting) =>
                prevTypedGreeting + greetingText.charAt(index)
            );
            index++;
            setTimeout(typeNextCharacter, typingDelay);
          }
        };
        typeNextCharacter();
      };

      typeGreeting();
    }
  }, [greeting]);

  useEffect(() => {
    setRandomBackground();
    setAge(calculateAge());

    const intervalId = setInterval(() => {
      setAge(calculateAge());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleClickAnywhere = () => {
    setShowDisclaimer(false);
    clickAudio.play();
  };

  const setRandomBackground = () => {
    const backgrounds = [
      'url("https://wallpapercave.com/wp/wp5128374.jpg")',
      'url("https://wallpapercave.com/wp/wp5638585.jpg")',
      'url("https://wallpapercave.com/wp/wp5170669.jpg")',
      'url("https://wallpapercave.com/wp/wp8186392.jpg")',
    ];
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    document.body.style.backgroundImage = backgrounds[randomIndex];
  };

  const playSong = (song) => {
    setStack((prevStack) => [currentSong, ...prevStack]);
    setCurrentSong(song);
    setCurrentSongName(song.name);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (stack.length > 0) {
      setQueue((prevQueue) => [currentSong, ...prevQueue]);
      const prevSong = stack[0];
      setStack((prevStack) => prevStack.slice(1));
      setCurrentSong(prevSong);
      setCurrentSongName(prevSong.name); // Update current song name
      setIsPlaying(true);
    }
  };
  

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length > 0)
      {
        const nextSong = queue[0];
        setQueue((prevQueue) => prevQueue.slice(1));
        
        playSong(nextSong);
      }
    };
  
    const handleSelectChange = (event) => {
      const selectedSong = playlist.find(
        (song) => song.name === event.target.value
      );
      playSong(selectedSong);
      setCurrentSongName(selectedSong.name);
    };
  
    function calculateAge() {
      const diff = new Date() - birthdate;
      const ageDate = new Date(diff);
      return `${
        ageDate.getFullYear() - 1970
      } years, ${ageDate.getMonth()} months, ${ageDate.getDate()} days, ${ageDate.getHours()} hours, ${ageDate.getMinutes()} minutes, and ${ageDate.getSeconds()} seconds`;
    }
  
    function getRandomQuote() {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
  
    return (
      <>
        {/* Display disclaimer */}
        {showDisclaimer && (
          <div className="disclaimer" onClick={handleClickAnywhere}>
            <h1>Welcome!</h1>
            <h1>This website is still under development. Expect bugs!</h1>
            <p>Click anywhere to enter.</p>
          </div>
        )}
        {/* Main content */}
        {!showDisclaimer && (
          <div>
            <div className="a1">
              <header className="head">
                <h1 className="a1logo">影の君主</h1>
                <h2 className="logo">Molo</h2>
              </header>
            </div>
            <div className="ControlBox">
              <div className="buttons">
                <select value={currentSongName} onChange={handleSelectChange}>
                  {playlist.map((song, index) => (
                    <option key={index} value={song.name}>
                      {song.name}
                    </option>
                  ))}
                </select>
                <p>{isPlaying ? `Now Playing: ${currentSongName}` : "(^///^)"}</p>
                <button className="control-Text" onClick={playPrevious}>
                  Previous
                </button>
                <button className="control-Text" onClick={togglePlay}>
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button className="control-Text" onClick={playNext}>
                  Next
                </button>
                
              </div>
  
              {/* Dropdown for my songs */}
  
              <div className="navigation">
                <a
                  href="#info"
                  onClick={() => {
                    setShowBox1(true);
                    setShowBox2(false);
                    setShowBox3(false);
                  }}
                >
                  ℹ️
                </a>
                <a
                  href="#about"
                  onClick={() => {
                    setShowBox1(false);
                    setShowBox2(true);
                    setShowBox3(false);
                  }}
                >
                  🗝
                </a>
                <a
                  href="#projects"
                  onClick={() => {
                    setShowBox1(false);
                    setShowBox2(false);
                    setShowBox3(true);
                  }}
                >
                  ❣
                </a>
                <a href="https://discord.com/users/398244063821955072">✉︎</a>
                <p>{typedGreeting}</p>
              </div>
            </div>
  
            {showBox1 && (
              <div className="boxes1">
                <p>I am {age} old</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={helloGif.src}
                    alt={helloGif.name}
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
                <p>→ {typedQuote}</p>
              </div>
            )}
  
            {showBox2 && <div className="boxes2"></div>}
            {showBox3 && (
              <div className="boxes3">
                <div className="projects">
                  <h1>Projects</h1>
                </div>
                <div className="row noMargin">
                  <div className="col one">
                    <h2>Coming Soon...</h2>
                    <h2>----------------------------</h2>
                    <h2>----------------------------</h2>
                  </div>
                  <div className="col two">
                    <h2>----------------------------</h2>
                    <h2>----------------------------</h2>
                    <h2>----------------------------</h2>
                  </div>
                </div>
                <div className="row noMargin">
                  <div className="col three">
                    <h2>----------------------------</h2>
                    <h2>----------------------------</h2>
                    <h2>----------------------------</h2>
                  </div>
                  <div className="col four">
                   
                  <h2>----------------------------</h2>
                  <h2>----------------------------</h2>
                  <h2>----------------------------</h2>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
  