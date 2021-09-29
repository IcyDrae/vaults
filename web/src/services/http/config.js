export default {
    baseURL: process.env.VUE_APP_API_HOSTNAME,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    data: null
}
