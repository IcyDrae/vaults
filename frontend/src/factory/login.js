/**
 * Login entity class.
 */
export class Login {
    object = Object;

    constructor(object) {
        this.object = object;
    }

    /**
     * Represents a login.
     *
     * @returns {any}
     */
    dto() {
        return {
            "id": this.object.id,
            "vault_id": this.object.vault_id,
            "category": this.object.category_id ?? "",
            "name": {
                "label": "Name",
                "value": this.object.data.login_name,
                "type": "text"
            },
            "login_username": {
                "label": "Username",
                "value": this.object.data.login_username,
                "type": "text"
            },
            "login_email": {
                "label": "E-Mail",
                "value": this.object.data.login_email ?? "",
                "type": "text"
            },
            "login_website": {
                "label": "Website",
                "value": this.object.data.login_website,
                "type": "text"
            },
            "login_password": {
                "label": "Password",
                "value": this.object.data.login_password,
                "type": "password"
            },
            "login_description": {
                "label": "Description",
                "value": this.object.data.login_description ?? "",
                "type": "textarea"
            },
            "item_type": this.object.data.item_type
        }
    }
}
