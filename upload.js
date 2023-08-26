const multer = require('multer');
const inMemoryStorage = multer.memoryStorage()

const uploadStrategy = multer({ storage: inMemoryStorage })

module.exports = uploadStrategy;