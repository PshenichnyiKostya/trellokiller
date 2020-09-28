import React, {useContext} from 'react'
import GoogleLogin from "react-google-login"
import {useHttp} from "../hooks/http.hook"
import {AuthContext} from "../context/AuthContext"
import {useHistory} from "react-router-dom"

export default function GoogleAuthComponent() {

    const {loading, error, request, clearError} = useHttp()

    const history = useHistory()

    const auth = useContext(AuthContext)

    const responseSuccessGoogle = async (response) => {
        const data = await request('/api/auth/googlelogin', 'POST', {tokenId: response.tokenId})
        auth.login(data.token, data.userInfo.id)
        auth?.isAuthenticated ? history.push('/') : history.push('/login')
    }
    const responseErrorGoogle = (response) => {
        console.log(response)
    }

    return (
        <div>

            <GoogleLogin
                clientId="174139438358-8o793qf1o4pq5mre3glgr7pee3cg6s1t.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseSuccessGoogle}
                onFailure={responseErrorGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}