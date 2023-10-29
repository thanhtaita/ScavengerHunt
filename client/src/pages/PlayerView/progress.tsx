import "./playerView.css";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; 


const solvedClues =  [
    "This creature is known for its hump and ability to survive in the desert. It's not a horse, but it can carry heavy loads.",
    "Often seen in the night sky, twinkling from afar. They're not as close as the moon, but they make up constellations.",
    "It's the season of falling leaves and pumpkin spice. Before winter, but after summer's nice.",
    "A tool used by writers, but it's not a pen. It's digital and often comes with apps, again and again.",
    "This fruit is yellow and can be quite long. Monkeys love it and it's often in a song.",
    "A building where books are kept in rows. Quiet is requested, as everybody knows.",
    "It's a game played on a board with black and white squares. Knights, bishops, and rooks, moving with care.",
    "This monument stands tall in France's capital city. It's not the Louvre, but its view is pretty.",
    "A mammal that's known to hang upside down. Nocturnal in nature, it flies around town.",
    "It's the first meal of the day, often with toast. Some like it with bacon, or jam as a boast.",
    "This monument stands tall in France's capital city. It's not the Louvre, but its view is pretty.",
    "A mammal that's known to hang upside down. Nocturnal in nature, it flies around town.",
    "It's the first meal of the day, often with toast. Some like it with bacon, or jam as a boast."
];
const currentClue = "This instrument has black and white keys in a row. It's not a wind instrument, but its music can flow.";
const totalClues = 20;

const Progress = () => {
    //Piechart 
    const solvedCount = solvedClues.length;
    const currentCount = 1;
    const cluesToSolve = totalClues - solvedCount - currentCount;

    const pieData = {
        labels: ['Solved Clues', 'Current Clue', 'Clues to Solve'],
        datasets: [{
            data: [solvedCount, currentCount, cluesToSolve],
            backgroundColor:["#69BF4F", "#FFC36B", "#C2C2C2"]
        }]
    }

    return (
            <div className="progressContainer">
                <div className="clues">
                    <div className="currentClue">
                        <h4>Current Clue</h4>
                        <ul><li>{currentClue}</li></ul>
                    </div>
                    <div className="solvedClues">
                        <h4>Solved Clues</h4>
                        <ul className="scrollableList">
                            {solvedClues.map((clue, index) => (
                                <li key={index}>{clue}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="pieChart">
                    <Pie data={pieData}/>
                </div>
            </div>
    );
}

export default Progress;