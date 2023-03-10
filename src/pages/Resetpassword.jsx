
import logobg from "../images/logobg.png"
import { useState } from "react"
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";



const Resetpassword = () => {


    const navigate = useNavigate()

    const [err, setErr] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = e.target[0].value

       
       try {
        sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
        alert("A password reset Email has been sent to your email address")
       } catch (error) {
        setErr(true)
       }
       
    }


    return ( 
        <div>
            <section className="register">
                <div className="logo"><img src={logobg} alt="" /></div>
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit} className="form2 resetform">
                    <label for="email" className="resetEmailLanbel">Your Email</label>
                    <input type="email" name="email" id="email"/>
                    <button className="button" style={{color:"white"}}>Reset Password</button>
                </form>
            </section>
        </div>
     );
}
 
export default Resetpassword;