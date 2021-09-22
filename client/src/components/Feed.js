import React, {useState, useEffect, useContext} from 'react'
import { UserContext } from './Quora';
import '../css/Feed.css'
import QuoraBox from './QuoraBox';
import Post from './Post';

function Feed(props){

    const {state, dispatch} = useContext(UserContext);
    const [allQues, setAllQues] = useState([]);

    const getQuestions = async() =>{

        try{
            const res = await fetch('/getquestions', {
                method:"GET",
                headers:{
                    "Content-Type": "application/json" // content-type is the media-type of the request being sent from client.
                },
            });
    
            const ques = await res.json();
            
            dispatch({type:"USER", payload:false})     
            setAllQues(ques);
            
        }
        catch(err){
            console.log(err);
        }

    }

    useEffect(() => {
        getQuestions();
        console.log("inside useEffect");
    }, [])
    
    if(state){
        getQuestions();
        console.log("inside if")
    }

    return(
        <>
            <div className="feed">
                <QuoraBox username={props.username}/>

                { allQues.map((quesObj, index) => {

                    return <Post

                            key={index}
                            question={quesObj.question}
                            date={quesObj.date}
                            id={quesObj._id}
                            username={quesObj.username}
                            answers={quesObj.answers}
                            loggedInUser={props.username}

                         />
                        })

                }
            </div>
        </>
    )
}

export default Feed;