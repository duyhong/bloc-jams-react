import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './../style/Album.css';

class Album extends Component {
   constructor(props) {
     super(props);

     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });

     this.state = {
       album: album,
       currentSong: album.songs[0],
       currentTime: 0,
       duration: album.songs[0].duration,
       currentVolume: 0.8,
       isPlaying: false,
       currentIndex: null,
       hoverIndex: null,
       showPause: false,
       showPlay: false
     };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
     this.audioElement.volume = this.state.currentVolume;
   }

   play() {
     this.audioElement.play();
     this.setState({ isPlaying: true });
   }

   pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
   }

   componentDidMount() {
     this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
       },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
       }
     };
     this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   }

   componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }

   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song, index) {
     const isSameSong = this.state.currentSong === song;
     this.setState({ currentIndex: index });
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }
       this.play();
     }
   }

   handlePrevClick() {
      // const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, this.state.currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setState({currentIndex: newIndex});
      this.setSong(newSong);
      this.play();
   }

   handleNextClick() {
     // const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.min(this.state.album.songs.length - 1, this.state.currentIndex + 1);
     const newSong = this.state.album.songs[newIndex];
     this.setState({currentIndex: newIndex});
     this.setSong(newSong);
     this.play();
   }

   handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }

   handleVolumeChange(e) {
     const newVolume = e.target.value;
     this.audioElement.volume = newVolume;
     this.setState({ currentVolume: newVolume});
   }

   handleMouseEnter(index) {
     if(this.state.currentIndex === index && this.state.isPlaying) {
         this.setState({ showPause: true });
     }
     this.setState({ showPlay: true });
     this.setState({ hoverIndex: index});
   }

   handleMouseLeave() {
     this.setState({ showPause: false });
     this.setState({ showPlay: false });
     this.setState({ hoverIndex: null});
   }

   formatTime(seconds) {
     if(isNaN(seconds)) {
       return "-:--";
     }
     let sec = Math.floor(seconds % 60);
     return Math.floor(seconds/60) + ":" + (sec < 10 ? "0" : '') + sec;
   }

   render() {
     return (
       <section className="album">
         <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
             <h1 id="album-title">{this.state.album.title}</h1>
             <h2 className="artist">{this.state.album.artist}</h2>
             <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
         </section>
         <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>
           <tbody>
             {this.state.album.songs.map( (song, index) =>
               <tr className="song" key={index} onClick={() => this.handleSongClick(song, index)}
                                                onMouseEnter={() => this.handleMouseEnter(index)}
                                                onMouseLeave={() => this.handleMouseLeave()} >
                 <td id="song-number">{this.state.hoverIndex === index && this.state.showPause ? (<PauseIcon/>) : this.state.hoverIndex === index && this.state.showPlay ? (<PlayIcon/>) : index + 1 }</td>
                 <td>{song.title}</td>
                 <td id="duration-time">{song.duration}</td>
               </tr>
             )}
           </tbody>
         </table>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           currentVolume={this.audioElement.volume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
           formatTime={(seconds) => this.formatTime(seconds)}
         />
       </section>
     );
   }
}

function PlayIcon(props) {
  return (<ion-icon name="play-circle" onMouseEnter={props.onMouseEnter} ></ion-icon>);
}

function PauseIcon(props) {
  return (<ion-icon name="pause" onMouseEnter={props.onMouseEnter} ></ion-icon>);
}

export default Album;
