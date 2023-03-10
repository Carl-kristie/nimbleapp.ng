
import logobg from "../images/logobg.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth, db} from "../firebase"
import { useState } from "react";
import {doc, setDoc} from "firebase/firestore"
import defaultImage from "../images/user.png"
import { useNavigate, Link } from "react-router-dom";




const Register = () => {

    const navigate = useNavigate()

    const [err, setErr] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const displayName = e.target[0].value
        const email = e.target[1].value
        const phone = e.target[2].value
        const password = e.target[4].value
        let photoURL = defaultImage
       

        
       try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, "admins", res.user.uid),{
            uid: res.user.uid,
            displayName,
            email,
            phone,
            photoURL,
       })

       await setDoc(doc(db, "userChats", res.user.uid), {})
       navigate("/")
       } catch (error) {
        setErr(true)
       }
       
    }
    return ( 
        <div>
             <section className="register">
             <div className="logo"><img src={logobg} alt="" /></div>
    <h2>Create Your Account</h2>
    {err && <span>Something went wrong</span>}
    <form onSubmit={handleSubmit}>
        <label for="firstname">Username</label>
        <input type="text" name="username" id="username"/>
        <label for="email">Your Email</label>
        <input type="email" name="email" id="email"/>
        <div className="phone">
            <label for="phonenumber">Phone</label>
            <select name="prefix" id="prefix">
                <option value="ng">NG +234</option>
            </select>
            <input type="number" name="" id=""/>
        </div>
        <label for="password">Password</label>
        <input type="password" name="password" id="password"/>
        <label for="repassword">Re-enter Password</label>
        <input type="password" name="repassword" id="repassword"/>
        <button className="button">Continue</button> 
        </form>
        <Link className="logreg" to="/login">Login</Link>
            </section>
        </div>
     );
}
 
export default Register;