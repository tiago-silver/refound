import { Request, Response } from "express";
import { string, z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

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

        if(!request.user){
            throw new AppError("Usuário não autorizado!", 401)
        }

        const refund = await prisma.refunds.create({
            data: {
                name,
                amount,
                category,
                filename,
                userId: request.user.id
            }
        })
        return response.status(201).json(refund)
    }

    async index(request: Request, response: Response) {

        const querySchema = z.object({
            name: string().optional().default(""),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10)
        })
        
        const { name, page, perPage } = querySchema.parse(request.query)
        //Calcula os valores de skip
        const skip = (page - 1) * perPage

        const refunds = await prisma.refunds.findMany({
            //Quantidade de registros por pagina
            skip,
            take: perPage,
            //Pesquisa por nome
            where:{
                user: {
                    name: {
                        contains: name.trim()
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true
            }
        })

        // Obter o total de registros para calcular o número de paginas
        const totalRecords = await prisma.refunds.count({
            where: {
                user: {
                    name: {
                        contains: name.trim()
                    }
                }
            }
        })

        //Calcular o total de páginnas
        const totalPages = Math.ceil(totalRecords / perPage)

        return response.status(200).json({
            refunds,
            pagination: {
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }
        })
    }    

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)
        
        const refund = await prisma.refunds.findFirst({
            where:{id},
            include: {
                user: true
            }
        })

        return response.status(200).json(refund)
    }
}

export { RefundsController }