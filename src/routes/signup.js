import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccountType, setAdminAccountType] = useState(false);

  const db = getFirestore();
  const auth = getAuth();

  const addUser = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email,
        admin: adminAccountType,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onClick = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await addUser();
      const token = await user.getIdToken();
      localStorage.setItem(
        "user",
        JSON.stringify({ token, admin: adminAccountType, email })
      );
      navigate("/", { replace: true });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };

  return (
    <div style={{ minWidth: "400px" }}>
      <header className="App-header d-block">
        <h1 style={{ marginBottom: "28px" }}>Crear cuenta nueva</h1>
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

            <Form.Group className="mb-3">
              <Form.Check
                onChange={(e) => setAdminAccountType(false)}
                name="group1"
                type="radio"
                label="Busco empleo"
              />

              <Form.Check
                onChange={(e) => setAdminAccountType(true)}
                name="group1"
                type="radio"
                label="Busco trabajadores"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Registrarme
            </Button>
          </Form>
        </div>
      </header>
    </div>
  );
}
