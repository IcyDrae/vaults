import axios from "axios";

/**
 * Used for each request verb with default configs.
 */
const instance = axios.create();

instance.defaults.baseURL = process.env.VUE_APP_API_HOSTNAME;
instance.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
instance.defaults.withCredentials = true;

export default instance
