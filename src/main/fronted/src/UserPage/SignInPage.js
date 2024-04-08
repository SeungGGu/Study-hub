import React, {useState} from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";

function SignInPage() {
    const [data1, setData1] = useState('');
    const updateData1 = e => setData1(e.target.value);

    function send(){
        axios.post('api/login', {name : data1}, {
            headers: {
                'Content-Type' : 'application/json'
            }
        })
            .then(response => {
                console.log('요청성공:', response);
            })
            .catch(error => {
                console.log('요청실패' , error);
            })
    }

    return (
        <div>
            <Container>
                <Row>
                    <input name="displayName" placeholder="이름" onChange={updateData1}/>
                    <button type="submit" onClick={send}>전송</button>
                </Row>
            </Container>
        </div>
    );
}

export default SignInPage;
