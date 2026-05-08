/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@workspace/ui'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
			{
				protocol: 'https',
				// O asterisco (*) diz ao Next.js: "Aceite QUALQUER subdomínio da AWS!"
				hostname: '*.amazonaws.com',
			},
			{
				protocol: 'https',
				// Colocamos este também com o .s3. para garantir 100% de cobertura
				hostname: 's3-over-reader.s3.us-east-1.amazonaws.com',
			},
		],
	},
}

export default nextConfig
