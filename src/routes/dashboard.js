import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { getAuth } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const ref = useRef();
  const refNoAdmin = useRef();
  const db = getFirestore();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetch = async () => {
      // USER
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);

      // TOPICS
      const querySnapshotTopics = await getDocs(collection(db, "topics"));
      const thisTopics = [];
      querySnapshotTopics.forEach((topic) => {
        thisTopics.push(topic.data());
      });
      setTopics(thisTopics);

      // SUBSCRIPTIONS
      const subscriptions = [];
      const querySnapshotSubs = await getDocs(collection(db, "subscriptions"));
      querySnapshotSubs.forEach((sub) => {
        subscriptions.push({ ...sub.data(), id: sub.id });
      });
      setSubscriptions(subscriptions);
      // PROPOSALS
      const proposals = [];
      const querySnapshotProposals = await getDocs(collection(db, "proposals"));
      querySnapshotProposals.forEach((proposal) => {
        if (user.admin) {
          if (proposal.data().email === user.email) {
            proposals.push({ ...proposal.data(), id: proposal.id });
          }
        } else {
          const subsArray = subscriptions.map((s) => s.topic);
          if (subsArray.includes(proposal.data().topic)) {
            proposals.push({ ...proposal.data(), id: proposal.id });
          }
        }
      });
      setProposals(proposals);
      setLoading(false);
    };
    fetch();
  }, []);

  let navigate = useNavigate();
  const auth = getAuth();

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  const addProposal = async () => {
    try {
      const docRef = await addDoc(collection(db, "proposals"), {
        email: user.email,
        topic: ref.current.topic.value,
        title: ref.current.title.value,
        description: ref.current.description.value,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const addSubscription = async () => {
    try {
      const docRef = await addDoc(collection(db, "subscriptions"), {
        email: user.email,
        topic: refNoAdmin.current.topic.value,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProposal();
    handleClose();
  };

  const handleSubmitNoAdmin = async (e) => {
    e.preventDefault();
    await addSubscription();
    handleClose();
  };

  const sendMyEmail = async (proposalId) => {
    const document = doc(db, "proposals", proposalId);

    await updateDoc(document, {
      interested: arrayUnion(user.email),
    });
  };

  return (
    <div style={{ minWidth: "400px" }}>
      <header className="App-header d-block">
        <h1 style={{ marginBottom: "28px" }}>Dashboard</h1>
        <Link to="/">
          <Button
            style={{ marginBottom: "16px" }}
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/", { replace: true });
            }}
          >
            Cerrar sesión
          </Button>
        </Link>
        {user.admin ? (
          <div>
            <Button style={{ marginBottom: "16px" }} onClick={handleShow}>
              Crear nueva propuesta
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Nueva propuesta</Modal.Title>
              </Modal.Header>

              <Form ref={ref} onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="topic">
                    <Form.Select aria-label="Default select example">
                      <option>Selecciona un topico</option>
                      {topics.map((topic) => {
                        return <option value={topic.name}>{topic.name}</option>;
                      })}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Titulo</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
        ) : (
          <div>
            <Button style={{ marginBottom: "16px" }} onClick={handleShow}>
              Suscribirme
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Mis suscripciones</Modal.Title>
              </Modal.Header>

              <Form ref={refNoAdmin} onSubmit={handleSubmitNoAdmin}>
                <Modal.Body>
                  <Form.Group className="mb-3" controlId="topic">
                    <Form.Select aria-label="Default select example">
                      <option>Selecciona un topico</option>
                      {topics.map((topic) => {
                        return <option value={topic.name}>{topic.name}</option>;
                      })}
                    </Form.Select>

                    {subscriptions.map((sub) => {
                      return (
                        <Alert
                          variant="danger"
                          onClose={async () => {
                            await deleteDoc(doc(db, "subscriptions", sub.id));
                          }}
                          dismissible
                        >
                          <p>{sub.topic}</p>
                        </Alert>
                      );
                    })}
                  </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Suscribirme
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
        )}

        {user.admin && <h2>Mis propuestas</h2>}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {proposals.map((proposal) => {
            return (
              <Card key={proposal.id} style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{proposal.title}</Card.Title>
                  <Card.Text>{proposal.description}</Card.Text>
                  <Card.Subtitle>
                    {user.admin ? "Interesados" : "Notificar"}
                  </Card.Subtitle>

                  {user.admin ? (
                    proposal.interested.map((interested) => {
                      return <Card.Text>{interested}</Card.Text>;
                    })
                  ) : (
                    <Button onClick={() => sendMyEmail(proposal.id)}>
                      Enviar mi email
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </header>
    </div>
  );
}
