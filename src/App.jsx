// import { useState } from "react";
import "./App.css";
import RoutesLink from "./routes/RoutesLink";
import { Toaster } from "react-hot-toast";
import { ConfirmProvider } from "material-ui-confirm";

// import axios from "axios";
// import { useEffect } from "react";
// import { useState } from "react";

// TODO : Membuat fitur admin ubah data pengguna

function App() {
  return (
    <ConfirmProvider>
      <div class="maincontainer bg-slate-100 min-h-screen">
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{ top: 80 }}
        />
        <RoutesLink />
      </div>
    </ConfirmProvider>
  );
}

export default App;
