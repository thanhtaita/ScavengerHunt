import { useParams } from "react-router-dom";

const AdminGame = () => {
  const { id } = useParams(); // id is a string

  return (
    <>
      <h1>This is the admin page of game {id}</h1>
      <button onClick={() => window.location.assign("/process")}>
        process
      </button>
    </>
  );
};

export default AdminGame;
