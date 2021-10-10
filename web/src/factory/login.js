export class Login {
    id = Number;
    data = this;

    constructor({ id, data }) {
        this.id = id;
        this.data = data;
    }

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
