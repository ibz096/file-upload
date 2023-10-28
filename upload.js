import multer, { memoryStorage } from 'multer';
const inMemoryStorage = memoryStorage()

const uploadStrategy = multer({ storage: inMemoryStorage })

export default uploadStrategy;