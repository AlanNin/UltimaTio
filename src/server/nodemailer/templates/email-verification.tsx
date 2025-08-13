export function TemplateVerificationEmail({
  verification_url,
  expiration_time,
}: {
  verification_url: string;
  expiration_time: number;
}) {
  const mainColor = "#a35fe8";

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm Your Account - UltimaTio</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f7f9; margin: 0; padding: 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 48px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 30px; background: linear-gradient(135deg, ${mainColor} 0%, #8743d3 100%);">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                Confirm Your Account
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 18px; margin: 0 0 20px 0; color: #2c3e50;">
                 <strong>Welcome to UltimaTio!</strong>,
              </p>
              <p style="font-size: 16px; margin: 0 0 20px 0; color: #2c3e50;">
                Thank you for your registration. To complete your account activation, please click the button below.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verification_url}" target="_blank" 
                  style="display: inline-block; background-color: ${mainColor}; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 18px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                  Confirm My Account
                </a>
              </div>
              <p style="font-size: 16px; margin: 30px 0; color: #2c3e50; text-align: center; background-color: #f5eaff; padding: 15px; border-radius: 6px;">
                This link will expire in ${expiration_time} hours.
              </p>
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e5e9;">
                <p style="font-size: 16px; color: #2c3e50; margin: 0;">
                  Greetings,
                </p>
                <p style="font-size: 20px; font-weight: bold; color: ${mainColor}; margin: 5px 0 0 0;">
                  Alan Nin
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: ${mainColor}; color: #ffffff; text-align: center; padding: 20px; font-size: 14px;">
              <p style="margin: 0;">
                This is an automated email, please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
