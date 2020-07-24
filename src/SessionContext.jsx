import React from 'react';
const queryString = require('query-string');
const jwtDecode = require('jwt-decode');



class SessionContext extends React.Component{
    constructor(){
        super();
        this.state = {
            allowed: false,
            gettingToken: false,
            errorDescription: '',
            hasError: false
        }
    }
    getSessionToken = () => {
        const sessionToken = this.props.sessionKey;
        const token = localStorage.getItem(sessionToken);
        return token;
    }

    handleLogin = () => {
        window.location.href = this.props.loginUrl
    }

    handleLogout = () => {
        const sessionToken = this.props.sessionKey;
        localStorage.removeItem(sessionToken);
        window.location.href=this.props.logoutRedirect;
    }

    getTokenAndLogin = async (code) => {
        const url = this.props.tokenUrl
        const requestHeaders = this.props.headers;
        let requestBody = this.props.body
        requestBody.append("code", code);
        
        let requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody,
        redirect: 'follow'
        };
        
        return fetch(url, requestOptions)
        .then(response => {
            if(response.status === 200){
                return response.text();
            }
            throw response.text();
        })
    }

    initSessionContext = async () => {
        const sessionToken = this.props.sessionKey;

        const token = this.getSessionToken();
        const sessionExists = !!token;
        if (sessionExists) {
            this.setState({ allowed: true });
            console.info(jwtDecode(token))
        } else {
            const location = window.location.search;
            const locationParsed = queryString.parse(location);
            console.log(locationParsed);
            const code = locationParsed.code;
            if (!!code) {
                try {
                    this.setState({gettingToken: true})
                    const response = await this.getTokenAndLogin(code);
                    const jsonResult = JSON.parse(response);
                    console.log(jsonResult);
                    localStorage.setItem(sessionToken, jsonResult.id_token);
                    window.location.href='/';

                } catch (error) {
                    error
                        .then(err => {
                            const errorParsed = JSON.parse(err);
                            console.log(errorParsed);
                            this.setState({gettingToken: false, errorDescription: errorParsed.error_description, hasError: true});
                        })
                        .catch(error => console.log('something wnt wrong with the error!!!', error))
                }
            }
        }
    }

    componentDidMount = () => {
       this.initSessionContext();
    }

    render(){
        const allowed = this.state.allowed;
        const gettingToken = this.state.gettingToken;
        if(allowed){
            return(<>
                <button onClick={()=>this.handleLogout()}>Log out</button>

                {this.props.children}

            </>)
        }

        if(gettingToken){
            return(<>
                please wait...
            </>)
        }

        return (<>
            <div>sorry you are not allowed to enter</div>
            <div>
                <button onClick={()=>this.handleLogin()}>Login</button>
            </div>
            {
                this.state.hasError ? 
                <div>
                    {this.state.errorDescription}
                </div>
                : 
                null
            }
        </>);
        
    }
}

export default SessionContext;