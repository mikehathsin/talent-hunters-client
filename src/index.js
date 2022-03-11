import "minireset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SignIn from "./routes/signin";
import Dashboard from "./routes/dashboard";
import SignUp from "./routes/signup";
import { initializeApp } from "firebase/app";
import Container from "react-bootstrap/Container";

const firebaseConfig = {
  apiKey: "AIzaSyBN5RKMIqFpNfpysoohX6XzJKwFs9lViEM",
  authDomain: "talent-hunters-for-sd.firebaseapp.com",
  projectId: "talent-hunters-for-sd",
  storageBucket: "talent-hunters-for-sd.appspot.com",
  messagingSenderId: "1001024272588",
  appId: "1:1001024272588:web:1a3c44fabf4c64084c6a69",
};

export const app = initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Container
        style={{ display: "flex", marginTop: "32px", justifyContent: "center" }}
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </Container>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
