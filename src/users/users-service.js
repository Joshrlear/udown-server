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
        return knex
            .select('*')
            .from('udown_users')
    },

    getUserInfoById(knex, user_id, field) {
        return knex
            .from('udown_users')
            .select({ field })
            .where({ user_id })
            .first()
    },

    getById(knex, id, field) {
        return knex
            .from('udown_users')
            .select("*")
            .where({ id })
            .first()
    },

    getPhoneById(knex, id, field) {
        return knex
            .from('udown_users')
            .select({ field })
            .where({ id })
            .first()
    },

    getOtherUsersById(knex, id, field) {
        return knex
            .from('udown_users')
            .select('*')
            .whereNot({ id })
            .whereNotNull(field)
    },

    getUserById(knex, id) {
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
    updateUser(knex, id, newUserField) {
        return knex
            .from('udown_users')
            .where({ id })
            .update(newUserField)
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