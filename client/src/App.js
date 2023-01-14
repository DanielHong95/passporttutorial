import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);

  const register = () => {
    axios({
      method: "POST",
      data: { email: registerEmail, password: registerPassword },
      withCredentials: true,
      url: "http://localhost:5000/register",
    }).then((res) => console.log(res));
  };

  const login = () => {
    axios({
      method: "POST",
      data: { email: loginEmail, password: loginPassword },
      withCredentials: true,
      url: "http://localhost:5000/login",
    }).then((res) => console.log(res));
  };

  const user = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/users",
    }).then((res) => setData(res.data));
  };

  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <input
          placeholder="email"
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={register}>Submit</button>
      </div>
      <div>
        <h1>Login</h1>
        <input
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Submit</button>
      </div>
      <div>
        <h1>Get User</h1>
        <button onClick={user}>Submit</button>
        {data ? <h1>Welcome Back {data.username}</h1> : null}
      </div>
    </div>
  );
}

export default App;
