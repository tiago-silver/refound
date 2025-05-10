import { Request, Response } from "express";
import { z} from "zod";
import uploadConfig from "@/config/upload";

class UploadsController{
    async create(request: Request, response: Response) {
        // validação do arquivo 
        

        return response.status(200).json({file: request.file})    
    }
}

export { UploadsController }