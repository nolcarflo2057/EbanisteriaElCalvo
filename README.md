# Tu sitio web — Guía de arranque

Este paquete contiene tu sitio web (landing page) y su panel de administración. No necesitas saber programar para encenderlo: solo ejecuta los comandos de abajo en la carpeta donde te entregaron el código.

## 1. Encender el sistema (una sola vez)

Desde la terminal, dentro de esta carpeta:

    pnpm install
    pnpm deploy
    pnpm build
    pnpm start

- `pnpm install` descarga las dependencias.
- `pnpm deploy` crea y prepara la base de datos automáticamente (no tienes que crear nada manualmente).
- `pnpm build` prepara el sitio para producción.
- `pnpm start` lo enciende.

Tu sitio quedará disponible en la dirección que hayas configurado (por defecto http://localhost:3000).

## 2. Recibir los mensajes de contacto por email

Para que los leads lleguen a tu correo:

1. Abre el archivo `.env` en esta carpeta.
2. Pega tu API key de Resend en la línea:
   SMTP_PASS=re_xxxxxxxxxxxxxxxx
3. Entra al panel, sección Ajustes → White-label (o General), y coloca tu "Email de Notificaciones". Ahí llegan los mensajes.
4. Reinicia con `pnpm start` si ya estaba encendido.

> Tip: Para enviar desde tu propio dominio, verifícalo en Resend y cambia `EMAIL_FROM=onboarding@resend.dev` por `no-reply@tudominio.com`.

## 3. Accesos

- Sitio público (landing): https://tudominio.com/ebanisteria-el-calvo
- Panel de administración: https://tudominio.com/dashboard

Inicia sesión con el usuario y contraseña que se te entregaron (por defecto admin@admin.com / Admin123* — cámbialo tras el primer acceso).

Dentro del panel puedes:
- Ver y responder los leads en "Notificaciones".
- Editar el contenido de la landing (textos, galería, precios, etc.).
- Personalizar colores, logo y redes sociales (White-label).
- Configurar tu email de notificaciones.

## 4. Comandos útiles

- `pnpm start` — encender el sitio.
- `pnpm dev` — encender en modo desarrollo (para probar cambios).
- `pnpm deploy` — volver a preparar la base de datos (solo si se vacía).

¿Dudas? Contacta al equipo que te entregó el sistema.
