import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "sh_admin",
  host: "localhost",
  database: "sh_dbbb",
  password: "root",
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addUsers = (usr) => {
  // console.log("usr: ", usr);
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      // throw error
      console.log(error);
    }
    if (results.rows) {
      console.log(typeof results.rows);
      const h = results.rows.filter((row) => row["email"] === usr.email);
      console.log(h.length);
      if (h.length === 0) {
        console.log("i a, retuening");
        pool.query(
          "INSERT INTO users (name, email) VALUES ('" +
            String(usr.name) +
            "','" +
            String(usr.email) +
            "');",
          (error, results) => {
            if (error) {
              // throw error
              console.log(error);
            }
            console.log(results);
            //   response.status(200).json(results.rows)
          }
        );
        // return
      }
    }
  });

  // pool.query("INSERT INTO users (name, email) VALUES ('"+String(usr.name)+"','"+String(usr.email)+"');", (error, results) => {
  //   if (error) {
  //     // throw error
  //     console.log(error)
  //   }
  //   console.log(results)
  // //   response.status(200).json(results.rows)
  // })
};

//   INSERT INTO users (name, email)
//   VALUES ('Hema', 'hema@uic.edu'), ('Joe', 'joe@uic.edu');

export default addUsers;

//   export default {getUsers,addUsers}
