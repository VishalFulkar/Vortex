const pool = require('../config/db');

const folderModel = {
    create: async ({ name, userId, parentId }) => {
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
        await pool.query(
            `UPDATE files SET is_deleted = TRUE WHERE folder_id = $1`,
            [id]
        );
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
        if (parseInt(id) === parseInt(parentId)) {
            throw new Error('Folder cannot be moved into itself');
        }

        const subfolders = await folderModel.getAllSubfolderIds(id, userId);
        if (subfolders.includes(parseInt(parentId))) {
            throw new Error('Folder cannot be moved into its own subfolder');
        }

        const result = await pool.query(
            `UPDATE folders SET parent_id = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
            [parentId, id, userId]
        );
        return result.rows[0];
    },

    getAllSubfolderIds: async (folderId, userId) => {
    const result = await pool.query(
      `WITH RECURSIVE subfolders AS (
         SELECT id FROM folders WHERE id = $1 AND user_id = $2
         UNION ALL
         SELECT f.id FROM folders f
         INNER JOIN subfolders s ON f.parent_id = s.id
       )
       SELECT id FROM subfolders`,
      [folderId, userId]
    );
    return result.rows.map(r => r.id);
  }
};

module.exports = folderModel;