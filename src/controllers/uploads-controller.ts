import { Request, Response } from "express";
import { z, ZodError } from "zod";
import uploadConfig from "@/config/upload";

import { DiskStorage } from "@/providers/disk-storage";
import { AppError } from "@/utils/AppError";

class UploadsController{
    async create(request: Request, response: Response) {
        const diskStorage = new DiskStorage()

        // validação do arquivo 
        try {
            const fileSchema = z.object({
                filename: z.string().min(1, "O arquivo é obrigatório!"),

                mimetype: z.string().refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
                    {message: `Formato de arquivo inválido! Apenas os formatos ${uploadConfig.ACCEPTED_IMAGE_TYPES}  estão permitidos!`}
                ),

                size: z.number().positive().refine((size) => 
                    size <= uploadConfig.MAX_FILE_SIZE , 
                    {message: `O arquivo excede o limite de tamanho! Tamanho máximo: ${uploadConfig.MAX_SIZE}MB`}
                )
    
            })
            //Para o zod não reclamar das demais propriedades do arquivo
            .passthrough()

    
            const file = fileSchema.parse(request.file)

            // Salvar o arquivo
            const fileName = await diskStorage.saveFile(file.filename)
            

            return response.status(200).json({fileName})    
            
        } catch (error) {

            if(error instanceof ZodError){

                if(request.file){
                    await diskStorage.deleteFile(request.file.filename, "tmp")
                }

                throw new AppError(error.issues[0].message)
            }

            throw error
        }

    }
}

export { UploadsController }