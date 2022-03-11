import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function SignIn() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const db = getFirestore();
  const auth = getAuth();
  const onClick = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const token = await user.getIdToken();
        const querySnapshot = await getDocs(collection(db, "users"));
        let data;
        querySnapshot.forEach((doc) => {
          if (doc.data().email === user.email) {
            data = doc.data().admin;
          }
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ token, admin: data, email })
        );
        navigate("/", { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <div style={{ minWidth: "400px" }}>
      <header className="App-header d-block">
        <h1 style={{ marginBottom: "28px" }}>Iniciar sesión</h1>
        <Link to="/">
          <Button style={{ marginBottom: "16px" }}>Regresar al Home</Button>
        </Link>

        <div>
          <Form onSubmit={onClick}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Correo electrónico"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Contraseña"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Iniciar sesión
            </Button>
          </Form>
        </div>
      </header>
    </div>
  );
}
