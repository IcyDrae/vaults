
export const VaultMapper = {
    /**
     * Transforms a raw response to a usable object.
     *
     * @param vault
     */
    toDTO(vault) {
        return {
            "id": vault.vault.id,
            "vault_name": vault.vault.data.vault_name,
            "vault_description": vault.vault.data.vault_description,
            "logins_amount": vault.logins_amount
        };
    },
}
