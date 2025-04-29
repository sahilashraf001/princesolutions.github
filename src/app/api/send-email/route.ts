import {NextResponse} from 'next/server';
import * as SibApiV3Sdk from '@sendinblue/client';

// Define the expected request body structure
interface SendEmailRequestBody {
  subject: string;
  body: string;
  toEmail?: string; // Optional recipient email
}

export async function POST(request: Request) {
  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!brevoApiKey) {
    console.error('FATAL: Brevo API key (BREVO_API_KEY) is not configured in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: Missing API key. Please contact support.' }, { status: 500 });
  }

  try {
    const { subject, body, toEmail }: SendEmailRequestBody = await request.json();

    if (!subject || !body) {
        return NextResponse.json({ message: 'Subject and body are required' }, { status: 400 });
    }
    if (toEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
       return NextResponse.json({ message: 'Invalid recipient email format' }, { status: 400 });
    }


    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    // Configure API key authorization: apiKey
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = brevoApiKey;


    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = body; // Use htmlContent for HTML emails
    sendSmtpEmail.sender = { name: 'Prince Solutions', email: 'msprincesolutions@gmail.com' }; // Your verified sender

    // Set recipient based on whether toEmail is provided
    if (toEmail) {
      sendSmtpEmail.to = [{ email: toEmail }];
      console.log(`Attempting to send email to: ${toEmail}`);
    } else {
      // Default recipient (e.g., admin) if toEmail is not provided
      sendSmtpEmail.to = [{ email: 'msprincesolutions@gmail.com', name: 'Prince Solutions Admin' }];
       console.log(`Attempting to send email to default admin: msprincesolutions@gmail.com`);
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
      const statusCode = error.response?.statusCode || 500;
      let errorMessage = 'Failed to send email via Brevo.';
       if (error.response?.body) {
           try {
               const errorBody = JSON.parse(error.response.body);
               errorMessage = errorBody.message || JSON.stringify(error.response.body);
           } catch (parseError) {
               // If body is not JSON, use the raw body text
               errorMessage = error.response.body.toString();
           }
       } else if (error.message) {
            errorMessage = error.message;
       }
       console.error(`Brevo API Error (Status ${statusCode}):`, errorMessage);
       return NextResponse.json({ message: `Brevo Error: ${errorMessage}` }, { status: statusCode });
    }

  } catch (error: any) {
    console.error('Error processing send-email request:', error);
    // Handle JSON parsing errors or other unexpected issues
    const message = error instanceof SyntaxError ? 'Invalid request body format.' : error.message || 'Failed to process email request.';
    const status = error instanceof SyntaxError ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
