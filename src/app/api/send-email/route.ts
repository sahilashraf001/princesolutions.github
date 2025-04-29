import {NextResponse} from 'next/server';
import * as SibApiV3Sdk from '@sendinblue/client';

// Define the expected request body structure
interface SendEmailRequestBody {
  subject: string;
  body: string;
  toEmail?: string; // Optional recipient email
}

export async function POST(request: Request) {
  try {
    const { subject, body, toEmail }: SendEmailRequestBody = await request.json();

    if (!subject || !body) {
        return NextResponse.json({ message: 'Subject and body are required' }, { status: 400 });
    }
    if (toEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
       return NextResponse.json({ message: 'Invalid recipient email format' }, { status: 400 });
    }


    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Ensure your API key is in .env.local

    if (!apiKey.apiKey) {
       console.error('Brevo API key is missing.');
       return NextResponse.json({ message: 'Server configuration error: Missing API key' }, { status: 500 });
    }

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = body; // Use htmlContent for HTML emails
    sendSmtpEmail.sender = { name: 'Prince Solutions', email: 'msprincesolutions@gmail.com' }; // Your verified sender

    // Set recipient based on whether toEmail is provided
    if (toEmail) {
      sendSmtpEmail.to = [{ email: toEmail }];
    } else {
      // Default recipient (e.g., admin) if toEmail is not provided
      sendSmtpEmail.to = [{ email: 'msprincesolutions@gmail.com', name: 'Prince Solutions Admin' }];
    }

    // Optional: Add BCC for admin copy if sending to user
    // if (toEmail && toEmail.toLowerCase() !== 'msprincesolutions@gmail.com') {
    //   sendSmtpEmail.bcc = [{ email: 'msprincesolutions@gmail.com', name: 'Prince Solutions Admin Copy' }];
    // }

    // Using async/await for the API call
    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Brevo API called successfully. Returned data: ' + JSON.stringify(data));
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error: any) {
       // Log the detailed error from Brevo
      console.error('Brevo API Error:', error.response ? JSON.stringify(error.response.body) : error.message);
       const errorMessage = error.response?.body?.message || error.message || 'Failed to send email via Brevo';
       return NextResponse.json({ message: errorMessage }, { status: error.response?.statusCode || 500 });
    }

  } catch (error: any) {
    console.error('Error processing send-email request:', error);
    // Handle JSON parsing errors or other unexpected issues
    const message = error instanceof SyntaxError ? 'Invalid request body' : error.message || 'Failed to process email request';
    const status = error instanceof SyntaxError ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
