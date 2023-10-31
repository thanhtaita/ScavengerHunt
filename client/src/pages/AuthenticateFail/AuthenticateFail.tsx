import "./AuthenticateFail.css";
const AuthenticateFail = () => {
  return (
    <div className="auth-fail">
      <h1>We can not identify your account</h1>
      <h2>Please log in</h2>
      <button onClick={() => window.location.assign("/")}>Main Page</button>
    </div>
  );
};
export default AuthenticateFail;
