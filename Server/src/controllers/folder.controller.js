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
            error: error.message
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

        res.status(200).json({
            success: true,
            folders
        });
    }
    catch (error) {
        console.error('getFolders error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createFolder,
    getFolders
};
