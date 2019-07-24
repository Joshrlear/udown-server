const UserService = {

    // Create
    createUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('udown_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    // Read
    getUser(knex) {
        console.log('trying to GET')
        return knex
            .select('*')
            .from('udown_users')
    },

    getById(knex, id) {
        return knex
            .from('udown_users')
            .select('*')
            .where({ id })
            .first()
    },

    getUserByUsername(knex, username) {
        return knex
            .from('udown_users')
            .select('*')
            .where({ username })
            .first()
    },

    // Update
    updateUser(knex, id, newUserFields) {
        return knex
            .from('udown_users')
            .where({ id })
            .update(newUserFields)
    },

    // Delete
    deleteUser(knex, id) {
        return knex
            .from('udown_users')
            .where({ id })
            .delete()
    }
}

module.exports = UserService;