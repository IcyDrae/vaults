import axios from "axios";
import config from "./config"

export default {
    /**
     * Used for each request verb.
     * Configuration options are the same as axios; some options are provided by the global config.
     *
     * @param requestConfig
     * @param onSuccess
     * @param onError
     */
    request(requestConfig, onSuccess, onError) {
        let mergedConfigs = Object.assign(config, requestConfig);

        console.log(mergedConfigs)

        axios
            .request(mergedConfigs)
            .then((response) => {
                onSuccess(response);
            })
            .catch((error) => {
                onError(error)
            });
    }
}
