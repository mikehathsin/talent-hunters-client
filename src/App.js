import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { Involved } from "./components/involved";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

function App() {
  let navigate = useNavigate();

  useEffect(() => {
    // const fetch = async () => {
    //   const querySnapshot = await getDocs(collection(db, "users"));
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()}`);
    //   });
    // };
    // fetch();
    const user = localStorage.getItem("user");
    if (JSON.parse(user)) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Talent Hunters for Sistemas distribuidos</h1>
      <header
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/signin">
          <Button>Iniciar sesión</Button>
        </Link>
        <Link to="/signup">
          <Button>Crear cuenta nueva</Button>
        </Link>
      </header>
      <Involved />
    </div>
  );
}

export default App;
