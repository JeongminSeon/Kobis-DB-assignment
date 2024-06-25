import pymysql
from db_conn import open_db, close_db

def create_indexes():
    conn, cur = open_db('kobis')
    try:
        index_creation_sql = """
        -- Movie 테이블에 단일 인덱스 추가
        CREATE INDEX idx_movie_title ON Movie (title);
        CREATE INDEX idx_movie_year ON Movie (year);
        CREATE INDEX idx_movie_release_date ON Movie (enter_date);

        -- Director 테이블에 단일 인덱스 추가
        CREATE INDEX idx_director_name ON Director (name);

        -- Casting 테이블에 단일 인덱스 추가
        CREATE INDEX idx_casting_movie_director ON Casting (movie_id, director_id);

        -- Genre 테이블에 단일 인덱스 추가
        CREATE INDEX idx_genre_movie ON Genre (movie_id);

        -- 복합 인덱스 추가
        CREATE INDEX idx_movie_title_year ON Movie (title, year);
        CREATE INDEX idx_movie_year_enter_date ON Movie (year, enter_date);
        CREATE INDEX idx_casting_director_movie ON Casting (director_id, movie_id);
        """
        for statement in index_creation_sql.split(';'):
            if statement.strip():
                cur.execute(statement)
        conn.commit()
        print("인덱스가 성공적으로 생성되었습니다.")
    except pymysql.MySQLError as e:
        print(f"인덱스 생성 중 오류가 발생했습니다: {e}")
        conn.rollback()
    finally:
        close_db(conn, cur)

if __name__ == "__main__":
    create_indexes()
