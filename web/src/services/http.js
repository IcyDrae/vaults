import axios from "axios";

const instance = axios.create();

instance.defaults.baseURL = process.env.VUE_APP_API_HOSTNAME;
instance.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
instance.defaults.withCredentials = true;

export default instance
    /**
     * Used for each request verb.
     * Configuration options are the same as axios; some options are provided by the global config.
     *
     * @param requestConfig
     */
    /*request(requestConfig) {
        let mergedConfigs = Object.assign(config, requestConfig);

        return axios.request(mergedConfigs);
    }*/
    /*request() {
        const instance = axios.create();

        instance.defaults.baseURL = process.env.VUE_APP_API_HOSTNAME;
        instance.defaults.headers.common = {
            "Content-Type": "application/json",
        };
        instance.defaults.withCredentials = true;
        instance.defaults.data = null;

        return instance;
    }*/
