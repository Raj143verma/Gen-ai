import React,{useState} from 'react'
import {useNavigate,Link} from "react-router"
import { useAuth } from '../hooks/useAuth'


const Register = () => {

const navigate = useNavigate();
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const { loading, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await handleRegister({ username, email, password });
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
        }
    }

     if(loading && !username && !email && !password){
      return (<main><h1>Loading........</h1></main>)
    }

  return (
     <main>
        <div className="form-container">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>

               <div className="input-group">
                <label htmlFor="username">username</label>
               <input
                onChange={(e) => { setUsername(e.target.value) }}
                type="text" id="username" name="username" placeholder="Enter your username" />
           </div>

            <div className="input-group">
                <label htmlFor="email">Email</label>
               <input
                onChange={(e) => { setEmail(e.target.value) }}
                type="email" id="email" name="email" placeholder="Enter your email Address" />
           </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                 onChange={(e) => { setPassword(e.target.value) }}
                 type="password" id="password" name="password" placeholder="Enter your password" />
              </div>
                <button disabled={loading} className='button primary-button'>{loading ? "Registering..." : "Register"}</button>
</form>
 
       <p>Already have an account? <Link to="/login">Login</Link></p>

        </div>
    </main>
  )
}

export default Register
