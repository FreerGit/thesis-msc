import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

// Function to generate a UUID (v4)
const generateNonce = () => crypto.randomUUID();

function App() {
  const nonce = generateNonce();

  useEffect(() => {
    const socket = new WebSocket("ws://4.231.235.89:8000");
    socket.onopen = () => {
      console.log("WebSocket connected, sending nonce...");
      socket.send(JSON.stringify({ nonce }));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [nonce]);


  return (
    <div style={containerStyle}>
      <div style={qrContainerStyle}>
        <h1 style={{ color: "black" }}>Scan this QR Code</h1>
        <QRCodeSVG value={JSON.stringify({ type: "createVC", nonce: nonce })} size={250} level="H" fgColor="#000000" bgColor="#ffffff" />
        <p>Nonce: {nonce}</p>
      </div>
    </div>
  );
}

const containerStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f4f4f4",
};

const qrContainerStyle = {
  textAlign: "center" as const,
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
};

export default App;
