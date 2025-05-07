import { Request, Response } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import {prisma} from "@/database/prisma"
import { AppError } from "@/utils/AppError";
import {sign} from "jsonwebtoken"
import { authConfig } from "@/config/auth";

class SessionsController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            email: z.string().trim().email({message: "O email é obrigatório!"}).toLowerCase(),
            password: z.string()
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({where: {email}})

        if(!user){
            throw new AppError("E-mail ou senha incorretos!", 401)
        }

        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            throw new AppError("E-mail ou senha incorretos!", 401)
        }
        const {secret, expiresIn} = authConfig.jwt

        const token = sign({role: user.hole}, secret, {
            subject: user.id,
            expiresIn

        })  

        const {password:_, ...userWithoutPassword} = user
        
        return response.status(200).json({token, user: userWithoutPassword})
    }
}

export { SessionsController }