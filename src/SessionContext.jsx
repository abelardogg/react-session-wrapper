import React from 'react';
import ReactDOM from 'react-dom';

class SessionContext extends React.Component{
    constructor(){
        super();
        this.state = {
            allowed: false
        }
    }
    getSessionToken = () => {
        const token = localStorage.getItem('tokenId');
        return token;
    }

    componentDidMount = () => {
        const sessionExists = !!this.getSessionToken();
        if(sessionExists){
            this.setState({allowed: true});
        }
    }

    handleLogin = () => {
        localStorage.setItem('tokenId', 'test1432');
    }

    handleLogout = () => {
        localStorage.removeItem('tokenId');
        window.location.href='/home';
    }

    render(){
        const allowed = this.state.allowed;
        if(allowed){
            return(<>
                <button onClick={()=>this.handleLogout()}>Log out</button>

                {this.props.children}
            </>)
        }

        return (<>
            <div>sorry you are not allowed to enter</div>
            <div>
                <button onClick={()=>this.handleLogin()}>Login</button>
            </div>
        </>);
        
    }
}

export default SessionContext;