// @ts-ignore
import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseImgUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    //if [],it exceutes code only once when page loads
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); //everytime this variable changes code gets executes again

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl(""); //if we already playing trailor then stop it
    } else {
      movieTrailer(movie?.title || "")
        .then((url) => {
          //https://www.youtube.com/watch?v=XtMThy8QKqU
          //we only want string after .com/ in above string
          console.log(movie.name, url, movie.title);

          const urlParams = new URLSearchParams(new URL(url).search); // pass whole url inside URLSearchParamas function
          console.log(urlParams);
          setTrailerUrl(urlParams.get("v")); // get the exact part of link after v= and set it to TrailerUrl
          console.log("url", trailerUrl);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            /*Everything will get classname row_poster but if is LargeRow then it is row_posterLarge */
            src={`${baseImgUrl}${
              isLargeRow
                ? movie.poster_path
                : movie.backdrop_path /*If it is large row use poster else use thumbnails*/
            }`}
            alt={movie.name}
          ></img>
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}
export default Row;
