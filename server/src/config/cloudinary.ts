import {v2 as cloudinary} from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dymffytoi";
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary config missing required env vars (cloud_name, api_key, api_secret).');
}

export default cloudinary;
