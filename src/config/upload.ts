import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

//Criando para arquivo temporário
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");

//Pasta par manipulação dos arquivos carregados

const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MAX_SIZE = 3 //3 MB

//Definir o tamanho máximo do arquivo
const MAX_FILE_SIZE = 1024 * 1024 * MAX_SIZE

// Formatos de imagens aceitos
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename: (request, file, callback) => {
            const fileHash = crypto.randomBytes(10).toString("hex")
            const fileName = `${fileHash}-${file.originalname}`

            return callback(null, fileName)
        },
    }),
}

export default{
    TMP_FOLDER,
    UPLOADS_FOLDER,
    MULTER,
    MAX_FILE_SIZE,
    ACCEPTED_IMAGE_TYPES,
    MAX_SIZE
}