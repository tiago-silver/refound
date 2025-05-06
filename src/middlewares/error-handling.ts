import { ErrorRequestHandler } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

export const errorHandling: ErrorRequestHandler = (err, req, res, next) =>{

    if(err instanceof AppError){
        res.status(err.status).json({message: err.message})
        return 
    }

    if(err instanceof ZodError){
        res.status(400).json({
            message: "validation error",
            issues: err.format()
        })
        return 
    }

    res.status(500).json({message: err.message})
    return
}