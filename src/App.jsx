// import { useState } from "react";
import "./App.css";
import RoutesLink from "./routes/RoutesLink";
import { Toaster } from "react-hot-toast";

// import axios from "axios";
// import { useEffect } from "react";
// import { useState } from "react";

function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <RoutesLink />
    </div>
  );
}

export default App;
