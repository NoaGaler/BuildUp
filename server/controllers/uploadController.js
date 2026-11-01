import { put } from '@vercel/blob';

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Detect the media category (image / video / audio) from the MIME type
const getMediaType = (mimetype = '') => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    return null;
};

// Keep only safe characters in the stored file name
const sanitizeFileName = (name = 'file') => {
    const cleaned = name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '_');
    return cleaned.slice(-80) || 'file';
};

class UploadController {

    // Upload a single file to Vercel Blob storage and return its public URL
    static async uploadFile(req, res) {
        try {
            const file = req.file;

            if (!file || !file.buffer || file.size === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No file was received. Please choose a file to upload."
                });
            }

            const mediaType = getMediaType(file.mimetype);
            if (!mediaType) {
                return res.status(400).json({
                    success: false,
                    message: `File format '${file.mimetype}' is not supported. Please upload an image, video or audio file.`
                });
            }

            const folder = req.body.folder === 'profiles' ? 'profiles' : 'projects';

            // Visitors who are not logged in yet (registration step 2) may only upload a small profile image
            if (!req.user) {
                if (folder !== 'profiles' || mediaType !== 'image' || file.size > MAX_PROFILE_IMAGE_SIZE) {
                    return res.status(401).json({
                        success: false,
                        message: "Please log in to upload this file."
                    });
                }
            }

            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                return res.status(500).json({
                    success: false,
                    message: "File storage is not configured on the server (missing BLOB_READ_WRITE_TOKEN)."
                });
            }

            const pathname = `${folder}/${Date.now()}-${sanitizeFileName(file.originalname)}`;

            const blob = await put(pathname, file.buffer, {
                access: 'public',
                contentType: file.mimetype,
                addRandomSuffix: true,
                token: process.env.BLOB_READ_WRITE_TOKEN
            });

            return res.status(201).json({
                success: true,
                message: "File uploaded successfully.",
                data: {
                    url: blob.url,
                    mimetype: file.mimetype,
                    media_type: mediaType,
                    originalName: file.originalname
                }
            });
        } catch (error) {
            console.error("Error inside uploadFile controller:", error);
            return res.status(500).json({
                success: false,
                message: "File upload failed due to an internal server error.",
                error: error.message
            });
        }
    }
}

export default UploadController;
