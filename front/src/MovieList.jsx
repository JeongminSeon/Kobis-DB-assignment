import React, { useEffect } from "react";

export default function MovieList({
  movies,
  totalMovies,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  const totalPages = Math.ceil(totalMovies / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  return (
    <div className='mt-4'>
      <div className='font-bold'>총 : {totalMovies}건</div>
      {totalMovies === 0 ? (
        <div className='mt-2 text-3xl'>검색된 데이터가 존재하지 않습니다.</div>
      ) : (
        <table className='border-2 w-full mt-2 text-center'>
          <thead>
            <tr>
              <th className='border-top-custom bg-gray-100 '>영화명</th>
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
            {movies.map((movie) => (
              <tr key={movie.영화코드}>
                <td className='p-2'>{movie.영화명 || ""}</td>
                <td>{movie.영화명영문 || ""}</td>
                <td>{movie.영화코드 || ""}</td>
                <td>{movie.제작연도 || ""}</td>
                <td>{movie.제작국가 || ""}</td>
                <td>{movie.유형 || ""}</td>
                <td>{movie.장르 || ""}</td>
                <td>{movie.제작상태 || ""}</td>
                <td>{movie.감독 || ""}</td>
                <td>{movie.제작사 || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {totalMovies > 0 && (
        <div className='flex justify-center space-x-2 mt-4'>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={currentPage === pageNum}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </button>
        </div>
      )}
    </div>
  );
}
