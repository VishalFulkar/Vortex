const folderModel = require('../models/folder.model');

const createFolder = async (req, res) => {
    const { name, parentId } = req.body || {};
    const userId = req.user.id;
    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            error: "Folder name is required"
        });
    }
    try {
        if (parentId) {
            const parent = await folderModel.findById(parentId, userId);
            if (!parent) {
                return res.status(404).json({
                    success: false,
                    error: 'Parent folder not found'
                });
            }
        }

        const folder = await folderModel.create({
            name: name.trim(),
            userId,
            parentId
        });
        res.status(201).json({
            success: true,
            folder
        });
    }
    catch (error) {
        console.log("create folder error", error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
}

const getFolders = async (req, res) => {
    const userId = req.user.id;
    const { parentId } = req.query;

    try {
        const folders = await folderModel.findByUser(
            userId, parentId || null
        );

        if (folders.length === 0) {
            return res.status(200).json({
                success: true,
                folders: [],
                message: 'No folders found'
            });
        }

        res.status(200).json({
            success: true,
            folders
        });
    }
    catch (error) {
        console.error('getFolders error:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
};

const renameFolder = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body || {};
    const userId = req.user.id;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            error: "Folder name is required"
        })
    }
    try {
        const folder = await folderModel.findById(id, userId);
        if (!folder) {
            return res.status(404).json({
                success: false,
                error: "Folder not found"
            })
        }

        const updated = await folderModel.rename(id, userId, name.trim());
        res.status(200).json({
            success: true,
            folder: updated
        });
    }
    catch (error) {
        console.error("rename folder error: ", error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
}

const deleteFolder = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const folder = await folderModel.findById(id, userId);
        if (!folder) {
            return res.status(404).json({
                success: false,
                error: "Folder not found"
            })
        }

        await folderModel.delete(id, userId);
        res.status(200).json({
            success: true,
            message: 'Folder deleted successfully'
        });
    }
    catch (error) {
        console.error("delete folder error: ", error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
}

const updateParent = async (req, res) => {
    const { id } = req.params;
    const { parentId } = req.body || {};
    const userId = req.user.id;

    try {
        const folder = await folderModel.findById(id, userId);
        if (!folder) {
            return res.status(404).json({
                success: false,
                error: 'Folder not found'
            });
        }

        if (parentId) {
            const parent = await folderModel.findById(parentId, userId);
            if (!parent) {
                return res.status(404).json({
                    success: false,
                    error: 'Parent folder not found'
                });
            }
        }

        const updated = await folderModel.updateParent(id, userId, parentId);
        res.status(200).json({
            success: true,
            folder: updated
        });
    }
    catch (error) {
        console.error('updateParent error:', error);
        const isLogicError = error.message.includes('cannot be moved');
        res.status(isLogicError ? 400 : 500).json({
            success: false,
            error: isLogicError
                ? error.message
                : process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
        });
    }
};


module.exports = {
    createFolder,
    getFolders,
    renameFolder,
    deleteFolder,
    updateParent,
};
