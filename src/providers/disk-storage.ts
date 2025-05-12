// Import o file system do node
import fs from "node:fs";
import path from "node:path";

import uploadConfig from "@/config/upload"

class DiskStorage {
    async saveFile(file: string) {
        // Pega a pasta temporária de origem
        const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file)
        // Pasta de destino
        const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)



        try {
            // Tenta acessar o arquivo
            await fs.promises.access(tmpPath)

        } catch (error) {
            console.log(error)
            throw new Error(`Arquivo não encontrado: ${tmpPath}`)
        }

        // Garantir que exista pasta upload
        await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, {recursive: true})
        // Mover o arquivo para a pasta de destino
        await fs.promises.rename(tmpPath, destPath)

        return file
    }

    async deleteFile(file: string, type: "tmp" | "upload") {

        const pathFile = type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER

        const filePath = path.resolve(pathFile, file)

        try {
            // Verifica o estado do arquivo
            await fs.promises.stat(filePath)
        } catch  {
            return
        }

        await fs.promises.unlink(filePath)
    }
}

export { DiskStorage }