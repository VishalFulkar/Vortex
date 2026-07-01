const shareModel = require("../models/share.model")
const userModel = require("../models/user.model")
const fileModel = require("../models/file.model")
const logModel = require("../models/log.model")

const shareFile = async (req, res) => {
    const { id: fileId } = req.params;
    const { email, accessLevel } = req.body || {};
    const userId = req.user.id;

    if (!email || !accessLevel) {
        return res.status(400).json({
            success: false,
            error: 'Email and access level are required'
        });
    }

    if (!['view', 'edit'].includes(accessLevel)) {
        return res.status(400).json({
            success: false,
            error: 'Access level must be "view" or "edit"'
        });
    }

    try {
        // verify file belongs to the requester
        const file = await fileModel.findById(fileId, userId);
        if (!file) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        // find user to share with
        const targetUser = await userModel.findByEmail(email);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                error: 'User with this email not found'
            });
        }

        if (targetUser.id === userId) {
            return res.status(400).json({
                success: false,
                error: 'Cannot share a file with yourself'
            });
        }

        const share = await shareModel.share({
            fileId,
            sharedWith: targetUser.id,
            accessLevel,
            ownerId: userId
        });

        await logModel.create({
            userId,
            fileId,
            action: 'share',
            ip: req.ip
        });

        res.status(201).json({
            success: true,
            share
        });
    } catch (error) {
        console.error('shareFile error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getFileShares = async (req, res) => {
    const { id: fileId } = req.params;
    const userId = req.user.id;

    try {
        // verify ownership
        const file = await fileModel.findById(fileId, userId);
        if (!file) {
            return res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }

        const shares = await shareModel.findByFile(fileId);
        res.status(200).json({ success: true, shares });
    } catch (error) {
        console.error('getFileShares error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getSharedWithMe = async (req, res) => {
    const userId = req.user.id;

    try {
        const files = await shareModel.findSharedWithMe(userId);
        res.status(200).json({ success: true, files });
    } catch (error) {
        console.error('getSharedWithMe error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const revokeShare = async (req, res) => {
    const { id: fileId, userId: sharedWithId } = req.params;
    const ownerId = req.user.id;

    try {
        const revoked = await shareModel.revoke(fileId, sharedWithId, ownerId);
        if (!revoked) {
            return res.status(404).json({
                success: false,
                error: 'Share not found or you do not own this file'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Access revoked successfully'
        });
    } catch (error) {
        console.error('revokeShare error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getMyShares = async (req, res) => {
    const userId = req.user.id;

    try {
        const files = await shareModel.findMyShares(userId);
        res.status(200).json({ success: true, files });
    } catch (error) {
        console.error('getMyShares error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    shareFile,
    getFileShares,
    getSharedWithMe,
    getMyShares,
    revokeShare
};