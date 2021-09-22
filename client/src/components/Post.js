import { Delete, ArrowDownwardOutlined, ArrowUpwardOutlined, ChatBubbleOutlineOutlined, MoreHorizOutlined, RepeatOutlined, ShareOutlined } from '@material-ui/icons'
import React, {useState, useContext} from 'react';
import { UserContext } from './Quora';
import '../css/Post.css'
import {Avatar, Button, Tooltip} from '@material-ui/core';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Post(props){

    const [openModal, setOpenModal] = useState(false);
    const [ansInput, setAnsInput] = useState("");
    const {state, dispatch} = useContext(UserContext);
    const answers = [];
    var j=0;
    for(var i=(props.answers.length)-1; i>=0; i--){
        answers[j] = props.answers[i];
        ++j;
    }

    const dateFormatter = () =>{

        const allDateTime = props.date;
        const allDateTimeArr = allDateTime.split('T');
        const allDate = allDateTimeArr[0].split('-');

        var months = [ "Jan", "Feb", "Mar", "April", "May", "June", 
           "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

        return (allDate[2]+" "+months[allDate[1]-1]+", "+allDate[0]);
    }

    const answerDate = () =>{

        const date = new Date();
        const dd = String(date.getDate());
        const mm = date.getMonth();
        const yy = String(date.getFullYear());
        var months = [ "Jan", "Feb", "Mar", "April", "May", "June", 
           "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

        return(dd+" "+months[mm]+", "+yy);
    }

    const date = dateFormatter();
    const ansDate = answerDate();

    const submitAnswer = async() =>{
        console.log(props.id);
        setOpenModal(false);

        try{
            const res = await fetch('/answer/'+props.id, {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    answer:ansInput, date:ansDate
                })
            })

            const data = await res.json();
            if(res.status === 201){
                console.log("Answer submitted successfully");
                dispatch({type:"USER", payload:true});  // true means refetch all questions 
                setAnsInput("");
            }
        }
        catch(e){console.log(e)}
    }

    const handleDeletePost = async() =>{

        console.log(props.id);
        try{
            const res = await fetch('/delete/'+props.id, {
                method: "GET",
                headers:{
                    "Content-Type" : "application/json"
                }
            })
            await res.json();
            if(res.status === 201){
                console.log("deleted");
                dispatch({type:"USER", payload:true});  // true means refetch all questions 
            }

        }
        catch(e){console.log(e)}
    }

    return(
        <>
            <div className="post">
                <div className="post_info">
                    <Avatar/>
                    <h5>{props.username}</h5>
                    <small>{date}</small>
                </div>
                <div className="post_body">
                    <div className="post_ques">
                        <div style={{display:"flex", flexDirection:"column"}}>
                            <h5>{props.question}</h5>
                            {
                                (answers.length === 1) ? 
                                <h6>{answers.length} Answer</h6>
                                :
                                <h6>{answers.length} Answers</h6>
                            }
                        </div>
                        <button className="post_ansbtn" onClick={() => setOpenModal(true)}>Answer</button>
                        
                        <Modal
                            isOpen = {openModal}
                            onRequestClose = {() => setOpenModal(false)}
                            shouldCloseOnOverlayClick = {false}
                            style = {{
                                overlay: {
                                width: 680,
                                height: 550,
                                backgroundColor: "rgba(0,0,0,0.7)",
                                zIndex: "1000",
                                top:"50%",
                                left:"50%",
                                marginTop: "-250px",
                                marginLeft: "-350px"
                            },
                            }}
                        >
                            <div className="modal_question">
                                <h2>{props.question}</h2>
                                <p style={{fontSize:"16px"}}>
                                    asked by <span className="name">{props.username}</span>{" "}
                                    on <span className>{date}</span>
                                </p>
                            </div>
                                <div className="modal_answer">
                                    <textarea required value={ansInput} onChange={(event) => setAnsInput(event.target.value)} placeholder="Enter your answer" type="text"/>
                                </div>
                                
                                <div className="modal_button">
                                    <button className="cancle" onClick={()=>setOpenModal(false)}>Cancle</button>
                                    <button onClick={submitAnswer} type="submit" className="add">Add Answer</button>
                                </div>
                            </Modal>
                    </div>

                    <div className="post_ans">
                        {answers.map((ans, index)=>{
                            return( <>
                                    <div className="row" key={index}>
                                        <div className="col-8">{ans.answer}</div>
                                        <div className="col-4 ansDetails"><span className="ansUN">{ans.username}</span>, <span className="ansDate"> {ans.date}</span></div>
                                    </div>
                                    <hr style={{borderTop:"1px dotted grey", margin:'0.5rem 0'}} />
                                    </>
                                    )
                        })}
                    </div>
                    
                </div>
                <div className="post_footer">
                    <div className="post_footerAction">
                        <ArrowUpwardOutlined/>
                        <ArrowDownwardOutlined/>
                    </div>

                    <RepeatOutlined/>
                    <ChatBubbleOutlineOutlined/>

                    <div className="post_footerLeft">
                    <Tooltip title={<h6 style={{margin:'0'}}>Delete post</h6>} arrow>   
                    <Button onClick={handleDeletePost} style={{outline:'none'}} disabled={(props.username === props.loggedInUser) ? false : true}>    
                        <Delete />
                    </Button>
                    </Tooltip>  
                    </div> 
                </div>
            </div>
        </>
    )
}

export default Post;