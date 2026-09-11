interface DefaultContentProps {
	storeName?: string;
}

export function DefaultPrivacyContent({ storeName = "Mi Tienda" }: DefaultContentProps) {
	return (
		<div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">1. Información que recopilamos</h2>
				<p>
					En <strong>{storeName}</strong> recopilamos los datos que nos proporcionas voluntariamente a través
					de nuestro formulario de contacto y agenda de citas, como tu nombre, correo electrónico, teléfono
					y el contenido de tu mensaje.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">2. Uso de la información</h2>
				<p>
					Utilizamos tus datos únicamente para responder a tus consultas, gestionar tus citas, mejorar
					nuestros servicios y, si así lo autorizas, enviarte información comercial. No vendemos ni
					cedemos tus datos personales a terceros.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">3. Almacenamiento y seguridad</h2>
				<p>
					Tus datos se almacenan de forma segura en nuestros sistemas y solo el personal autorizado puede
					acceder a ellos. Aplicamos medidas técnicas y organizativas razonables para proteger tu
					información.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">4. Derechos del titular</h2>
				<p>
					Tienes derecho a conocer, actualizar, rectificar y solicitar la eliminación de tus datos
					personales en cualquier momento, conforme a la normativa aplicable (Habeas Data / RGPD).
					Para ejercer tus derechos, contáctanos a través de los medios indicados en nuestra página.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">5. Cookies y analítica</h2>
				<p>
					Este sitio puede usar cookies y herramientas de analítica (como Google Analytics o Meta Pixel)
					para medir el tráfico y mejorar la experiencia. Puedes gestionar tu consentimiento a través del
					aviso de cookies que aparece en el sitio.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">6. Contacto</h2>
				<p>
					Si tienes preguntas sobre esta política, escríbenos a través del formulario de contacto de{" "}
					<strong>{storeName}</strong>.
				</p>
			</section>
		</div>
	);
}

export function DefaultTermsContent({ storeName = "Mi Tienda" }: DefaultContentProps) {
	return (
		<div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">1. Aceptación de los términos</h2>
				<p>
					Al acceder y utilizar el sitio web de <strong>{storeName}</strong> aceptas estos Términos y
					Condiciones. Si no estás de acuerdo, te pedimos que no utilices nuestros servicios.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">2. Servicios ofrecidos</h2>
				<p>
					Ofrecemos servicios relacionados con la actividad de nuestro negocio, incluyendo la posibilidad
					de contactarnos, agendar citas y conocer nuestro portafolio. La información publicada es
					orientativa y puede ser actualizada sin previo aviso.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">3. Citas y contacto</h2>
				<p>
					Al agendar una cita o enviar un mensaje, garantizas que los datos proporcionados son veraces y
					actuales. El horario de las citas está sujeto a confirmación por parte del establecimiento.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">4. Responsabilidad</h2>
				<p>
					No nos hacemos responsables por el uso indebido del sitio, ni por daños derivados de la
					interrupción del servicio, fallos técnicos o accesos no autorizados fuera de nuestro control.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">5. Propiedad intelectual</h2>
				<p>
					Todo el contenido del sitio (textos, imágenes, logotipos y diseño) es propiedad de{" "}
					<strong>{storeName}</strong> o de sus respectivos titulares. Queda prohibida su reproducción
					sin autorización expresa.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">6. Contacto</h2>
				<p>
					Para cualquier consulta sobre estos términos, contáctanos a través del formulario de contacto de{" "}
					<strong>{storeName}</strong>.
				</p>
			</section>
		</div>
	);
}

export function DefaultLegalNoticeContent({ storeName = "Mi Tienda" }: DefaultContentProps) {
	return (
		<div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">1. Protección de datos</h2>
				<p>
					Este sitio está protegido bajo las leyes de protección de datos vigentes. Los datos personales
					facilitados por los usuarios se tratarán de forma confidencial y se utilizarán exclusivamente
					para atender sus solicitudes.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">2. Titularidad</h2>
				<p>
					<strong>{storeName}</strong> es el titular del presente sitio web y de su contenido. El acceso
					al sitio no otorga derecho alguno sobre la propiedad intelectual del mismo.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">3. Uso permitido</h2>
				<p>
					El usuario se compromete a hacer un uso adecuado de los contenidos y servicios ofrecidos y a no
					emplearlos para actividades ilícitas o contrarias a la buena fe.
				</p>
			</section>
			<section>
				<h2 className="text-lg font-semibold text-foreground mb-2">4. Responsabilidad</h2>
				<p>
					No nos hacemos responsables de los daños o perjuicios derivados del uso indebido del sitio ni de
					las consecuencias de interrupciones técnicas, virus o accesos no autorizados.
				</p>
			</section>
		</div>
	);
}


