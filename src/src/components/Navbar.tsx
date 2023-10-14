import React from "react";

export function Navbar(props: {
  gameId: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const loginPage = () => {
    // TODO: will change the page of user to login
  };

  return (
    <div className="header">
      <input
        type="number"
        placeholder="Search with Game ID"
        value={props.gameId}
        onChange={props.handleSearchChange}
      />
      <button className="login" onClick={() => loginPage()}>
        Login
      </button>
    </div>
  );
}
