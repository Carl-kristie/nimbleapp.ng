const Login = () => {
    return ( 
        <div>
            <section className="register">
                <div className="logo">YesPay</div>
                <h2>Welcome Back</h2>
                <form action="" className="form2">
                    <label for="email">Your Email</label>
                    <input type="email" name="email" id="email"/>
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password"/>
                    <div className="reset"><a href="./resetpassword">Reset Password</a></div>
                    <input type="button" className="button" value="Login"/>
                </form>
                <a href="./register.html" className="logreg">Register Your Account</a>
            </section>
        </div>
     );
}
 
export default Login;