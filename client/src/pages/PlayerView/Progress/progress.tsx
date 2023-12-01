import "./progress.css";
import { useRef, useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useContext } from "react";
import { AuthContext } from "../../../utils/context";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti"



interface MyComponentState {
    data: any; // Replace 'any' with the actual data type you expect
    loading: boolean;
    error: Error | null;
}



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

    // useEffect(() => {
    //     if (unsolvedClues.length === 0) {
    //         confetti();
    //     }
    // }, [unsolvedClues]);

    let result = null;
    if (user) {
        const uid = user.email;
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
                    if (unsolvedCluesDescrip.length === 0) {
                        confetti();
                    }
                    setTotalClues(total_clues);
                    const solvedCount = solvedClues.length;
                    const currentCount = unsolvedClues.length;
                    const cluesToSolve = totalClues - solvedCount - currentCount;

                    const newPieData = {
                        labels: ['Solved Clues', 'Current Clue', 'Clues to Solve'],
                        datasets: [{
                            data: [solvedCount, currentCount, cluesToSolve],
                            backgroundColor: ["#69BF4F", "#FFC36B", "#C2C2C2"]
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
                    if (state.loading) {
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
    if (result) {
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
                    {unsolvedClues.length === 0 &&
                        <p className="solvedTitle" >
                            🎉 You've completed the game! Congrats! 🏆</p>

                    }{unsolvedClues.length !== 0 && <div>
                        <p className="solvedTitle"> Current Clue(s)</p>
                        <ul className="scrollableList">
                            {unsolvedClues.map((clue, index) => (
                                <li key={index}>{clue}</li>
                            ))}
                        </ul></div>}

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