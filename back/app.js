const express = require("express");
const mysql = require("mysql2"); // mysql 대신 mysql2 사용
const app = express();
const cors = require("cors");
const port = 8000;

// CORS 설정 추가
app.use(cors());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kobis",
  charset: "utf8mb4",
});

// MySQL 데이터베이스 연결
db.connect((err) => {
  if (err) {
    console.error("데이터베이스 연결에 실패했습니다. :", err);
    return;
  }
  console.log("데이터베이스 연결 성공");
});

// API 엔드포인트 설정
app.get("/movies", (req, res) => {
  const {
    movieName,
    directorName,
    productionYearFrom,
    productionYearTo,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  let sqlQuery = `
    SELECT 
      Movie.movie_id AS 영화코드,
      Movie.title AS 영화명,
      Movie.title_eng AS 영화명영문,
      Movie.year AS 제작연도,
      Movie.country AS 제작국가,
      Movie.category AS 유형,
      Movie.status AS 제작상태,
      Movie.company AS 제작사,
      Director.name AS 감독,
      GROUP_CONCAT(Genre.genre_name) AS 장르
    FROM 
      Movie
    LEFT JOIN 
      Casting ON Movie.movie_id = Casting.movie_id
    LEFT JOIN 
      Director ON Casting.director_id = Director.director_id
    LEFT JOIN 
      Genre ON Movie.movie_id = Genre.movie_id
    WHERE 1=1
  `;

  let countQuery = `
    SELECT COUNT(DISTINCT Movie.movie_id) AS total
    FROM 
      Movie
    LEFT JOIN 
      Casting ON Movie.movie_id = Casting.movie_id
    LEFT JOIN 
      Director ON Casting.director_id = Director.director_id
    LEFT JOIN 
      Genre ON Movie.movie_id = Genre.movie_id
    WHERE 1=1
  `;

  const params = [];

  if (movieName) {
    sqlQuery += " AND Movie.title LIKE ?";
    countQuery += " AND Movie.title LIKE ?";
    params.push(`%${movieName}%`);
  }

  if (directorName) {
    sqlQuery += " AND Director.name LIKE ?";
    countQuery += " AND Director.name LIKE ?";
    params.push(`%${directorName}%`);
  }

  if (productionYearFrom) {
    sqlQuery += " AND Movie.year >= ?";
    countQuery += " AND Movie.year >= ?";
    params.push(productionYearFrom);
  }

  if (productionYearTo) {
    sqlQuery += " AND Movie.year <= ?";
    countQuery += " AND Movie.year <= ?";
    params.push(productionYearTo);
  }

  if (startDate) {
    sqlQuery += " AND Movie.enter_date >= ?";
    countQuery += " AND Movie.enter_date >= ?";
    params.push(startDate);
  }

  if (endDate) {
    sqlQuery += " AND Movie.enter_date <= ?";
    countQuery += " AND Movie.enter_date <= ?";
    params.push(endDate);
  }

  sqlQuery += `
    GROUP BY 
      Movie.movie_id,
      Movie.title,
      Movie.title_eng,
      Movie.year,
      Movie.country,
      Movie.category,
      Movie.status,
      Movie.company,
      Director.name
  `;
  sqlQuery += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit));
  params.push((parseInt(page) - 1) * parseInt(limit));

  console.log("Count Query Params:", params.slice(0, -2));
  console.log("SQL Query Params:", params);

  db.query(countQuery, params.slice(0, -2), (err, countResults) => {
    if (err) {
      console.error("총 레코드 수 조회에 실패했습니다. :", err);
      res.status(500).send("서버 오류");
      return;
    }

    const total = countResults[0].total;

    db.query(sqlQuery, params, (err, results) => {
      if (err) {
        console.error("쿼리 실행에 실패했습니다. :", err);
        res.status(500).send("서버 오류");
        return;
      }

      res.json({ movies: results, total });
    });
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
