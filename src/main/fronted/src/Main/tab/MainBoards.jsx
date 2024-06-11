import React, {useState} from "react";
import ListBoardComponent from "./ListBoardComponent";
import {MainHeader} from "../include/MainHeader";
import Community from "../Community";

const MainBoards = () => {
    const [boards, setBoards] = useState([]);

    const addBoard = (newBoard) => {
        setBoards([...boards, newBoard]);
    };
    return(
        <div>
            <MainHeader/>
            <ListBoardComponent addBoard={addBoard}/>
        </div>
    )
}

export default MainBoards;