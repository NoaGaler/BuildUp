import React, { useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

import uploadService from '../../../services/uploadService';
import { getMediaUrl } from '../../../utils/media';
import './MediaUploader.css';

// File picker that uploads the chosen file to cloud storage right away
// and reports the stored file details through onUploaded({ url, mimetype, media_type, originalName })
const MediaUploader = ({
    value,
    mediaType = 'image',
    folder = 'projects',
    accept = 'image/*,video/*,audio/*',
    buttonText = 'Choose File',
    onUploaded,
    onUploadingChange
}) => {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const setBusy = (busy) => {
        setUploading(busy);
        if (onUploadingChange) onUploadingChange(busy);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!file) return;

        setError('');
        setBusy(true);
        try {
            const result = await uploadService.uploadFile(file, folder);
            if (result.success && result.data) {
                onUploaded(result.data);
            } else {
                setError(result.message || 'Upload failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    const previewUrl = getMediaUrl(value);

    return (
        <div className="media-uploader">
            <div className="media-uploader-preview">
                {previewUrl && mediaType === 'image' && <img src={previewUrl} alt="Preview" />}
                {previewUrl && mediaType === 'video' && <video src={previewUrl} muted />}
                {previewUrl && mediaType === 'audio' && <audio src={previewUrl} controls />}
                {!previewUrl && <span className="media-uploader-empty">No file selected</span>}
            </div>

            <button
                type="button"
                className="media-uploader-button"
                onClick={() => inputRef.current && inputRef.current.click()}
                disabled={uploading}
            >
                <FiUploadCloud /> {uploading ? 'Uploading...' : (previewUrl ? 'Replace File' : buttonText)}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="media-uploader-hidden-input"
            />

            {error && <div className="media-uploader-error">{error}</div>}
        </div>
    );
};

export default MediaUploader;
