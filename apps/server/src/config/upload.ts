import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

// Configuração moderna do S3Client (AWS SDK v3)
const s3Config = new S3Client({
	region: process.env.AWS_REGION as string,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
})

export const uploadConfig = multer({
	storage: multerS3({
		s3: s3Config,
		bucket: process.env.AWS_S3_BUCKET_NAME as string,
		contentType: multerS3.AUTO_CONTENT_TYPE, // Importante: para o navegador ler a imagem direto em vez de baixar
		acl: 'public-read', // Define que qualquer pessoa pode ver a imagem usando a URL
		key: (req, file, cb) => {
			// Gera um nome único para a imagem para evitar que uma sobreescreva a outra
			const hash = crypto.randomBytes(16).toString('hex')
			const fileName = `${hash}-${file.originalname.replace(/\s/g, '')}`

			// Salva dentro de uma pasta específica no bucket
			cb(null, `over-reader-uploads/${fileName}`)
		},
	}),
	// Limite de segurança: imagens de no máximo 5MB
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
})
