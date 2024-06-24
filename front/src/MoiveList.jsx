import React, { useEffect } from "react";

export default function MovieList({
  movies,
  totalMovies,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  searchList,
}) {
  const totalPages = Math.ceil(totalMovies / itemsPerPage);

  //   useEffect(() => {
  //     searchList();
  //   }, [currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const renderPageNumbers = () => {
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);
    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 mx-1 border rounded ${
            i === currentPage ? "font-bold" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className='px-16 mt-10'>
      <div className='font-bold'>총 : {totalMovies}건</div>
      <table className='border-2 w-full'>
        <thead>
          <tr>
            <th className='border-top-custom bg-gray-100'>영화명</th>
            <th className='border-top-custom bg-gray-100'>영화명(영문)</th>
            <th className='border-top-custom bg-gray-100'>영화코드</th>
            <th className='border-top-custom bg-gray-100'>제작연도</th>
            <th className='border-top-custom bg-gray-100'>제작국가</th>
            <th className='border-top-custom bg-gray-100'>유형</th>
            <th className='border-top-custom bg-gray-100'>장르</th>
            <th className='border-top-custom bg-gray-100'>제작상태</th>
            <th className='border-top-custom bg-gray-100'>감독</th>
            <th className='border-top-custom bg-gray-100'>제작사</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={index}>
              <td className='text-center align-middle'>{movie.영화명}</td>
              <td className='text-center align-middle'>{movie.영화명영문}</td>
              <td className='text-center align-middle'>{movie.영화코드}</td>
              <td className='text-center align-middle'>{movie.제작연도}</td>
              <td className='text-center align-middle'>{movie.제작국가}</td>
              <td className='text-center align-middle'>{movie.유형}</td>
              <td className='text-center align-middle'>{movie.장르}</td>
              <td className='text-center align-middle'>{movie.제작상태}</td>
              <td className='text-center align-middle'>{movie.감독}</td>
              <td className='text-center align-middle'>{movie.제작사}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-center mt-10 space-x-2'>
        <button
          className='px-3 py-1 border rounded'
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        <button
          className='px-3 py-1 border rounded'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {renderPageNumbers()}
        <button
          className='px-3 py-1 border rounded'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
        <button
          className='px-3 py-1 border rounded'
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}
