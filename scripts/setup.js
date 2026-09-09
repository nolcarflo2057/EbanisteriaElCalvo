require('dotenv').config();
const { execSync } = require('child_process');

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@admin.com';
const adminPassword = process.env.SEED_ADMIN_PASSWORD || '12345678';

function runCommand(command) {
	console.log(`Ejecutando: ${command}...`);
	try {
		execSync(command, { stdio: 'inherit' });
	} catch (error) {
		console.error(`❌ Falló la ejecución de: ${command}`);
		throw error;
	}
}

try {
	console.log('🚀 Iniciando asistente de instalación (setup)...');
	
	// 1. Instalar dependencias
	runCommand('npm install');

	// 2. Empujar esquema a la base de datos (con drizzle-kit)
	runCommand('npm run db:push');

	// 3. Sembrar la base de datos con datos por defecto y usuario administrador
	runCommand('npm run db:seed');

	console.log('\n');
	console.log('==================================================');
	console.log('✅ Base de datos creada e inicializada con éxito');
	console.log('==================================================');
	console.log('\nUsuario administrador por defecto:');
	console.log('--------------------------------------------------');
	console.log(`Email:      ${adminEmail}`);
	console.log(`Contraseña: ${adminPassword}`);
	console.log('--------------------------------------------------');
	console.log('\nInicia sesión en:');
	console.log('http://localhost:3000/login');
	console.log('\nPara iniciar el servidor de desarrollo, ejecuta:');
	console.log('npm run dev');
	console.log('==================================================\n');
} catch (error) {
	console.error('\n❌ La instalación falló. Por favor, revisa los errores anteriores.');
	process.exit(1);
}
