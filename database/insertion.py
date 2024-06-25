import pymysql
import xlrd
from pymysql.err import MySQLError
from db_conn import open_db, close_db  # db_conn.py에서 import
from table import create_tables

def insert_movie_data(sheet, conn, cur, start_row, batch_size=10000):
    try:
        movie_sql = """
            INSERT INTO Movie (title, title_eng, year, country, category, status, company)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                title_eng = VALUES(title_eng),
                year = VALUES(year),
                country = VALUES(country),
                category = VALUES(category),
                status = VALUES(status),
                company = VALUES(company),
                enter_date = VALUES(enter_date)
        """
        movie_data = []
        for row_idx in range(start_row, sheet.nrows):  # start_row부터 읽기
            row = sheet.row(row_idx)
            movie_data.append((
                row[0].value,
                row[1].value if row[1].value != "" else None,
                int(row[2].value) if row[2].value != "" else None,
                row[3].value if row[3].value != "" else None,
                row[4].value if row[4].value != "" else None,
                row[6].value if row[6].value != "" else None,
                row[8].value if row[8].value != "" else None
            ))
        
        for i in range(0, len(movie_data), batch_size):
            cur.executemany(movie_sql, movie_data[i:i + batch_size])
            conn.commit()
            print(f"{i + batch_size} rows inserted into Movie")
        
        print("영화 데이터 삽입 완료")
    except MySQLError as e:
        print(f"Movie 데이터 삽입 중 에러가 발생했습니다: {e}")
        conn.rollback()
        
    
def insert_director_data(sheet, conn, cur, start_row, batch_size=10000):
    try:
        director_sql = """
            INSERT IGNORE INTO Director (name)
            VALUES (LOWER(%s))
        """
        director_data = []
        for row_idx in range(start_row, sheet.nrows):  # start_row부터 읽기
            director_name = sheet.cell(row_idx, 7).value
            if director_name and director_name != "":
                director_data.append((director_name.lower(),))
        
        for i in range(0, len(director_data), batch_size):
            cur.executemany(director_sql, director_data[i:i + batch_size])
            conn.commit()
            print(f"{i + batch_size} rows inserted into Director")
        
        print("감독 데이터 삽입 완료")
    except MySQLError as e:
        print(f"Director 데이터 삽입 중 에러가 발생했습니다: {e}")
        conn.rollback()


def insert_casting_data(sheet, conn, cur, start_row, batch_size=10000):
    try:
        cur.execute("SELECT movie_id, title FROM Movie")
        movie_dict = {row['title']: row['movie_id'] for row in cur.fetchall()}
        
        cur.execute("SELECT director_id, LOWER(name) as name FROM Director")
        director_dict = {row['name']: row['director_id'] for row in cur.fetchall()}
        
        casting_sql = """
            INSERT INTO Casting (movie_id, director_id)
            VALUES (%s, %s)
        """
        casting_data = []
        for row_idx in range(start_row, sheet.nrows):  # start_row부터 읽기
            row = sheet.row(row_idx)
            movie_id = movie_dict.get(row[0].value, None)
            director_name = row[7].value.lower()
            director_id = director_dict.get(director_name, None)
            if director_name == "":
                continue  # 감독 이름이 빈 문자열이면 무시
            if movie_id is None:
                print(f"Error: movie_id for '{row[0].value}' not found")
            if director_id is None:
                print(f"Error: director_id for '{director_name}' not found")
            if movie_id and director_id:
                casting_data.append((movie_id, director_id))
        
        for i in range(0, len(casting_data), batch_size):
            cur.executemany(casting_sql, casting_data[i:i + batch_size])
            conn.commit()
            print(f"{i + batch_size} rows inserted into Casting")
        
        print("캐스팅 데이터 삽입 완료")
    except MySQLError as e:
        print(f"Casting 데이터 삽입 중 에러가 발생했습니다: {e}")
        conn.rollback()


def insert_genre_data(sheet, conn, cur, start_row, batch_size=10000):
    try:
        cur.execute("SELECT movie_id, title FROM Movie")
        movie_dict = {row['title']: row['movie_id'] for row in cur.fetchall()}

        # 이미 존재하는 (movie_id, genre_name) 조합을 가져옵니다.
        cur.execute("SELECT movie_id, genre_name FROM Genre")
        existing_genres = {(row['movie_id'], row['genre_name']) for row in cur.fetchall()}

        genre_sql = """
            INSERT INTO Genre (movie_id, genre_name)
            VALUES (%s, %s)
        """
        genre_data = []
        for row_idx in range(start_row, sheet.nrows):  # start_row부터 읽기
            row = sheet.row(row_idx)
            movie_id = movie_dict.get(row[0].value, None)
            if movie_id is None:
                print(f"Error: movie_id for '{row[0].value}' not found")
            genres = row[5].value.split(',') if row[5].value else []
            for genre in genres:
                if movie_id and genre and (movie_id, genre) not in existing_genres:
                    genre_data.append((movie_id, genre))
                    existing_genres.add((movie_id, genre))  # 새로운 조합을 추가

        for i in range(0, len(genre_data), batch_size):
            cur.executemany(genre_sql, genre_data[i:i + batch_size])
            conn.commit()
            print(f"{i + batch_size} rows inserted into Genre")

        print("장르 데이터 삽입 완료")
    except MySQLError as e:
        print(f"Genre 데이터 삽입 중 에러가 발생했습니다: {e}")
        conn.rollback()


def insert_data(sheet1, sheet2, conn, cur, batch_size=10000):
    insert_director_data(sheet1, conn, cur, 1, batch_size)  # 첫 번째 시트는 첫 번째 행부터 데이터
    insert_movie_data(sheet1, conn, cur, 1, batch_size)
    insert_casting_data(sheet1, conn, cur, 1, batch_size)
    insert_genre_data(sheet1, conn, cur, 1, batch_size)
    insert_director_data(sheet2, conn, cur, 0, batch_size)  # 두 번째 시트는 첫 번째 행이 데이터
    insert_movie_data(sheet2, conn, cur, 0, batch_size)
    insert_casting_data(sheet2, conn, cur, 0, batch_size)
    insert_genre_data(sheet2, conn, cur, 0, batch_size)

if __name__ == "__main__":
    # 엑셀 파일 읽기
    file_path = '../../movie_list.xls'  # 엑셀 파일 경로
    wb = xlrd.open_workbook(file_path)
    sheet1 = wb.sheet_by_index(0)  # 첫 번째 시트
    sheet2 = wb.sheet_by_index(1)  # 두 번째 시트

    # 데이터베이스 연결
    conn, cur = open_db('kobis')  # 데이터베이스 이름 확인
    if conn and cur:
        create_tables() 
        insert_data(sheet1, sheet2, conn, cur)
        close_db(conn, cur)
