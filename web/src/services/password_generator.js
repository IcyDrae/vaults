export default {
    generate(length) {
        length = length ?? 18;

        let keyListLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            keyListIntegers = "123456789",
            keyListSpecialCharacters = "!@#_",
            password = "";

        let len = Math.ceil(length / 2);
        len = len - 1;
        let lenSpec = length - (2 * len);

        for (let i = 0; i < len; i++) {
            password += keyListLetters.charAt(Math.floor(Math.random() * keyListLetters.length));
            password += keyListIntegers.charAt(Math.floor(Math.random() * keyListIntegers.length));
        }

        for (let i = 0; i < lenSpec; i++) {
            password += keyListSpecialCharacters.charAt(Math.floor(Math.random() * keyListSpecialCharacters.length));
        }

        password = password.split("").sort(() => {
            return 0.5 - Math.random()
        }).join("");

        return password;
    }
}
