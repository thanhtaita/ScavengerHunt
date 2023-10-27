import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'new2',
  password: 'password',
  port: 5432,
})


const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const addUsers = (usr) => {
    console.log("usr: ",usr)
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
          throw error
        }
        if(results.rows){
            console.log(results.rows)

        }
      })

    pool.query("INSERT INTO users (name, email) VALUES ('"+String(usr.name)+"','"+String(usr.email)+"');", (error, results) => {
      if (error) {
        throw error
      }
      console.log(results)
    //   response.status(200).json(results.rows)
    })
  }

//   INSERT INTO users (name, email)
//   VALUES ('Hema', 'hema@uic.edu'), ('Joe', 'joe@uic.edu');



  export default addUsers

//   export default {getUsers,addUsers}
