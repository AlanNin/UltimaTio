export function TemplatePasswordRecovery(data: {
  client_full_name: string;
  recovery_url: string;
  expiration_time: string;
}): string {
  return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recupera tu contraseña - Beauty Depot</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f7f9; margin: 0; padding: 0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 48px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="padding: 40px 30px; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                  Recupera tu contraseña
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 18px; margin: 0 0 20px 0; color: #2c3e50;">
                  Hola <strong>${data.client_full_name}</strong>,
                </p>
                <p style="font-size: 16px; margin: 0 0 20px 0; color: #2c3e50;">
                  Lamentamos que hayas tenido este inconveniente. Para recuperar tu contraseña por favor haz clic en el siguiente enlace:
                </p>
                <div style="background-color: #f0f4f8; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
                  <p style="font-size: 16px; font-weight: bold; color: #1e3c72; margin: 0; letter-spacing: 5px;">
                    ${data.recovery_url}
                  </p>
                </div>
                <p style="font-size: 16px; margin: 0 0 20px 0; color: #2c3e50;">
                  Por favor completa el formulario para restablecer tu contraseña.
                </p>
                <p style="font-size: 16px; margin: 30px 0; color: #2c3e50; text-align: center; background-color: #e6f3ff; padding: 15px; border-radius: 6px;">
                  Este enlace expirará en ${data.expiration_time} por razones de seguridad.
                </p>
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e5e9;">
                  <p style="font-size: 16px; color: #2c3e50; margin: 0;">
                    Saludos,
                  </p>
                  <p style="font-size: 20px; font-weight: bold; color: #1e3c72; margin: 5px 0 0 0;">
                    El equipo de Beauty Depot
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #1e3c72; color: #ffffff; text-align: center; padding: 20px; font-size: 14px;">
                <p style="margin: 0;">
                  Este es un mensaje automático. Por favor, no respondas a este correo.<br>
                  Si necesitas ayuda, contacta a nuestro equipo de soporte.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
}
