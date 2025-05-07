import { Request, Response } from "express";
import { z } from "zod";

const categoryEnum = z.enum(["food", "transport", "services", "accommodation", "others"])

 class RefundsController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "Informe o nome da solicitação!"}),
            amount: z.number().positive({message: "O valor deve ser positivo!"}),
            category: categoryEnum,
            filename: z.string().min(20),
        })

        const { name, amount, category, filename } = bodySchema.parse(request.body)
        return response.json({message: "ok"})
    }
}

export { RefundsController }