// Base address of the backend server (used for files stored under /uploads)
export const SERVER_URL = 'https://app-d4e09bdc-bc2d-426d-90c4-78f353c66442.cleverapps.io';

// Build a displayable address for a stored media path.
// Cloud uploads are saved as full URLs; older files are saved as /uploads/... paths on the server.
export const getMediaUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//.test(path)) return path;
    const cleanPath = path.replace(/\\/g, '/');
    return `${SERVER_URL}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
};

// Detect image / video / audio from a MIME type
export const getMediaTypeFromMime = (mimetype = '') => {
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    return 'image';
};
