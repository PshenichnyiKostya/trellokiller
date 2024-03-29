import {useCallback, useState} from "react";

export const useHttp = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const request = useCallback(async (url, method = 'GET', body = undefined, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'Application/json'
            }
            const response = await fetch(url, {method, body, headers})
            const data = await response?.json()
            if (!response?.ok) {
                throw new Error(
                    data.message || "Something wrong("
                )
            }
            setLoading(false)
            return data
        } catch (e) {
            setLoading(false)
            setError(e.message || "Something wrong(")
            throw e
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        loading, request, error, clearError
    }
}