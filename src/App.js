import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegisterAdmin from "./pages/RegisterAdmin";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";



function App() {

  const {currentUser} = useContext(AuthContext)

  return (
    <BrowserRouter>
     <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={currentUser ? <Home/>: <Login/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="registeradmin" element={<RegisterAdmin/>}/>
        </Route>
      </Routes>
    </div>
    </BrowserRouter>
   
  );
}

export default App;
