import "./playerView.css";
interface leader {
    ranking: string;
    player_name: string;
    solved_clues: number;
    time: string;
}

const Leaderboards = () => {

    // this is dummy data
    var leaderboards: Array<leader> = [
        {
            ranking: "1",
            player_name: "Ali",
            solved_clues: 4,
            time: "10/29/23 08:45pm"
        },
        {
            ranking: "2",
            player_name: "Tai",
            solved_clues: 4,
            time: "10/29/23 08:46pm"
        },
        {
            ranking: "3",
            player_name: "Vishal",
            solved_clues: 4,
            time: "10/29/23 08:47pm"
        },
        {
            ranking: "4",
            player_name: "Hema",
            solved_clues: 3,
            time: "10/29/23 08:50pm"
        },
    ]




    return (
        <div className="leaderboardsContainer position-relative" >
            <h3 style={{ textAlign: "center" }} >Current Leaderboards</h3>
            <div style={{ alignItems: "center" }}>

                <table style={{ width: "9vh" }}>
                    <tr>
                        <th>Rankings</th>
                        <th>Name of the player</th>
                        <th>Clues Solved</th>
                        <th>TimeStamp of Last Clue Solved</th>
                    </tr>
                    {leaderboards.map((element: leader) =>
                        <tr>
                            <td>{element.ranking}</td>
                            <td>{element.player_name}</td>
                            <td>{element.solved_clues}</td>
                            <td>{element.time}</td>
                        </tr>)}

                </table>
            </div>
        </div>
    );
}

export default Leaderboards;