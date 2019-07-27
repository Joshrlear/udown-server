const imageService = {

    // Create
    createImage(knex, newImage) {
        return knex
            .insert(newImage)
            .into('images')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    // Read
    getImage(knex) {
        return knex
            .select('*')
            .from('images')
    },

    getById(knex, id) {
        return knex
            .from('images')
            .select('*')
            .where({ id })
            .first()
    },

    getImageByUser_id(knex, user_id) {
        return knex
            .from('images')
            .select('image')
            .where({ user_id })
            .first()
    },

    // Update
    updateImage(knex, id, newImageFields) {
        return knex
            .from('images')
            .where({ id })
            .update(newImageFields)
    },

    // Delete
    deleteImage(knex, id) {
        return knex
            .from('images')
            .where({ id })
            .delete()
    }
}

module.exports = imageService;