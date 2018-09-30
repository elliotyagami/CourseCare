import connection from './../database/mysqlConnect'

export const insertCookie = (body, func) => {
    let queryString = `INSERT INTO login(user_id, cookie, user_agent) VALUES
	((SELECT user_id FROM users WHERE email='${body.email}'), '${body.cookie}', '');`

    connection.query(queryString,func)
}
