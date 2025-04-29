'use client';

import React, {useState} from 'react';
import {useCart} from '@/context/cart-context';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {Phone, Mail} from 'lucide-react'; // Import Mail Icon

export default function CheckoutPage() {
  const {cartItems, cartTotal, clearCart} = useCart();
  const [email, setEmail] = useState(''); // Add email state
  const [phoneNumber, setPhoneNumber] = useState('
    ');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [accountDetailsRequested, setAccountDetailsRequested] = useState(false);
  const {toast} = useToast();
  const router = useRouter();

  // Add state variables for address fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateValue] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const formatAsINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Modified to accept optional recipient email
  const sendEmailNotification = async (subject: string, body: string, toEmail?: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, body, toEmail }), // Pass optional toEmail
      });

      if (!response.ok) {
        let errorMessage = 'Failed to send email';
        try {
          const responseClone = response.clone(); // Clone the response
          errorMessage = await responseClone.text() || errorMessage; // Read the error message from the response body
        } catch (textError) {
          console.error("Text parsing failed:", textError);
          errorMessage = 'Failed to send email and no error message provided.';
        }
        console.error('Failed to send email:', errorMessage);
        toast({
          title: 'Email Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return false; // Indicate failure
      }
      return true; // Indicate success
    } catch (error: any) {
      console.error('Email send error:', error);
      toast({
        title: 'Email Error',
        description: error.message || 'Failed to send email. Please try again later.',
        variant: 'destructive',
      });
      return false; // Indicate failure
    }
  };


  const handleRequestAccountDetails = async () => {
    if (!phoneNumber) {
      toast({
        title: 'Phone Number Required',
        description: 'Please enter your WhatsApp number to receive account details.',
        variant: 'destructive',
      });
      return;
    }

     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email validation
      toast({
        title: 'Valid Email Required',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    // Validate Address Fields
    if (!address || !city || !state || !postalCode) {
      toast({
        title: 'Address Required',
        description: 'Please fill in all address fields to proceed.',
        variant: 'destructive',
      });
      return;
    }

    // Send email notification for account details request TO ADMIN
    const emailSubject = 'Account Details Requested';
    const emailBody = `A user has requested account details.
                       <br>Email: ${email}
                       <br>WhatsApp Number: ${phoneNumber}
                       <br><br>Shipping Address:
                       <br>Address: ${address}
                       <br>City: ${city}
                       <br>State: ${state}
                       <br>Postal Code: ${postalCode}
                       <br><br>Cart Total: ${formatAsINR(cartTotal)}
                       <br>Cart Items:
                       <ul>
                       ${cartItems.map(item => `<li>${item.name} x ${item.quantity} - ${formatAsINR(item.price * item.quantity)}</li>`).join('')}
                       </ul>`;

    const emailSent = await sendEmailNotification(emailSubject, emailBody); // Sends to admin by default

    if (emailSent) {
      setAccountDetailsRequested(true);
      toast({
        title: 'Account Details Requested',
        description:
          'Account details will be sent to your WhatsApp number shortly. Please complete the payment and upload the receipt.',
      });
    } else {
        toast({
          title: 'Request Failed',
          description: 'Could not send the request for account details. Please try again.',
          variant: 'destructive',
        });
    }
  };

  const generateOrderNumber = () => {
     const timestamp = Date.now();
     const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
     return `ORD-${timestamp}-${randomPart}`;
  };

  const handleReceiptUpload = async () => {
    if (!receipt) {
      toast({
        title: 'Receipt Required',
        description: 'Please upload the payment receipt.',
        variant: 'destructive',
      });
      return;
    }
     if (!email) {
        toast({
            title: 'Email Missing',
            description: 'User email is missing. Cannot send confirmation.',
            variant: 'destructive',
        });
        return;
     }

    const orderNumber = generateOrderNumber();

    // 1. Prepare User Confirmation Email
    const userEmailSubject = `Your Prince Solutions Order Confirmation (#${orderNumber})`;
    const userEmailBody = `<h1>Thank you for your order!</h1>
                           <p>Your Order Number: <strong>${orderNumber}</strong></p>
                           <p>We have received your payment receipt and your order is now being processed. We will notify you once it ships.</p>
                           <h2>Order Summary:</h2>
                           <ul>
                             ${cartItems.map(item => `<li>${item.name} x ${item.quantity} - ${formatAsINR(item.price * item.quantity)}</li>`).join('')}
                           </ul>
                           <p><strong>Total: ${formatAsINR(cartTotal)}</strong></p>
                           <h2>Shipping Address:</h2>
                           <p>
                             ${address}<br>
                             ${city}, ${state} ${postalCode}<br>
                           </p>
                           <p>If you have any questions, please contact us at msprincesolutions@gmail.com or call +91-9917122440.</p>`;

     // 2. Prepare Admin Notification Email
    const adminSubject = `Payment Receipt Uploaded - Order #${orderNumber}`;
    const adminBody = `A user has uploaded a payment receipt for Order #${orderNumber}.
                       <br>User Email: ${email}
                       <br>WhatsApp Number: ${phoneNumber}
                       <br><br>Shipping Address:
                       <br>Address: ${address}
                       <br>City: ${city}
                       <br>State: ${state}
                       <br>Postal Code: ${postalCode}
                       <br><br>Cart Total: ${formatAsINR(cartTotal)}
                       <br>Cart Items:
                       <ul>
                         ${cartItems.map(item => `<li>${item.name} x ${item.quantity} - ${formatAsINR(item.price * item.quantity)}</li>`).join('')}
                       </ul>
                       <p><strong>Please verify the payment and process the order.</strong></p>
                       <p>Receipt file name: ${receipt.name}</p>`; // Include filename, actual file needs different handling

    // 3. Send Receipt Data via FormSubmit (Optional/Needs Backend)
    // Note: Directly sending files via client-side email API is not feasible.
    // This part ideally requires a backend to handle file uploads.
    // For now, we will just notify the admin that a receipt was uploaded.
    // A more robust solution would involve uploading the file to storage
    // and including a link in the admin email.
     let formSubmitSuccess = true; // Assuming success for email notification flow

    // 4. Send Emails
    if (formSubmitSuccess) {
        // Send email to admin first
        const adminEmailSent = await sendEmailNotification(adminSubject, adminBody);

        if (adminEmailSent) {
            // If admin notification is sent, then send confirmation to user
            const userEmailSent = await sendEmailNotification(userEmailSubject, userEmailBody, email);

            if (userEmailSent) {
                 toast({
                    title: 'Order Confirmed!',
                    description: `Your order #${orderNumber} has been received. A confirmation email has been sent to ${email}.`,
                });
                clearCart(); // Clear cart after successful submission
                router.push('/store'); // Redirect to store page
            } else {
                 toast({
                    title: 'Order Placed (Confirmation Failed)',
                    description: `Your order #${orderNumber} was placed, but we failed to send the confirmation email. Please contact us if you don't receive it shortly.`,
                    variant: 'warning', // Use warning variant
                 });
                 // Still clear cart and redirect even if user email fails
                 clearCart();
                 router.push('/store');
            }
        } else {
             toast({
                title: 'Order Failed',
                description: 'There was an issue processing your order receipt. Please contact support.',
                variant: 'destructive',
            });
        }

    } // End if formSubmitSuccess

  };


  return (
    <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
          <CardDescription>
            {cartItems.length > 0
              ? 'Review your order and provide details to proceed.'
              : 'Your cart is empty.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {cartItems.length > 0 ? (
            <>
              {/* Order Summary */}
              <div className="space-y-2 border-b pb-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <ul className="space-y-1 text-sm">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.name} ({item.quantity})
                      </span>
                      <span>{formatAsINR(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total:</span>
                  <span>{formatAsINR(cartTotal)}</span>
                </div>
              </div>

              {!accountDetailsRequested ? (
                <>
                  {/* Contact Information */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold border-b pb-2">Contact & Shipping</h3>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="mr-2 inline-block h-4 w-4 text-muted-foreground" />
                          Email Address:
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required // Make email required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">
                          <Phone className="mr-2 inline-block h-4 w-4 text-muted-foreground" />
                          WhatsApp Number (For Payment Details):
                        </Label>
                        <Input
                          type="tel"
                          id="phoneNumber"
                          placeholder="919917122440" // Use placeholder for example
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                           required // Make phone required
                        />
                      </div>
                   </div>

                   {/* Shipping Address Form */}
                   <div className="space-y-4 pt-4">
                     {/* <h3 className="text-lg font-semibold border-b pb-2">Shipping Address</h3> */}
                      <div className="space-y-2">
                        <Label htmlFor="address">Address:</Label>
                        <Input
                          type="text"
                          id="address"
                          placeholder="Street address, P.O. box, etc."
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="space-y-2">
                           <Label htmlFor="city">City:</Label>
                           <Input
                             type="text"
                             id="city"
                             placeholder="Your city"
                             value={city}
                             onChange={e => setCity(e.target.value)}
                             required
                           />
                         </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State:</Label>
                            <Input
                              type="text"
                              id="state"
                              placeholder="Your state"
                              value={state}
                              onChange={e => setStateValue(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code:</Label>
                            <Input
                              type="text"
                              id="postalCode"
                              placeholder="Your postal code"
                              value={postalCode}
                              onChange={e => setPostalCode(e.target.value)}
                              required
                            />
                          </div>
                       </div>
                   </div>

                   <Button onClick={handleRequestAccountDetails} className="w-full mt-6 bg-accent text-accent-foreground hover:bg-orange-600">
                    Request Account Details for Payment
                   </Button>
                   <p className="text-xs text-muted-foreground text-center mt-2">
                     Account details for bank transfer will be sent to your WhatsApp number.
                   </p>
                </>
              ) : (
                 // Receipt Upload Section
                <div className="space-y-4 pt-6 border-t">
                   <h3 className="text-lg font-semibold">Upload Payment Receipt</h3>
                   <p className="text-sm text-muted-foreground">
                     Please upload the screenshot or receipt of your payment transfer.
                   </p>
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Payment Receipt:</Label>
                    <Input
                      type="file"
                      id="receipt"
                      accept="image/*,application/pdf" // Accept images and PDFs
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          setReceipt(e.target.files[0]);
                        } else {
                          setReceipt(null);
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-orange-600 cursor-pointer"
                      required
                    />
                    {receipt && <p className="text-xs text-muted-foreground">Selected: {receipt.name}</p>}
                  </div>
                  <Button onClick={handleReceiptUpload} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" disabled={!receipt}>
                    Confirm Order & Upload Receipt
                  </Button>
                   {/* Add relevant hidden fields if using a form submission service that requires them, e.g., FormSubmit */}
                   {/* <input type="text" name="_honey" style={{display: 'none'}}/> */}
                   {/* <input type="hidden" name="_captcha" value="false"/> */}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">Your shopping cart is empty.</p>
          )}
        </CardContent>
        {/* Removed footer as buttons are now within CardContent */}
        {/* <CardFooter> ... </CardFooter> */}
      </Card>
    </div>
  );
}
