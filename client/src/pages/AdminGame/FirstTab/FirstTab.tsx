import "./FirstTab.css";
import { useState } from "react";
const FirstTab = () => {
  const [clueNum, setClueNum] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [currentClueId, setCurrentClueId] = useState(1);
  return (
    <div className="first-tab">
      <div className="content">
        <h1>Fill Questions</h1>
        <div className="game-info">
          <div className="general-info">
            <form>
              <input type="text" placeholder="Game name" />
              <input type="text" placeholder="Game description" />
              <input type="date" placeholder="Start date" />
              <input type="date" placeholder="End date" />
              <div className="clues-info">
                <label>Enter clue information</label>
                <div className="scroll-container clues-list">
                  {clueNum.map((num) => (
                    <li className="scroll-item" key={num}>
                      Clue {num}
                    </li>
                  ))}
                </div>
              </div>
            </form>
          </div>
          <div className="each-question">
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Accusamus sed nisi qui nihil, omnis iure harum minus architecto
              expedita ipsum, delectus est, quos cum aliquam molestias nobis
              unde ea pariatur?
            </p>
          </div>
        </div>

        <button>Next</button>
      </div>
    </div>
  );
};

export default FirstTab;
