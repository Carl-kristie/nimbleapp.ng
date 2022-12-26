
import logobg from "../images/logobg.png"

const Register = () => {
    return ( 
        <div>
             <section className="register">
             <div className="logo"><img src={logobg} alt="" /></div>
    <h2>Create Your Account</h2>
    <form>
        <label for="firstname">First Name</label>
        <input type="text" name="firstname" id="firstname"/>
        <label for="lastname">Last Name</label>
        <input type="text" name="lastname" id="lastname"/>
        <label for="email">Your Email</label>
        <input type="email" name="email" id="email"/>
        <div className="phone">
            <label for="phonenumber">Phone</label>
            <select name="prefix" id="prefix">
                <option value="af">AF +93</option>
                <option value="ng">NG +234</option>
            </select>
            <input type="number" name="" id=""/>
        </div>
        <label for="password">Password</label>
        <input type="password" name="password" id="password"/>
        <label for="repassword">Re-enter Password</label>
        <input type="password" name="repassword" id="repassword"/>
        <input type="button" className="button" value="Continue"/>
    </form>
    <a href="./login.html" className="logreg ">Login</a>
            </section>
        </div>
     );
}
 
export default Register;