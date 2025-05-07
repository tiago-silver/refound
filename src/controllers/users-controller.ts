import { Request, Response } from "express";
import { UserHole } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";

class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(3, {message: "O nome é obrigatório!"}),
            email: z.string().trim().email({message: "O email é obrigatório!"}).toLowerCase(),
            password: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres!"}),
            hole: z.enum([UserHole.employee, UserHole.manager]).default(UserHole.employee)
        })

        const { name, email, password, hole } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findUnique({where: {email}})

        if(userWithSameEmail){
            throw new AppError("Usuário com este email já existe!")
        }

        const hashedPassword = await hash(password, 8)

        const user =await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                hole
            }
        })

        const {password:_, ...userWithoutPassword} = user

        return response.status(201).json(userWithoutPassword)
    }
}

export { UsersController }