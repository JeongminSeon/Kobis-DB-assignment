import pymysql
from db_conn import open_db, close_db

def create_indexes():
    conn, cur = open_db('kobis')
    try:
        index_creation_sql = """
        -- 인덱스 추가
        CREATE INDEX idx_title ON Movie (title);
        CREATE INDEX idx_director_name ON Director (name);
        CREATE INDEX idx_year ON Movie (year);
        CREATE INDEX idx_enter_date ON Movie (enter_date);
        CREATE INDEX idx_status ON Movie (status);
        CREATE INDEX idx_genre_name ON Genre (genre_name);
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
