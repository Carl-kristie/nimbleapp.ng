
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
        const firstName = e.target[0].value
        const lastName = e.target[1].value
        const displayName = e.target[2].value
        const email = e.target[3].value
        const countryCode = e.target[4].value
        const phone = e.target[5].value
        const password = e.target[6].value
        const password2 = e.target[7].value
        let photoURL = defaultImage
        if (password != password2) {
            alert("passwords don't match")
        } else {
               try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, "users", res.user.uid),{
            uid: res.user.uid,
            firstName,
            lastName,
            displayName,
            email,
            countryCode,
            phone,
            photoURL,
            password
       })

       await setDoc(doc(db, "userChats", res.user.uid), {})
       navigate("/")
       } catch (error) {
        setErr(true)
       }
        }

        
       
    }
    return ( 
        <div>
             <section className="register">
             <div className="logo"><img src={logobg} alt="" /></div>
    <h2>Create Your Account</h2>
    {err && <span>Something went wrong</span>}
    <form onSubmit={handleSubmit}>
        <label for="firstname">First Name</label>
        <input type="text" name="firstname"  required id="firstname"/>
        <label for="lastname">Last Name</label>
        <input type="text" name="lastname" required id="lastname"/>
        <label for="firstname">Username</label>
        <input type="text" name="username" required id="username"/>
        <label for="email">Your Email</label>
        <input type="email" name="email" required id="email"/>
        <div className="phone">
            <label for="phonenumber">Phone</label>
            <select name="prefix" id="prefix">
                <option value="ng">NG +234</option>
            </select>
            <input type="number" name="" required minLength={11} id=""/>
        </div>
        <label for="password">Password</label>
        <input type="password" name="password" required minLength={8} id="password"/>
        <label for="repassword">Re-enter Password</label>
        <input type="password" name="repassword" required minLength={8} id="repassword"/>
        <button className="button" style={{color:"white"}}>Continue</button> 
        </form>
        <Link className="logreg" to="/login">Login</Link>
            </section>
        </div>
     );
}
 
export default Register;