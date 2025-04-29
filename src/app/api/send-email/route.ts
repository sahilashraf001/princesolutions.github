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

  // Crucial check: Ensure API key is configured in Vercel environment variables
  if (!brevoApiKey) {
    console.error('FATAL: Brevo API key (BREVO_API_KEY) is not configured in environment variables.');
    // Return a generic error to the client, but log the specific issue server-side
    return NextResponse.json({ message: 'Server configuration error. Please contact support.' }, { status: 500 });
  }

  try {
    const requestBody = await request.json();
    const { subject, body, toEmail }: SendEmailRequestBody = requestBody;

     console.log(`Received email request: Subject="${subject}", To="${toEmail || 'default admin'}"`);


    if (!subject || !body) {
        console.error('Validation Error: Subject and body are required.');
        return NextResponse.json({ message: 'Subject and body are required' }, { status: 400 });
    }
    // Basic email format validation
    if (toEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
       console.error(`Validation Error: Invalid recipient email format: ${toEmail}`);
       return NextResponse.json({ message: 'Invalid recipient email format' }, { status: 400 });
    }


    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    // Configure API key authorization: apiKey
    // Check if authentications exists and apiKey property is available
    if (apiInstance.authentications && apiInstance.authentications['apiKey']) {
        const apiKeyAuth = apiInstance.authentications['apiKey'];
        apiKeyAuth.apiKey = brevoApiKey;
    } else {
        console.error("FATAL: Could not access Brevo SDK authentications object. SDK might have changed.");
        return NextResponse.json({ message: 'Internal server error during email setup.' }, { status: 500 });
    }


    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = body; // Use htmlContent for HTML emails
    sendSmtpEmail.sender = { name: 'Prince Solutions', email: 'msprincesolutions@gmail.com' }; // Your verified sender

    // Set recipient based on whether toEmail is provided
    if (toEmail) {
      sendSmtpEmail.to = [{ email: toEmail }];
      console.log(`Attempting to send email via Brevo to: ${toEmail}`);
    } else {
      // Default recipient (e.g., admin) if toEmail is not provided
      sendSmtpEmail.to = [{ email: 'msprincesolutions@gmail.com', name: 'Prince Solutions Admin' }];
       console.log(`Attempting to send email via Brevo to default admin: msprincesolutions@gmail.com`);
    }

    // Log the email object before sending (optional, for debugging)
    // console.log("Brevo Send Request Body:", JSON.stringify(sendSmtpEmail, null, 2));


    // Using async/await for the API call
    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Brevo API called successfully. Returned data: ' + JSON.stringify(data));
      return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error: any) {
       // Log the detailed error from Brevo
      const statusCode = error.response?.statusCode || 500;
      let errorMessage = 'Failed to send email via Brevo.';
      let errorBodyDetail = null; // To store parsed body

       // Attempt to parse the response body for more details
       if (error.response?.body) {
           try {
               // Brevo often returns JSON errors
               errorBodyDetail = JSON.parse(error.response.body.toString()); // Ensure body is string before parsing
               errorMessage = errorBodyDetail.message || JSON.stringify(errorBodyDetail);
           } catch (parseError) {
               // If body is not JSON, use the raw body text
               errorMessage = error.response.body.toString();
           }
       } else if (error.message) {
            // Fallback to generic error message if no response body
            errorMessage = error.message;
       }

       console.error(`Brevo API Error (Status ${statusCode}): ${errorMessage}`, { fullError: error }); // Log full error object too
       // Return a more specific error if possible, otherwise generic
       return NextResponse.json({ message: `Failed to send email. ${errorBodyDetail?.message || ''}`.trim() }, { status: statusCode });
    }

  } catch (error: any) {
    console.error('Error processing /api/send-email request:', error);
    // Handle JSON parsing errors or other unexpected issues in the main try block
    const message = error instanceof SyntaxError ? 'Invalid request body format.' : error.message || 'Failed to process email request.';
    const status = error instanceof SyntaxError ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}
