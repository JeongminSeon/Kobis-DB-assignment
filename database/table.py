import pymysql
from db_conn import open_db, close_db

def create_tables():
    conn, cur = open_db('kobis')
    try:
        table_creation_sql = """
        DROP TABLE IF EXISTS Movie;
        DROP TABLE IF EXISTS Director;
        DROP TABLE IF EXISTS Casting;
        DROP TABLE IF EXISTS Genre;
        
        CREATE TABLE Movie (
            movie_id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            title_eng VARCHAR(255) NULL,
            year INT NULL,
            country VARCHAR(255) NULL,
            category VARCHAR(255) NULL,
            status VARCHAR(255) NULL,
            company VARCHAR(255) NULL,
            enter_date DATETIME DEFAULT NOW()
        );

        CREATE TABLE Director (
            director_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            enter_date DATETIME DEFAULT NOW(),
            UNIQUE (name)
        );

        CREATE TABLE Casting (
            casting_id INT PRIMARY KEY AUTO_INCREMENT,
            movie_id INT,
            director_id INT,
            FOREIGN KEY (movie_id) REFERENCES Movie(movie_id),
            FOREIGN KEY (director_id) REFERENCES Director(director_id)
        );

        CREATE TABLE Genre (
            genre_id INT PRIMARY KEY AUTO_INCREMENT,
            movie_id INT,
            genre_name VARCHAR(255),
            FOREIGN KEY (movie_id) REFERENCES Movie(movie_id)
        );
        """
        for statement in table_creation_sql.split(';'):
            if statement.strip():
                cur.execute(statement)
        conn.commit()
        print("테이블이 성공적으로 생성되었습니다.")
    except pymysql.MySQLError as e:
        print(f"테이블 생성 중 오류가 발생했습니다: {e}")
        conn.rollback()
    finally:
        close_db(conn, cur)

if __name__ == "__main__":
    create_tables()
