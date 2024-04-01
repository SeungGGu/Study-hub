import {MainHeader} from "./include/MainHeader";
import {MainFooter} from "./include/MainFooter";

function MainRule(){
    return(
        <div className="MainRule" style={{paddingTop: "56px"}}>
            <MainHeader/>
                <div>

                </div>
            <hr/>
            <MainFooter/>
        </div>
    )
}

export default MainRule;
