import "./App.css";

function App() {
  return (
    <div className="flex flex-col gap-[2rem]">
      <h1 className="text-4xl font-bold">
        Welcome to Geo Scavenger Hunt - Your Ultimate Adventure Awaits!🌍🔍🏞️
      </h1>

      <a
        className="text-2xl underline"
        href="https://www.figma.com/file/ZhlbOvlkBbcFFk4VikCMqq/cs484-checkpoint-1?type=whiteboard&node-id=0-1&t=vqTg9O9zLMPmHQJy-0"
      >
        Excalidraw Diagram
      </a>

      <div>
        <strong className="text-[1.5rem]">MVP</strong>
        <p>
          This project entails setting up OAuth-based authentication and
          authorization for users, creating React front-end interfaces
          (including login pages) for admin and player views, establishing an
          Express server with PostgreSQL databases, and implementing core API
          communication between the views and the server. Integration of
          external APIs like Google Maps and QR scanning APIs will enhance
          functionality. The development of server-side code will accommodate
          these features and ensure seamless operation, serving both admin and
          player needs.
        </p>
      </div>

      <div>
        <strong className="text-[1.5rem]">Participant APIs</strong>
        <p>
          solveTask: verifying the solution (text or QR scan) and adding it to
          the progress. Or Joining the Game if not joined yet. Give you the next
          clue.
        </p>
        <p>viewProgress: Reads the progress of the user.</p>
        <p>
          viewLeaderboards: Reads and sorts the progress of players involved in
          the game.
        </p>
        <p>
          pingCloseness: checks the participant’s closeness to the QR/clue and
          expresses it in coldness/hotness - metaphors.
        </p>
      </div>

      <div>
        <strong className="text-[1.5rem]">Admin APIs</strong>
        <p>
          createGame: enter clues and constraints for a new game and create one.
        </p>
        <p>
          generateQRs: generates QRs if relevant for the clues of the newly
          created location
        </p>
        <p>
          Register: to register the real-life locations of the QR in the game.
        </p>
        <p>
          modifyGame: admin will be able to modify game components such as
          locations of QR and the type of problem/hint that the user gets.
        </p>
        <p>
          viewGame: The admin has a full perspective of the game stats while the
          users are playing.
        </p>
      </div>
    </div>
  );
}

export default App;
