import pymysql
from pymysql.constants.CLIENT import MULTI_STATEMENTS

def open_db(dbname='kobis'):
    try:
        conn = pymysql.connect(
        host='localhost',
        user='root',
        passwd='',  # 여기에 실제 비밀번호를 입력하세요
        db=dbname,
        client_flag=MULTI_STATEMENTS,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
        )
        cur = conn.cursor()
        print("데이터베이스 연결 성공")
        return conn, cur
    
    except pymysql.MySQLError as e :
        print(f"데이터베이스 연결에 실패했습니다. : {e}")
        return None, None
    

def close_db(conn, cur):
    cur.close()
    conn.close()
    
    
