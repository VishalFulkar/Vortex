const pool = require('../config/db');

const shareModel = {
    share: async ({ fileId, sharedWith, accessLevel }) => {
        const result = await pool.query(
            `INSERT INTO permissions (file_id, shared_with, access_level)
            VALUES ($1, $2, $3)
            ON CONFLICT (file_id, shared_with) 
            DO UPDATE SET access_level = $3
            RETURNING *`,
            [fileId, sharedWith, accessLevel]
        );
        return result.rows[0];
    },

    findByFile: async (fileId) => {
        const result = await pool.query(
            `SELECT p.id, p.access_level, p.created_at,
            u.id AS user_id, u.name, u.email
            FROM permissions p
            JOIN users u ON p.shared_with = u.id
            WHERE p.file_id = $1
            ORDER BY p.created_at DESC`,
            [fileId]
        );
        return result.rows;
    },

    findSharedWithMe: async (userId) => {
        const result = await pool.query(
            `SELECT f.id, f.original_name, f.size, f.mimetype, f.created_at,
            p.access_level,
            u.name AS owner_name, u.email AS owner_email
            FROM permissions p
            JOIN files f ON p.file_id = f.id
            JOIN users u ON f.user_id = u.id
            WHERE p.shared_with = $1 AND f.is_deleted = FALSE
            ORDER BY p.created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    findMyShares: async (userId) => {
        const result = await pool.query(
            `SELECT f.id, f.original_name, f.size, f.mimetype, f.created_at,
            p.access_level, p.shared_with AS target_user_id,
            u.name AS shared_with_name, u.email AS shared_with_email
            FROM permissions p
            JOIN files f ON p.file_id = f.id
            JOIN users u ON p.shared_with = u.id
            WHERE f.user_id = $1 AND f.is_deleted = FALSE
            ORDER BY p.created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    checkAccess: async (fileId, userId) => {
        const result = await pool.query(
            `SELECT access_level FROM permissions
            WHERE file_id = $1 AND shared_with = $2`,
            [fileId, userId]
        );
        return result.rows[0];      // { access_level: 'view' | 'edit' } or undefined
    },

    revoke: async (fileId, sharedWith, ownerId) => {
        const result = await pool.query(
            `DELETE FROM permissions p
            USING files f
            WHERE p.file_id = f.id
            AND p.file_id = $1
            AND p.shared_with = $2
            AND f.user_id = $3
            RETURNING p.*`,
            [fileId, sharedWith, ownerId]
        );
        return result.rows[0];
    }
};

module.exports = shareModel;