import React, {useState} from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/signup.svg';
import slogan from '../images/quora.png'

const Signup = () => {

    const history = useHistory();
    const [userdata, setUserdata] = useState({
        username:"", email:"", password:"", cpassword:""
    });

    
    const onChangeFunc = (event) =>{
        const {name, value} = event.target;
        setUserdata({...userdata, [name]:value});
    }


    const postData = async (e) =>{
        e.preventDefault();
    
        const { username, email, password, cpassword } = userdata;
    
        const res = await fetch("/register", {
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                username, email, password, cpassword 
            })
        });

        const data = await res.json();

        if(res.status === 422 || !data){
            toast.error(data.error, 
            {position: "top-center",
            autoClose: 5000});
        }
        else if(res.status === 201){
            
            window.alert(data.message);

            history.push("/signin");   // redirects to signIn page 
        }
    }

    return (
        <>
              <div className="container signup">
                <div className="slogan">
                    <img src={slogan} alt="logo" />
                </div>
                  <div className="row content">   

                    <div className="col-md-6">	
                        <h3 className="form-heading mb-3">Sign Up</h3>    
                            <form method="POST" className="sign-form">

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon"><i className="fa fa-user"></i></div>
                                    <input type="text" className="form-control" name="username" placeholder="Username" 
                                    autoComplete="off" value={userdata.username} onChange={onChangeFunc}/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon"><i className="fa fa-paper-plane"></i></div>
                                    <input type="email" className="form-control" name="email" placeholder="Email Address" 
                                    autoComplete="off" value={userdata.email} onChange={onChangeFunc}/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon"><i className="fa fa-lock"></i></div>
                                    <input type="password" className="form-control" name="password" placeholder="Password" 
                                    autoComplete="off" value={userdata.password} onChange={onChangeFunc}/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon"><i className="fa fa-lock"></i></div>
                                    <input type="password" className="form-control" name="cpassword" placeholder="Conform Password" 
                                    autoComplete="off" value={userdata.cpassword} onChange={onChangeFunc}/>
                                </div>
                            </div>

                            <div className="form-group-btn">
                                <button type="submit" onClick={postData} name="signin" className="btn btn-primary btn-block btn-lg">Register</button>
                            </div>
                            
                            </form>
                    </div>

                            <div className="col-md-6 mb-3 svg-container">
                                <img src={logo} className="img-fluid login-svg" alt="logo"/>
                                <div className="text-center"> <NavLink to="/signin"> I have already registered. </NavLink></div>
                            </div>
                    </div>
                    <ToastContainer/>
            </div>
        </>
    )
}

export default Signup
