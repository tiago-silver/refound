import { Router } from "express";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import uploadConfig from "../config/upload";
import multer from "multer";
import { UploadsController } from "@/controllers/uploads-controller";

const uploadsRoutes = Router();

const uploadsController = new UploadsController();

// configurando o multer
const upload = multer(uploadConfig.MULTER)

uploadsRoutes.use(verifyUserAuthorization(["employee"]))
// Atribuir a middleware ao roteamento e no insomnis alterar para form data
uploadsRoutes.post("/",upload.single("file"), uploadsController.create);

export { uploadsRoutes }