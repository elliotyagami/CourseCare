import connection from '../../database/mysqlConnect'

export const insertCookie = (body, func) => {
    let queryString = `INSERT INTO login(user_id, cookie, user_agent) VALUES
	((SELECT user_id FROM users WHERE email='${body.email}'), '${body.cookie}', '');`

    connection.query(queryString,func)
}

export const checkCookie = (cookie, func) => {
    let queryString = `select login.user_id, users.username from login,
        users where login.cookie='${cookie}' and login.user_id=users.user_id LIMIT 1`

    connection.query(queryString,func)
}
