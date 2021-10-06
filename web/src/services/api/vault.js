import http from "../http";
import store from "../../store";

export default {
    /**
     * Requests the user's encrypted vaults.
     */
    fetchVaults() {
        return http.request({
            method: "get",
            url: "/vaults",
            params: {
                userId: store.getters["user/getUser"].id
            }
        });
    },
}
