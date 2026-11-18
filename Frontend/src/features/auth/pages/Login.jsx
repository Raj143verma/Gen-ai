import React, { useState } from 'react'
import {useNavigate,Link} from "react-router"
 import "../auth.form.scss"
 import { useAuth } from '../hooks/useAuth'



const Login = () => {
   const navigate = useNavigate();

  const { handleLogin } = useAuth()

  const [email,setEmail] = useState("")
  const [ password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await handleLogin({ email, password });
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Invalid email or password");
        } finally {
            setIsSubmitting(false);
        }
    }
    


   
     return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>


            <div className="input-group">
                <label htmlFor="email">Email</label>
               <input
               onChange={(e) =>{setEmail(e.target.value)}}
               type="email" id="email" name="email" placeholder="Enter your email Address" />
           </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                onChange={(e) => { setPassword(e.target.value)}}
                type="password" id="password" name="password" placeholder="Enter your password" />
              </div>
                <button disabled={isSubmitting} className='button primary-button'>{isSubmitting ? "Logging in..." : "Login"}</button>


            </form>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login

