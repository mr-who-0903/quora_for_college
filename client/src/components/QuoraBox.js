import React from 'react'
import '../css/QuoraBox.css'
import {Avatar} from '@material-ui/core';

function QuoraBox(props){
    return(
        <>
            <div className="quoraBox">
                <div className="quoraBox_info">
                    <Avatar/>
                    <h5>{props.username}</h5>
                </div>
                <div className="quoraBox_quora">
                    <p>What is your question or link?</p>
                </div>
            </div>
        </>
    )

}

export default QuoraBox;