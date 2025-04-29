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
import {Phone, Mail, Loader2} from 'lucide-react'; // Import Loader2 for loading state

export default function CheckoutPage() {
  const {cartItems, cartTotal, clearCart} = useCart();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [accountDetailsRequested, setAccountDetailsRequested] = useState(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false); // Loading state for request
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false); // Loading state for confirm
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

  const sendEmailNotification = async (subject: string, body: string, toEmail?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, body, toEmail }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to send email notification.';
        try {
            // Try to parse JSON error first
            const responseClone = response.clone(); // Clone to allow reading body multiple times if needed
            const errorData = await responseClone.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch (jsonError) {
            // If JSON parsing fails, try reading as text
            try {
              errorMessage = await response.text() || `HTTP error! status: ${response.status}`;
            } catch (textError) {
               errorMessage = `HTTP error! status: ${response.status}. Could not read error details.`;
            }
        }
        console.error('Failed to send email:', errorMessage);
        toast({
          title: 'Email Sending Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return false; // Indicate failure
      }
      console.log(`Email notification "${subject}" sent successfully.`);
      return true; // Indicate success
    } catch (error: any) {
      console.error('Network or fetch error during email sending:', error);
      toast({
        title: 'Network Error',
        description: error.message || 'Failed to send email notification due to a network issue. Please check your connection and try again.',
        variant: 'destructive',
      });
      return false; // Indicate failure
    }
  };


  const handleRequestAccountDetails = async () => {
     setIsLoadingRequest(true); // Start loading
    if (!phoneNumber || !/^\d{10,15}$/.test(phoneNumber)) { // Simple phone validation
      toast({
        title: 'Valid Phone Number Required',
        description: 'Please enter a valid WhatsApp number (10-15 digits).',
        variant: 'destructive',
      });
       setIsLoadingRequest(false); // Stop loading
      return;
    }

     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email validation
      toast({
        title: 'Valid Email Required',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
        setIsLoadingRequest(false); // Stop loading
      return;
    }

    if (!address || !city || !state || !postalCode) {
      toast({
        title: 'Address Required',
        description: 'Please fill in all shipping address fields.',
        variant: 'destructive',
      });
       setIsLoadingRequest(false); // Stop loading
      return;
    }

    const emailSubject = 'Account Details Requested';
    const emailBody = `A user has requested account details for an order.
                       <br><br><strong>User Details:</strong>
                       <br>Email: ${email}
                       <br>WhatsApp Number: ${phoneNumber}
                       <br><br><strong>Shipping Address:</strong>
                       <br>${address}
                       <br>${city}, ${state} ${postalCode}
                       <br><br><strong>Order Summary:</strong>
                       <br>Total: ${formatAsINR(cartTotal)}
                       <ul>
                       ${cartItems.map(item => `<li>${item.name} (Qty: ${item.quantity}) - ${formatAsINR(item.price * item.quantity)}</li>`).join('')}
                       </ul>
                       <br>Please send payment details via WhatsApp.`;

    // Send email notification TO ADMIN
    const emailSent = await sendEmailNotification(emailSubject, emailBody); // Sends to admin by default

    if (emailSent) {
      setAccountDetailsRequested(true);
      toast({
        title: 'Request Sent!',
        description:
          'Account details for payment will be sent to your WhatsApp shortly. Please complete the payment and upload the receipt below.',
      });
    } else {
        // Specific error is shown by sendEmailNotification
        toast({
          title: 'Request Failed',
          description: 'Could not send the request for account details. Please check the error message or try again.',
          variant: 'destructive',
        });
    }
     setIsLoadingRequest(false); // Stop loading
  };

  const generateOrderNumber = () => {
     const timestamp = Date.now();
     const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
     return `PS-${timestamp}-${randomPart}`;
  };

  // TODO: Implement actual receipt upload logic (requires backend/storage)
  const handleReceiptUpload = async () => {
     setIsLoadingConfirm(true); // Start loading
    if (!receipt) {
      toast({
        title: 'Receipt Required',
        description: 'Please select the payment receipt file to upload.',
        variant: 'destructive',
      });
       setIsLoadingConfirm(false); // Stop loading
      return;
    }
     if (!email) {
        toast({
            title: 'User Email Missing',
            description: 'Cannot send order confirmation without user email.',
            variant: 'destructive',
        });
         setIsLoadingConfirm(false); // Stop loading
        return;
     }

    const orderNumber = generateOrderNumber();

    // --- Placeholder for Actual File Upload ---
    // In a real application, you would upload the 'receipt' file here
    // to a backend service or cloud storage (like Firebase Storage, AWS S3).
    // This would typically involve:
    // 1. Creating FormData
    //    const formData = new FormData();
    //    formData.append('receiptFile', receipt);
    //    formData.append('orderNumber', orderNumber);
    //    formData.append('userEmail', email); // Send other relevant data
    // 2. Sending a POST request to your backend API endpoint
    //    const uploadResponse = await fetch('/api/upload-receipt', { method: 'POST', body: formData });
    // 3. Handling the response from the backend.
    // For now, we'll simulate success and proceed with email notifications.
    const uploadSuccess = true; // Assume upload is successful for now
    console.log(`Simulating upload for receipt: ${receipt.name} for order ${orderNumber}`);
    // --- End Placeholder ---

    if (!uploadSuccess) {
        toast({
            title: 'Upload Failed',
            description: 'Could not upload the payment receipt. Please try again.',
            variant: 'destructive',
        });
        setIsLoadingConfirm(false); // Stop loading
        return;
    }

    // 1. Prepare User Confirmation Email
    const userEmailSubject = `Your Prince Solutions Order Confirmation (#${orderNumber})`;
    const userEmailBody = `<h1>Thank you for your order, ${email}!</h1>
                           <p>Your Order Number: <strong>${orderNumber}</strong></p>
                           <p>We have received your payment receipt for ${formatAsINR(cartTotal)}. Your order is now being processed. We will notify you once it ships.</p>
                           <h2>Order Summary:</h2>
                           <ul>
                             ${cartItems.map(item => `<li>${item.name} (Qty: ${item.quantity}) - ${formatAsINR(item.price * item.quantity)}</li>`).join('')}
                           </ul>
                           <p><strong>Total Paid: ${formatAsINR(cartTotal)}</strong></p>
                           <h2>Shipping To:</h2>
                           <p>
                             ${address}<br>
                             ${city}, ${state} ${postalCode}<br>
                           </p>
                           <p>If you have any questions, please reply to this email or contact us at msprincesolutions@gmail.com / +91-9917122440.</p>
                           <hr>
                           <p><small>Prince Solutions</small></p>`;

     // 2. Prepare Admin Notification Email
    const adminSubject = `✅ Payment Receipt Uploaded - Order #${orderNumber}`;
    const adminBody = `<h2>Payment Receipt Uploaded</h2>
                       <p>A user has uploaded a payment receipt for Order #<strong>${orderNumber}</strong>.</p>
                       <br><strong>User Details:</strong>
                       <br>Email: ${email}
                       <br>WhatsApp: ${phoneNumber}
                       <br><br><strong>Shipping Address:</strong>
                       <br>${address}
                       <br>${city}, ${state} ${postalCode}
                       <br><br><strong>Order Summary:</strong>
                       <br>Total: ${formatAsINR(cartTotal)}
                       <ul>
                         ${cartItems.map(item => `<li>${item.name} (Qty: ${item.quantity}) - ${formatAsINR(item.price * item.quantity)}</li>`).join('')}
                       </ul>
                       <p><strong>Receipt file name:</strong> ${receipt.name}</p>
                       <p><strong>Please verify the payment of ${formatAsINR(cartTotal)} and process the order.</strong></p>
                       <hr>
                       <p><small>This is an automated notification.</small></p>`;

    // 3. Send Emails (Admin first, then User)
    const adminEmailSent = await sendEmailNotification(adminSubject, adminBody);

    if (adminEmailSent) {
        const userEmailSent = await sendEmailNotification(userEmailSubject, userEmailBody, email);

        if (userEmailSent) {
             toast({
                title: 'Order Confirmed!',
                description: `Your order #${orderNumber} has been successfully placed. A confirmation email has been sent to ${email}.`,
                duration: 6000, // Show longer
            });
            clearCart();
            router.push('/store');
        } else {
             // Admin got the email, but user didn't. Still inform user order is placed.
             toast({
                title: 'Order Placed (Confirmation Email Failed)',
                description: `Your order #${orderNumber} was placed, but we couldn't send the confirmation email to ${email}. Please contact us if you don't receive it soon.`,
                variant: 'warning',
                duration: 8000,
             });
             clearCart();
             router.push('/store');
        }
    } else {
         // Failed to notify admin - crucial step failed.
         toast({
            title: 'Order Processing Failed',
            description: 'We could not notify our team about your payment receipt. Please contact support immediately to confirm your order.',
            variant: 'destructive',
            duration: 10000, // Keep visible longer
        });
         // Don't clear cart or redirect yet, as the order might not be processed.
    }
     setIsLoadingConfirm(false); // Stop loading
  };


  return (
    <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
      <Card className="max-w-2xl mx-auto shadow-lg border">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
          <CardDescription>
            {cartItems.length > 0
              ? 'Review your order and provide details to complete your purchase.'
              : 'Your cart is empty. Add items from the store to proceed.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {cartItems.length > 0 ? (
            <>
              {/* Order Summary */}
              <div className="space-y-3 border-b pb-6">
                <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                <ul className="space-y-1 text-sm max-h-40 overflow-y-auto pr-2">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>
                        {item.name} <span className="text-muted-foreground">(x{item.quantity})</span>
                      </span>
                      <span className="font-medium">{formatAsINR(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg pt-3 border-t mt-3">
                  <span>Total Amount:</span>
                  <span>{formatAsINR(cartTotal)}</span>
                </div>
              </div>

              {!accountDetailsRequested ? (
                <>
                  {/* Section 1: Contact & Shipping */}
                   <div className="space-y-6">
                     <h3 className="text-lg font-semibold border-b pb-2">1. Contact & Shipping Details</h3>
                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                           <Label htmlFor="email">
                             <Mail className="mr-1 inline-block h-4 w-4 text-muted-foreground relative top-[-1px]" />
                             Email Address <span className="text-destructive">*</span>
                           </Label>
                           <Input
                             type="email"
                             id="email"
                             placeholder="you@example.com"
                             value={email}
                             onChange={e => setEmail(e.target.value)}
                             required
                             aria-required="true"
                           />
                         </div>
                         <div className="space-y-1">
                           <Label htmlFor="phoneNumber">
                             <Phone className="mr-1 inline-block h-4 w-4 text-muted-foreground relative top-[-1px]" />
                             WhatsApp Number <span className="text-destructive">*</span>
                           </Label>
                           <Input
                             type="tel"
                             id="phoneNumber"
                             placeholder="919917122440"
                             value={phoneNumber}
                             onChange={e => setPhoneNumber(e.target.value)}
                             required
                             aria-required="true"
                             pattern="\d{10,15}" // Basic pattern for digits
                           />
                           <p className="text-xs text-muted-foreground">Include country code if outside India.</p>
                         </div>
                      </div>

                       {/* Shipping Address */}
                       <div className="space-y-4 pt-4">
                          <Label htmlFor="address" className="block font-medium">Shipping Address <span className="text-destructive">*</span></Label>
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-sm text-muted-foreground">Street Address</Label>
                            <Input
                              type="text"
                              id="address"
                              placeholder="e.g., 123 Main St, Apartment 4B"
                              value={address}
                              onChange={e => setAddress(e.target.value)}
                              required
                              aria-required="true"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div className="space-y-1">
                               <Label htmlFor="city" className="text-sm text-muted-foreground">City</Label>
                               <Input
                                 type="text"
                                 id="city"
                                 placeholder="e.g., Delhi"
                                 value={city}
                                 onChange={e => setCity(e.target.value)}
                                 required
                                 aria-required="true"
                               />
                             </div>
                              <div className="space-y-1">
                                <Label htmlFor="state" className="text-sm text-muted-foreground">State / Province</Label>
                                <Input
                                  type="text"
                                  id="state"
                                  placeholder="e.g., Uttar Pradesh"
                                  value={state}
                                  onChange={e => setStateValue(e.target.value)}
                                  required
                                  aria-required="true"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="postalCode" className="text-sm text-muted-foreground">Postal Code</Label>
                                <Input
                                  type="text"
                                  id="postalCode"
                                  placeholder="e.g., 244235"
                                  value={postalCode}
                                  onChange={e => setPostalCode(e.target.value)}
                                  required
                                  aria-required="true"
                                />
                              </div>
                           </div>
                       </div>
                   </div>

                   {/* Action Button */}
                   <Button
                      onClick={handleRequestAccountDetails}
                      className="w-full mt-6 bg-accent text-accent-foreground hover:bg-orange-600 text-lg py-3"
                      disabled={isLoadingRequest || !email || !phoneNumber || !address || !city || !state || !postalCode}
                   >
                     {isLoadingRequest ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Requesting...
                        </>
                      ) : (
                        'Request Account Details for Payment'
                      )}
                   </Button>
                   <p className="text-xs text-muted-foreground text-center mt-2">
                     We'll send account details for bank transfer to your WhatsApp number.
                   </p>
                </>
              ) : (
                 // Section 2: Upload Receipt
                <div className="space-y-6 pt-6 border-t">
                   <h3 className="text-lg font-semibold">2. Upload Payment Receipt</h3>
                   <p className="text-sm text-muted-foreground">
                     Please upload the screenshot or PDF of your payment transfer of <strong>{formatAsINR(cartTotal)}</strong>.
                   </p>
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Payment Receipt File <span className="text-destructive">*</span></Label>
                    <Input
                      type="file"
                      id="receipt"
                      accept="image/*,application/pdf" // Accept images and PDFs
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          // Optional: Add file size validation
                           if (file.size > 5 * 1024 * 1024) { // 5MB limit example
                             toast({
                               title: "File Too Large",
                               description: "Receipt file should be less than 5MB.",
                               variant: "destructive",
                             });
                             setReceipt(null);
                             e.target.value = ''; // Reset file input
                           } else {
                              setReceipt(file);
                           }
                        } else {
                          setReceipt(null);
                        }
                      }}
                      className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer border border-input p-2"
                      required
                      aria-required="true"
                    />
                    {receipt && <p className="text-xs text-muted-foreground mt-1">Selected file: {receipt.name} ({(receipt.size / 1024 / 1024).toFixed(2)} MB)</p>}
                  </div>
                   {/* Action Button */}
                  <Button
                     onClick={handleReceiptUpload}
                     className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3"
                     disabled={!receipt || isLoadingConfirm}
                   >
                     {isLoadingConfirm ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Confirming...
                        </>
                      ) : (
                        'Confirm Order & Submit Receipt'
                      )}
                  </Button>
                   <p className="text-xs text-muted-foreground text-center mt-2">
                     Ensure the uploaded receipt clearly shows the transaction details.
                   </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">Your shopping cart is empty. Please add products from the store.</p>
          )}
        </CardContent>
        {/* Footer can be used for additional info if needed */}
        {/* <CardFooter> ... </CardFooter> */}
      </Card>
    </div>
  );
}
