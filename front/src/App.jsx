import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
import MovieList from "./MoiveList";

export default function App() {
  const mockData = [
    // Add some mock movie data here
    {
      영화명: "Movie 1",
      영화명영문: "Movie 1",
      영화코드: "123456",
      제작연도: 2022,
      제작국가: "한국",
      유형: "장편",
      장르: "드라마",
      제작상태: "개봉",
      감독: "Director 1",
      제작사: "Producer 1",
    },
    {
      영화명: "Movie 2",
      영화명영문: "Movie 2",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 3",
      영화명영문: "Movie 3",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 4",
      영화명영문: "Movie 4",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 5",
      영화명영문: "Movie 5",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 6",
      영화명영문: "Movie 6",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 7",
      영화명영문: "Movie 7",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 8",
      영화명영문: "Movie 8",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 9",
      영화명영문: "Movie 9",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 10",
      영화명영문: "Movie 10",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 11",
      영화명영문: "Movie 11",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
    {
      영화명: "Movie 12",
      영화명영문: "Movie 12",
      영화코드: "123457",
      제작연도: 2021,
      제작국가: "한국",
      유형: "장편",
      장르: "액션",
      제작상태: "개봉",
      감독: "Director 2",
      제작사: "Producer 2",
    },
  ];

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

  const options = Array.from(
    { length: 2024 - 1924 + 1 },
    (_, index) => 1924 + index
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    await searchList();
  };

  const searchList = async () => {
    const response = await axios.get("YOUR_API_ENDPOINT", {
      params: {
        movieName,
        directorName,
        productionYearFrom,
        productionYearTo,
        startDate: startDate ? startDate.toISOString().split("T")[0] : "",
        endDate: endDate ? endDate.toISOString().split("T")[0] : "",
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      },
    });
    setMovies(response.data.movies);
    setTotalMovies(response.data.total);
  };

  const searchReset = () => {
    setMovieName("");
    setDirectorName("");
    setProductionYearFrom("");
    setProductionYearTo("");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div>
      <div className='flex'>
        <h1 className='text-3xl mb-2'>201914175 선정민 기말 프로젝트 과제</h1>
      </div>
      <form
        onSubmit={submitHandler}
        className='p-16 w-[1200px] border-t border-b border-gray-400'
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
      <MovieList
        movies={mockData}
        totalMovies={mockData.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        searchList={searchList}
      />
    </div>
  );
}
