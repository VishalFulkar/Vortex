const fileModel = require("../models/file.model")


const folderModel = require('../models/folder.model');
const logModel = require('../models/log.model');
const crypto = require('crypto');
const fs = require('fs');

const computeHash = (filePath) => {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex');
};

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'No file uploaded'
        });
    }

    const { folderId } = req.body || {};
    const userId = req.user.id;
    const { filename, originalname, size, mimetype, path } = req.file;

    try {
        const withinQuota = await fileModel.checkQuota(userId, size);
        if (!withinQuota) {
            fs.unlinkSync(path); // delete uploaded file if quota exceeded
            return res.status(400).json({
                success: false,
                error: 'Storage quota exceeded'
            });
        }

        if (folderId) {
            const folder = await folderModel.findById(folderId, userId);
            if (!folder) {
                fs.unlinkSync(path);
                return res.status(404).json({
                    success: false,
                    error: 'Folder not found'
                });
            }
        }

        const hash = computeHash(path);
        const duplicate = await fileModel.findByHash(hash, userId);
        if (duplicate) {
            fs.unlinkSync(path); // don't store duplicate
            return res.status(409).json({
                success: false,
                duplicate: true,
                error: 'This file already exists',
                existingFile: {
                    id: duplicate.id,
                    name: duplicate.original_name,
                    folderId: duplicate.folder_id
                }
            });
        }

        const file = await fileModel.create({
            name: filename,
            originalName: originalname,
            path,
            size,
            mimetype,
            hash,
            userId,
            folderId: folderId || null
        });

        await fileModel.updateStorageUsed(userId, size);

        await logModel.create({
            userId,
            fileId: file.id,
            action: 'upload',
            ip: req.ip
        });

        res.status(201).json({
            success: true,
            file
        });
    }
    catch (error) {
        if (path && fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        console.error('uploadFile error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getFiles = async (req, res) => {
    const userId = req.user.id;
    const { folderId } = req.query;

    try {
        const files = await fileModel.findByUser(userId, folderId || null);
        res.status(200).json({
            success: true,
            files
        });
    }
    catch (error) {
        console.error('getFiles error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const deleteFile = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const file = await fileModel.findById(id, userId);
        if (!file) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        await fileModel.softDelete(id, userId);
        await fileModel.freeStorageUsed(userId, file.size);
        await logModel.create({
            userId,
            fileId: file.id,
            action: 'delete',
            ip: req.ip
        });

        res.status(200).json({
            success: true,
            message: 'File moved to trash'
        });
    }
    catch (error) {
        console.error('deleteFile error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const downloadFile = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const file = await fileModel.findById(id, userId);
        if (!file) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        await logModel.create({
            userId,
            fileId: file.id,
            action: 'download',
            ip: req.ip
        });

        res.download(file.path, file.original_name);
    }
    catch (error) {
        console.error('downloadFile error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const renameFile = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body || {};
    const userId = req.user.id;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            error: 'File name is required'
        });
    }

    try {
        const file = await fileModel.findById(id, userId);
        if (!file) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        const updated = await fileModel.rename(id, userId, name.trim());
        res.status(200).json({
            success: true,
            file: updated
        });
    } catch (error) {
        console.error('renameFile error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const moveFile = async (req, res) => {
    const { id } = req.params;
    const { folderId } = req.body || {};
    const userId = req.user.id;

    try {
        const file = await fileModel.findById(id, userId);
        if (!file) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        if (folderId) {
            const folder = await folderModel.findById(folderId, userId);
            if (!folder) {
                return res.status(404).json({
                    success: false,
                    error: 'Destination folder not found'
                });
            }
        }

        const updated = await fileModel.move(id, userId, folderId || null);
        res.status(200).json({
            success: true,
            file: updated
        });
    } catch (error) {
        console.error('moveFile error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getTrashedFiles = async (req, res) => {
    const userId = req.user.id;

    try {
        const files = await fileModel.getTrashed(userId);
        res.status(200).json({
            success: true,
            files
        });
    }
    catch (error) {
        console.error('getTrashedFiles error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const restoreFile = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const restored = await fileModel.restore(id, userId);
        if (!restored) {
            return res.status(404).json({
                success: false,
                error: 'File not found in trash'
            });
        }

        await fileModel.updateStorageUsed(
            userId,
            restored.size
        );

        await logModel.create({ userId, fileId: restored.id, action: 'restore', ip: req.ip });

        res.status(200).json({
            success: true,
            file: restored
        });
    }
    catch (error) {
        console.error('restoreFile error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    deleteFile,
    downloadFile,
    renameFile,
    moveFile,
    getTrashedFiles,
    restoreFile
};