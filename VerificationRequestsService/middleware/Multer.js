const multer = require("multer");

const storage = multer.diskStorage({
	destination: "./uploads/",
    filename: (req, file, cb) => {
    	const uniqueSuffix = Math.round(Math.random() * 1E9);
		const splitedName = file.originalname.split('.');
    	cb(null, file.fieldname + '-' + uniqueSuffix + splitedName[splitedName.length - 1]);
  	},
});

const upload = multer({ storage: storage });
module.exports = upload;