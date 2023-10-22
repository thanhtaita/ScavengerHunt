import { useParams } from "react-router-dom";
const AdminGame = () => {
  const { id } = useParams(); // id is a string
  return (
    <div>
      <h1>This is the admin page of game {id}</h1>
    </div>
  );
};

export default AdminGame;
