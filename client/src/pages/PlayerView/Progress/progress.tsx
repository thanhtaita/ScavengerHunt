import "./progress.css";
import { useRef, useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; 
import { useContext } from "react";
import { AuthContext } from "../../../utils/context";
import { useParams } from "react-router-dom";

interface MyComponentState {
    data: any; // Replace 'any' with the actual data type you expect
    loading: boolean;
    error: Error | null;
  }

// const solvedClues =  [
//     "This creature is known for its hump and ability to survive in the desert. It's not a horse, but it can carry heavy loads.",
//     "Often seen in the night sky, twinkling from afar. They're not as close as the moon, but they make up constellations.",
//     "It's the season of falling leaves and pumpkin spice. Before winter, but after summer's nice.",
//     "A tool used by writers, but it's not a pen. It's digital and often comes with apps, again and again.",
//     "This fruit is yellow and can be quite long. Monkeys love it and it's often in a song.",
//     "A building where books are kept in rows. Quiet is requested, as everybody knows.",
//     "It's a game played on a board with black and white squares. Knights, bishops, and rooks, moving with care.",
//     "This monument stands tall in France's capital city. It's not the Louvre, but its view is pretty.",
//     "A mammal that's known to hang upside down. Nocturnal in nature, it flies around town.",
//     "It's the first meal of the day, often with toast. Some like it with bacon, or jam as a boast.",
//     "This monument stands tall in France's capital city. It's not the Louvre, but its view is pretty.",
//     "A mammal that's known to hang upside down. Nocturnal in nature, it flies around town.",
//     "It's the first meal of the day, often with toast. Some like it with bacon, or jam as a boast."
// ];
// const currentClue = "This instrument has black and white keys in a row. It's not a wind instrument, but its music can flow.";
// const totalClues = 20;

const defaultPieData = {
    labels: ['Solved Clues', 'Current Clue', 'Clues to Solve'],
    datasets: [{
        data: [0, 0, 0], // Default values
        backgroundColor: ["#69BF4F", "#FFC36B", "#C2C2C2"]
    }]
};

const Progress = () => {
    

    const [solvedClues, setSolvedClues] = useState([]);
    const [unsolvedClues, setUnsolvedClues] = useState([]);
    const [totalClues, setTotalClues] = useState(0);
    const [pieData, setPieData] = useState(defaultPieData);


    const { user } = useContext(AuthContext);
    const { gameId } = useParams<{ gameId: string }>();

    const [state, setState] = useState<MyComponentState>({
        data: null,
        loading: true,
        error: null,
    });

    let result = null;
    if (user)  
    { const uid = user.email; 
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:9999/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required
                },
                body: JSON.stringify({ uid, gameId })
                });

                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }

                result = await response.json();
                console.log("Result", result);
                
                if (!result) { // Check if result is null or undefined
                    throw new Error('No result returned from the API');
                }
                const { solvedCluesDescrip, unsolvedCluesDescrip, total_clues } = result;
                setSolvedClues(solvedCluesDescrip);
                setUnsolvedClues(unsolvedCluesDescrip);
                setTotalClues(total_clues);
                const solvedCount = solvedClues.length;
                const currentCount = unsolvedClues.length;
                const cluesToSolve = totalClues - solvedCount - currentCount;

                const newPieData = {
                    labels: ['Solved Clues', 'Current Clue', 'Clues to Solve'],
                    datasets: [{
                        data: [solvedCount, currentCount, cluesToSolve],
                        backgroundColor:["#69BF4F", "#FFC36B", "#C2C2C2"]
                    }]
                }
                setPieData(newPieData);
                console.log(pieData);


                setState({ data: result, loading: false, error: null });
            } catch (error) {
                if (error instanceof Error) {
                    setState({ data: null, loading: false, error: error });
                }
            } finally {
                if (state.loading){
                    setState(prevState => ({ ...prevState, loading: false }));
                }
                // setState({ data: null, loading: false, error: new Error('An unknown error occurred') });
            }
        }

        fetchData();
    }, []);
    }

    if (state.loading) return <div>Loading...</div>;
    if (state.error) return <div>Error: {state.error.message}</div>;
    if (result){
        //Piechart 
        
    }


    
    return (
            <div className="progressContainer">
                
            <p className="progressTitle">Progress</p>
            
                <div className="clues">
                    {/* <div className="currentClue">
                    <p className="currentClues">Current Clue</p>
                        <ul><li>{currentClue}</li></ul>
                    </div> */}
                    <div className="solvedClues">
                        <p className="solvedTitle"> Current Clue(s)</p>
                        <ul className="scrollableList">
                            {unsolvedClues.map((clue, index) => (
                                <li key={index}>{clue}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="solvedClues">
                        <p className="solvedTitle"> Solved Clues</p>
                        <ul className="scrollableList">
                            {solvedClues.map((clue, index) => (
                                <li key={index}>{clue}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="pieChart">
                    <Pie data={pieData} />
                </div>
            </div>
    );
}

export default Progress;