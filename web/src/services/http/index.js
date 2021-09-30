import axios from "axios";
import config from "./config"

export default {
    /**
     * Used for each request verb.
     * Configuration options are the same as axios; some options are provided by the global config.
     *
     * @param requestConfig
     */
    request(requestConfig) {
        let mergedConfigs = Object.assign(config, requestConfig);

        return axios.request(mergedConfigs);
    }
}
