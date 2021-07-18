import React, {useEffect, useState, createContext, useReducer} from 'react'
import {useHistory} from 'react-router-dom'
import '../css/Quora.css'
import Navbar from './Navbar';
import Feed from './Feed';

import { initialState, reducer } from '../reducer/useReducer';

// contextAPI 
export const UserContext = createContext();

function Quora(){

    const history = useHistory();
    const [userData, setUserData] = useState("");
    const [state, dispatch] = useReducer(reducer, initialState);


    const callQuoraPage = async () => {
        try{
            const res = await fetch('/getdata', {
                method:"GET",
                headers:{
                    Accept: "application/json",    // Accept is the media-type of the response it is expecting.
                    "Content-Type": "application/json" // content-type is the media-type of the request being sent from client.
                },
                credentials:"include",
            });

            const data = await res.json();
            setUserData(data);
            

            if(res.status !== 200){
                throw new Error(res.error);
            }
        }
        catch(err){
            console.log(err);
            history.push('/signin');
        }
    }

    useEffect(() => {
        callQuoraPage();
    }, [])

    return(
        <>
            <UserContext.Provider value={{state, dispatch}}>
            <Navbar username={userData.username} />
            <div className="quora_content">
              <Feed username={userData.username} />
            </div>
            </UserContext.Provider>
        </>
    )

}

export default Quora;