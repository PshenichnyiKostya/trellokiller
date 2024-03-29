import {useCallback, useEffect, useState} from 'react'

const storageName = 'JWT'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)

    const login = useCallback((jwt, id) => {
        setToken(jwt)
        setUserId(id)
        localStorage.setItem(storageName, JSON.stringify({
            token: jwt, userId:id
        }))
    }, [])
    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId)
        }
    }, [login])

    return {login, logout, token, userId}
}