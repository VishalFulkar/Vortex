const pool = require("../config/db")

const fileModel = {
    create: async ({ name, originalName, path, size, mimetype, hash, userId, folderId }) => {
        const result = await pool.query(
            `INSERT INTO files (name, original_name, path, size, mimetype, hash, user_id, folder_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, originalName, path, size, mimetype, hash, userId, folderId || null]
        );
        return result.rows[0];
    },

    findByUser: async (userId, folderId) => {
        const result = await pool.query(
            `SELECT * FROM files
            WHERE user_id = $1
            AND is_deleted = FALSE
            AND folder_id ${folderId ? "= $2" : "IS NULL"}
            ORDER BY created_at DESC`,
            folderId ? [userId, folderId] : [userId]
        );
        return result.rows;
    },

    findById: async (id, userId) => {
        const result = await pool.query(
            `SELECT * FROM files WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE`,
            [id, userId]
        );
        return result.rows[0];
    },

    getById: async (id) => {
        const result = await pool.query(
            `SELECT * FROM files WHERE id = $1 AND is_deleted = FALSE`,
            [id]
        );
        return result.rows[0];
    },

    softDelete: async (id, userId) => {
        const result = await pool.query(
            `UPDATE files SET is_deleted = TRUE
            WHERE  id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        );
        return result.rows[0];
    },

    restore: async (id, userId) => {
        const result = await pool.query(
            `UPDATE files SET is_deleted = FALSE
            WHERE id = $1 AND user_id = $2
            RETURNING *`,
            [id, userId]
        );
        return result.rows[0];
    },

    getTrashed: async (userId) => {
        const result = await pool.query(
            `SELECT f.*, 
                    (SELECT created_at FROM activity_logs 
                     WHERE file_id = f.id AND action = 'delete' 
                     ORDER BY created_at DESC LIMIT 1) as deleted_at
            FROM files f
            WHERE f.user_id = $1 AND f.is_deleted = TRUE
            ORDER BY deleted_at DESC NULLS LAST, f.created_at DESC`,
            [userId]
        );
        return result.rows
    },

    getTrashedById: async (id, userId) => {
        const result = await pool.query(
            `SELECT * FROM files WHERE id = $1 AND user_id = $2 AND is_deleted = TRUE`,
            [id, userId]
        );
        return result.rows[0];
    },

    hardDelete: async (id, userId) => {
        const result = await pool.query(
            `DELETE FROM files WHERE id = $1 AND user_id = $2 AND is_deleted = TRUE RETURNING *`,
            [id, userId]
        );
        return result.rows[0];
    },

    rename: async (id, userId, name) => {
        const result = await pool.query(
            `UPDATE files SET original_name = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *`,
            [name, id, userId]
        );
        return result.rows[0]
    },

    move: async (id, userId, folderId) => {
        const result = await pool.query(
            `UPDATE files SET folder_id = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *`,
            [folderId || null, id, userId]
        );
        return result.rows[0];
    },

    updateStorageUsed: async (userId, size) => {
        await pool.query(
            `UPDATE users SET storage_used = storage_used + $1 WHERE id = $2`,
            [size, userId]
        );
    },

    freeStorageUsed: async (userId, size) => {
        await pool.query(
            `UPDATE users SET storage_used = storage_used - $1 WHERE id = $2`,
            [size, userId]
        );
    },

    checkQuota: async (userId, fileSize) => {
        const result = await pool.query(
            `SELECT storage_used, storage_quota FROM users WHERE id = $1`,
            [userId]
        );
        const { storage_used, storage_quota } = result.rows[0];
        return (BigInt(storage_used) + BigInt(fileSize)) <= BigInt(storage_quota);
    },

    findByHash: async (hash, userId) => {
        const result = await pool.query(
            `SELECT * FROM files WHERE hash = $1 AND user_id = $2 AND is_deleted = FALSE`,
            [hash, userId]
        );
        return result.rows[0];
    }
}

module.exports = fileModel;