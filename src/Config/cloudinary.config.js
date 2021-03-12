const cloudinary = require("cloudinary");
const config = require("../Env/cloudinary.env");

cloudinary.config({
	cloud_name: config.cloud_name,
	api_key: config.api_key,
	api_secret: config.api_secret,
});

module.exports.cloudinaryUpload = (path, folder) => {
	return new Promise((resolve) => {
		cloudinary.uploader.upload(
			path,
			(result) => {
				resolve({
					url: result.url,
					folder: result.public_id,
				});
			},
			{
				resource_type: "auto",
				folder: folder,
			}
		);
	});
};
