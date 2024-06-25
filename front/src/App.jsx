import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MovieList from "./MovieList";
import axios from "axios";

export default function App() {
  const ITEMS_PER_PAGE = 10;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [movieName, setMovieName] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [productionYearFrom, setProductionYearFrom] = useState("");
  const [productionYearTo, setProductionYearTo] = useState("");
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const options = Array.from(
    { length: 2024 - 1924 + 1 },
    (_, index) => 1924 + index
  );

  const submitHandler = (e) => {
    e.preventDefault();
    searchList();
  };

  const searchList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/movies", {
        params: {
          movieName,
          directorName,
          productionYearFrom,
          productionYearTo,
          startDate,
          endDate,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        },
      });
      setMovies(response.data.movies);
      setTotalMovies(response.data.total);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
    setIsLoading(false);
  };

  const searchReset = () => {
    setMovieName("");
    setDirectorName("");
    setProductionYearFrom("");
    setProductionYearTo("");
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    searchList();
  }, [currentPage]);

  return (
    <div className='min-w-[1440px] w-screen p-16'>
      <form
        onSubmit={submitHandler}
        className='p-16 w-full border-t border-b border-gray-400'
      >
        <div className='grid grid-cols-3'>
          <div className='flex flex-col'>
            <div className='flex items-center mb-4'>
              <strong className='dot01 w-28 min-w-[80px]'>영화명</strong>
              <input
                type='text'
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                className='mx-2 mt-1 block border-2 w-[225px]'
              />
            </div>
            <div className='flex items-center mb-4'>
              <strong className='dot01 w-28 min-w-[80px]'>제작연도</strong>
              <div>
                <select
                  value={productionYearFrom}
                  onChange={(e) => setProductionYearFrom(e.target.value)}
                  className='border-2 mx-2 w-[100px]'
                >
                  <option value=''>--전체--</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span>~</span>
                <select
                  value={productionYearTo}
                  onChange={(e) => setProductionYearTo(e.target.value)}
                  className='border-2 mx-2 w-[100px]'
                >
                  <option value=''>--전체--</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center mb-4'>
              <strong className='dot01 w-28 min-w-[80px]'>감독명</strong>
              <input
                type='text'
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className='mx-2 mt-1 block border-2 w-[225px]'
              />
            </div>
            <div className='flex items-center mb-4'>
              <strong className='dot01 w-28 min-w-[80px]'>개봉일자</strong>
              <DatePicker
                className='mx-2 border-2 w-[100px]'
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat='yyyy-MM-dd'
                isClearable
              />
              <span>~</span>
              <DatePicker
                className='mx-2 border-2 w-[100px]'
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat='yyyy-MM-dd'
                isClearable
              />
            </div>
          </div>
          <div className='flex justify-end space-x-4 mt-4'>
            <button
              type='submit'
              className='w-[70px] h-[48px] bg-btn-blue rounded-md text-white'
            >
              조회
            </button>
            <button
              type='button'
              className='w-[70px] h-[48px] bg-btn-gray rounded-md text-white'
              onClick={searchReset}
            >
              초기화
            </button>
          </div>
        </div>
      </form>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MovieList
          movies={movies}
          totalMovies={totalMovies}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
