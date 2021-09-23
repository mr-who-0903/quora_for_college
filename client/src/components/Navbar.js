import React, {useState, useContext} from 'react'
import { UserContext } from './Quora';
import '../css/Navbar.css'
import {NavLink} from 'react-router-dom'
import { Home, Link, AssignmentIndOutlined, FeaturedPlayListOutlined, NotificationImportantOutlined, PeopleAltOutlined, Search, Language, ExpandMore } from '@material-ui/icons';
import {Avatar, Input} from '@material-ui/core';
import Modal from 'react-modal';
import logo from '../images/qc.png'

Modal.setAppElement('#root');

function Navbar(props){

    const {state, dispatch} = useContext(UserContext);
    const [openModal, setOpenModal] = useState(false);
    const [quesInput, setQuesInput] = useState("");

    const submitQuestion = async() =>{
        console.log("submit q func");
        setOpenModal(false);

        try{
            const res = await fetch('/question', {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    question: quesInput
                })
            })

            const data = await res.json();
            if(res.status === 201){
                console.log("Question submitted successfully");
                dispatch({type:"USER", payload:true});  // true means refetch questions 
                setQuesInput("");
            }
        }
        catch(e){console.log(e);}

        }


    return(
        <div className="qHeader">
            <div className="qHeader_logo">
                <img src={logo} alt="logo"/>
            </div>

            <div className="qHeader_icons">
                <NavLink className="nav-link" activeClassName="active" to="/">
                    <div className="qHeader_icon"><Home/></div>
                </NavLink>
                <NavLink className="nav-link" activeClassName="active" to="/material">
                    <div className="qHeader_icon"><FeaturedPlayListOutlined/></div>
                </NavLink>
                {/* <div className="qHeader_icon"><AssignmentIndOutlined/></div>
                <div className="qHeader_icon"><PeopleAltOutlined/></div>
                <div className="qHeader_icon"><NotificationImportantOutlined/></div> */}
            </div>
            <div className="qHeader_search">
                <Search className="search"/>
                <input type="text" placeholder="Search quora"></input>    
            </div>
            <div className="qHeader_rem">
            <NavLink className="nav-link" to="/logout">
                <Avatar className="avatar" src="none" alt={props.username}/>
            </NavLink>
            </div>
            {/* <Language className="language"/> */}
            <h5>{props.username}</h5>
            <button className="addQuesBtn" onClick={() => setOpenModal(true)}>Add Question</button>
            {/* <NavLink className="nav-link" to="/logout">Logout</NavLink> */}
            <Modal
                isOpen = {openModal}
                onRequestClose = {() => setOpenModal(false)}
                shouldCloseOnOverlayClick = {false}
                style = {{
                    overlay: {
                    width: 700,
                    height: 630,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    zIndex: "1000",
                    top:"50%",
                    left:"50%",
                    marginTop: "-300px",
                    marginLeft: "-350px"
                },
                }}
            >
                <div className="modal_title">
                    <h5>Add Question</h5>
                    <h5>Share Link</h5>
                </div>
                    <div className="modal_info">
                        <Avatar 
                            className="avatar"
                        />
                        <p style={{ marginBottom: "0", fontSize: "large" }}>{props.username} asked</p>
                        <div className="modal_scope"> 
                            <PeopleAltOutlined/>
                            <p style={{marginBottom:"0"}}>Public</p>
                            <ExpandMore/>
                        </div>
                    </div>
                    <div className="modal_field">
                        <Input required value={quesInput} onChange={(event) => setQuesInput(event.target.value)} type="text" placeholder="Start your question with 'What?', 'How?', 'Why?', etc.."/>
                        <div className="modal_fieldLink">
                            <Link/>
                            <input className="optional" type="text" placeholder="Optional: include a link that gives context"/>
                        </div>
                    </div>
                    
                    <div className="modal_buttons">
                        <button className="cancle" onClick={()=>setOpenModal(false)}>Cancle</button>
                        <button onClick={submitQuestion} type="submit" className="add">Add Question</button>
                    </div>
                </Modal>    
            </div>
    ) 

}

export default Navbar;