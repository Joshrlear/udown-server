const UserService = {

    // Create
    createUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    // Read
    getUser(kenx) {
        return knex
            .select('*')
            .from('users')
    },

    // Update
    updateUser(knex, id, newUserFields) {
        return knex
            .from('users')
            .where({ id })
            .update(newUserFields)
    },

    // Delete
    deleteUser(knex, id) {
        return knex
            .from('users')
            .where({ id })
            .delete()
    }
}

module.exports = UserService;