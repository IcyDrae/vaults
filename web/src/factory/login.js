/**
 * Login entity class.
 */
export class Login {
    id = Number;
    data = Object;

    constructor({ id, data }) {
        this.id = id;
        this.data = data;
    }

    /**
     * Represents a login.
     *
     * @returns {{login_description: {label: string, type: string, value: (*|string)}, login_website: {label: string, type: string, value: *}, login_password: {label: string, type: string, value: *}, login_email: {label: string, type: string, value: (*|string)}, item_type: *, name: {label: string, type: string, value: *}, login_username: {label: string, type: string, value: *}, id: NumberConstructor}}
     */
    dto() {
        return {
            "id": this.id,
            "name": {
                "label": "Name",
                "value": this.data.login_name,
                "type": "text"
            },
            "login_username": {
                "label": "Username",
                "value": this.data.login_username,
                "type": "text"
            },
            "login_email": {
                "label": "E-Mail",
                "value": this.data.login_email ?? "",
                "type": "text"
            },
            "login_website": {
                "label": "Website",
                "value": this.data.login_website,
                "type": "text"
            },
            "login_password": {
                "label": "Password",
                "value": this.data.login_password,
                "type": "password"
            },
            "login_description": {
                "label": "Description",
                "value": this.data.login_description ?? "",
                "type": "textarea"
            },
            "item_type": this.data.item_type
        }
    }
}
