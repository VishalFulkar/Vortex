const pool = require('../config/db');

const logModel = {
    create: async ({ userId, fileId, action, ip }) => {
        try {
            await pool.query(
                `INSERT INTO activity_logs (user_id, file_id, action, ip_address)
                VALUES ($1, $2, $3, $4)`,
                [userId, fileId, action, ip]
            );
        } catch (err) {
            // logging should never crash the main flow
            console.error('logModel.create error:', err.message);
        }
    },

    findByUser: async (userId) => {
        const result = await pool.query(
            `SELECT al.id, al.action, al.ip_address, al.created_at,
            f.original_name AS file_name, f.size AS file_size
            FROM activity_logs al
            JOIN files f ON al.file_id = f.id
            WHERE al.user_id = $1
            ORDER BY al.created_at DESC
            LIMIT 50`,
            [userId]
        );
        return result.rows;
    },

    findByFile: async (fileId, userId) => {
        const result = await pool.query(
            `SELECT al.action, al.ip_address, al.created_at
            FROM activity_logs al
            JOIN files f ON al.file_id = f.id
            WHERE al.file_id = $1 AND f.user_id = $2
            ORDER BY al.created_at DESC`,
            [fileId, userId]
        );
        return result.rows;
    }
};

module.exports = logModel;