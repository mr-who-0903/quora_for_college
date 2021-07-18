import React, {useEffect} from 'react'
import {useHistory} from 'react-router-dom'
//import { UserContext } from '../App';

const Logout = () => {

    //const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
 
    // using promises
    useEffect(() => {
        
        fetch('/logout', {
            method:"GET",
            headers:{
                Accept: "application/json",    // Accept is the media-type of the response it is expecting.
                "Content-Type": "application/json" // content-type is the media-type of the request being sent from client.
            },
            credentials:"include",
        }).then((res) => {
            //dispatch({type:"USER", payload:false});
            history.push('/signin', { replace:true });
            if(res !== 200){
                throw new Error(res.error);
            }
        }).catch((err) => {
            console.log(err);
        })
    })

    return (
        <div style={{display:"flex", justifyContent:"center", alignItem:"center" }}>
        <h1 style={{color:"#8f1f1b", marginTop:"200px"}}>Redirecting, please wait...</h1>
        </div>
    )
}

export default Logout
