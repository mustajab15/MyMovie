import { useEffect, useState } from "react";
import StartRating from "./StartRating";

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <>
      <div className="logo">
        <span role="img">🎫</span>
        <h1>Movie</h1>
      </div>
    </>
  );
}

function Search({ query, setQuery }) {
  return (
    <>
      <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />
    </>
  );
}

function NumResult({ movies }) {
  return (
    <>
      <p className="num-results">
        Found <strong>{movies?.length}</strong> results
      </p>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MovieItem({ movie, onSelectMovieID }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovieID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieList({ movies, onSelectMovieID }) {
  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie, index) => (
          <MovieItem key={index} movie={movie} onSelectMovieID={onSelectMovieID} />
        ))}
      </ul>
    </>
  );
}

function MovieDetails({ selectId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovies] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  const isWatched = watched.some((movie) => movie.imdbID === selectId);
  const userRatingWatched = watched.find((movie) => movie.imdbID === selectId)?.userRating;

  const { Title: title, Year: year, Released: released, Poster: poster, imdbRating, Runtime: runtime, Plot: plot, Genre: genre, Actors: actor, Director: director } = movie;

  function handleAddWatched() {
    const newWatchedMovie = {
      imdbID: selectId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  console.log(title, year);

  useEffect(() => {
    async function getMovieDetails() {
      setIsloading(true);
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectId}`);
      const data = await response.json();
      setMovies(data);
      setIsloading(false);
    }
    getMovieDetails();
  }, [selectId]);

  useEffect(() => {
    if (!title) return;
    document.title = `popmovie | ${title}`;

    return function () {
      document.title = "popMovie";
      console.log(`clean up movie details ${title}`);
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              x
            </button>
            <img src={poster} alt={`${title}poster`} />
            <div class="details-overview">
              <h2>{title}</h2>
              <p>
                <span>{released}</span>
              </p>
              <p>
                <span>{runtime}</span>
              </p>
              <p>
                <span>{Math.trunc(avgRuntime)}</span>
              </p>
            </div>
          </header>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Genre :{genre}</p>
            <p>Staring : {actor}</p>
            <p>Directed By: {director}</p>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StartRating max={10} size={24} color="#fcc419" onSetRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddWatched}>
                      + add To watched
                    </button>
                  )}
                </>
              ) : (
                <p> you have watched this movie already with a reting of {userRatingWatched} /10</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>🎬</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.trunc(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedItem({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🎬</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie, index) => (
          <WatchedItem key={index} movie={movie} onDeleteWatched={onDeleteWatched} />
        ))}
      </ul>
    </>
  );
}

function BoxMovies({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Loader() {
  return (
    <>
      <div className="loader">
        <div className="loading-bar">
          <div className="bar"></div>
        </div>
      </div>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span></span>
      {message}
    </div>
  );
}

const API_KEY = "7c1bfaa8";

export default function App() {
  const [movies, setMovies] = useState();
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState();
  const [query, setQuery] = useState("oppenheimer");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  function HandleSelectMovieId(id) {
    setSelectedMovieId((selectId) => (selectId === id ? null : id));
  }

  function HandleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function HandleClosedMovie() {
    setSelectedMovieId(null);
  }

  function HandleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(() => {
    async function fetchMovie() {
      try {
        setIsloading(true);
        setError("");
        const res = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        if (!res.ok) throw new Error("something went wrong");
        const data = await res.json();
        setMovies(data.Search);
        console.log(data.Search);
        setIsloading(false);
      } catch (err) {
        setError(err.message);
      }
    }

    if (query < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovie();
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <BoxMovies>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovieID={HandleSelectMovieId} />}
        </BoxMovies>
        <BoxMovies>
          {selectedMovieId ? (
            <MovieDetails selectId={selectedMovieId} onCloseMovie={HandleClosedMovie} onAddWatched={HandleAddWatch} watched={watched} />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} onDeleteWatched={HandleDeleteWatch} />
            </>
          )}
        </BoxMovies>
      </Main>
    </>
  );
}
