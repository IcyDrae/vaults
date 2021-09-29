import axios from "axios";
import config from "./config"

export default {
    logConfig() {
        return config;
    },
    request(requestConfig, onSuccess, onError) {
        config {...requestConfig, ...config};

        axios.request(config)
            .then((response) => {
                onSuccess(response);
            })
            .catch((error) => {
                onError(error)
            });
    }
}
