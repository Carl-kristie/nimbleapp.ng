
import logobg from "../images/logobg.png"
import { useState } from "react"
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";



const Login = () => {


    const navigate = useNavigate()

    const [err, setErr] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = e.target[0].value
        const password = e.target[1].value

       
       try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/")
       } catch (error) {
        setErr(true)
       }
       
    }


    return ( 
        <div>
            <section className="register">
                <div className="logo"><img src={logobg} alt="" /></div>
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit} className="form2">
                    <label for="email">Your Email</label>
                    <input type="email" name="email" id="email"/>
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password"/>
                    {err && <span style={{color:"red"}}>Incorrect email or password</span>}
                    <div className="reset"><a href="./resetpassword">Reset Password</a></div>
                    <button className="button">Login</button>
                </form>
               <Link className="logreg" to="/register">Register Your Account</Link>
            </section>
        </div>
     );
}
 
export default Login;