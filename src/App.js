import { useEffect, useState } from "react";
import StartRating from "./StartRating";

const tempMovieData = [
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Year: "2013",
    Poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt1517268",
    Title: "Barbie",
    Year: "2023",
    Poster: "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
  },
  {
    imdbID: "tt8589698",
    Title: "Teenage Mutant Ninja Turtles: Mutant Mayhem",
    Year: "2023",
    Poster: "https://m.media-amazon.com/images/M/MV5BYzE4MTllZTktMTIyZS00Yzg1LTg1YzAtMWQwZTZkNjNkODNjXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Year: "2013",
    Poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
    runtime: 180,
    imdbRating: 8.6,
    userRating: 10,
  },
  {
    imdbID: "tt1517268",
    Title: "Barbie",
    Year: "2023",
    Poster: "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
    runtime: 114,
    imdbRating: 7.2,
    userRating: 8,
  },
];

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

function MovieDetails({ selectId, onCloseMovie }) {
  const [movie, setMovies] = useState({});
  const [isLoading, setIsloading] = useState(false);

  const { Title: title, Year: year, Released: released, Poster: poster, imdbRating, Runtime: runtime, Plot: plot, Genre: genre, Actors: actor, Director: director } = movie;

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
                <span>{imdbRating}</span>
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
              <StartRating max={10} size={24} color="#fcc419" />
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
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedItem({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
      </div>
    </li>
  );
}

function WatchedList({ watched }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie, index) => (
          <WatchedItem key={index} movie={movie} />
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
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState();
  const [query, setQuery] = useState("oppenheimer");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  function HandleSelectMovieId(id) {
    setSelectedMovieId((selectId) => (selectId === id ? null : id));
  }

  function HandleClosedMovie() {
    setSelectedMovieId(null);
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
            <MovieDetails selectId={selectedMovieId} onCloseMovie={HandleClosedMovie} />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} />
            </>
          )}
        </BoxMovies>
      </Main>
    </>
  );
}
