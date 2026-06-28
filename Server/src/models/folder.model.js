const { pool } = require('../config/db');

const folderModel = {
    create: async ({name, userId, parentId}) => {
        const result = await pool.query(
            `INSERT INTO folders (name, user_id, parent_id)
            VALUES ($1, $2, $3) RETURNING *`,
            [name, userId, parentId || null]
        );
        return result.rows[0];
    },

    findByUser: async (userId, parentId) => {
        const result = await pool.query(
            `SELECT * FROM folders WHERE user_id = $1
            AND parent_id ${parentId ? "= $2" : "IS NULL"}`,
            parentId ? [userId, parentId] : [userId]
        );
        return result.rows;
    },

    findById: async (id, userId) => {
        const result = await pool.query(
            `SELECT * FROM folders WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        return result.rows[0];
    },

    delete: async (id, userId) => {
        const result = await pool.query(
            `DELETE FROM folders WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
        return result.rowCount;
    },

    rename: async (id, userId, name) => {
        const result = await pool.query(
            `UPDATE folders SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
            [name, id, userId]
        );
        return result.rows[0];
    },

    updateParent: async (id, userId, parentId) => {
        const result = await pool.query(
            `UPDATE folders SET parent_id = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
            [parentId, id, userId]
        );
        return result.rows[0];
    }
};

module.exports = folderModel;