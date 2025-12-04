import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  imageUrl?: string;
}

// EmailJS configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_p1ogvsf', 
  TEMPLATE_ID: 'template_azd75c7', 
  PUBLIC_KEY: 'zxtMFNwYwk23Srrzh', 
  USER_ID: 'thato.don@gmail.com', 
};

async function sendEmailWithEmailJS(enquiryData: EnquiryData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: 'thato.don@gmail.com',
      from_name: enquiryData.name,
      from_email: enquiryData.email,
      reply_to: enquiryData.email,
      subject: `New Enquiry from ${enquiryData.name}${enquiryData.company ? ` (${enquiryData.company})` : ''}`,
      name: enquiryData.name,
      email: enquiryData.email,
      phone: enquiryData.phone || 'Not provided',
      company: enquiryData.company || 'Not provided',
      message: enquiryData.message,
      image_url: enquiryData.imageUrl || '',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    // Send email using EmailJS REST API
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.SERVICE_ID,
        template_id: EMAILJS_CONFIG.TEMPLATE_ID,
        user_id: EMAILJS_CONFIG.USER_ID,
        template_params: templateParams,
        accessToken: EMAILJS_CONFIG.PUBLIC_KEY,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return { success: true, data: result };

  } catch (error) {
    console.error('EmailJS sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email sending error' 
    };
  }
}

// For Deno environment (if you're still using Deno)
export async function serve(req: any) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, message, imageUrl }: EnquiryData = await req.json();

    // Validate required fields
    if (!email || !name || !message) {
      throw new Error('Missing required fields: email, name, and message are required');
    }

    // Validate EmailJS configuration
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      throw new Error('EmailJS configuration is missing. Please set SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY.');
    }

    // Send email using EmailJS
    const emailResult = await sendEmailWithEmailJS({
      name,
      email,
      phone,
      company,
      message,
      imageUrl,
    });

    if (!emailResult.success) {
      throw new Error(`Email sending failed: ${emailResult.error}`);
    }

    // Store enquiry in database (your existing Supabase code)
    const supabaseUrl = 'https://zqnjyuvszrszyityyiza.storage.supabase.co/storage/v1/s3';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxbmp5dXZzenJzenlpdHl5aXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjYwMjIsImV4cCI6MjA3MzA0MjAyMn0.W054982dBeOGlH-V4WjrwJEp6-kUAq41xW-iz3yxmy8';
    
    if (supabaseUrl && supabaseKey) {
      const supabaseClient = createClient(supabaseUrl, supabaseKey);

      const { error: dbError } = await supabaseClient
        .from('enquiries')
        .insert({
          name,
          email,
          phone,
          company,
          message,
          image_url: imageUrl,
          status: 'new',
          created_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('Failed to save enquiry to database:', dbError.message);
        // Don't throw error here - email was sent successfully
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Enquiry submitted successfully',
        emailId: emailResult.data?.message_id || emailResult.data?.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-enquiry-email function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process enquiry',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
}

// For Node.js/Express environment (alternative)
export async function handleEnquiry(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.set(corsHeaders);
    return res.status(200).end();
  }

  try {
    const { name, email, phone, company, message, imageUrl }: EnquiryData = req.body;

    // Validate required fields
    if (!email || !name || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, name, and message are required',
      });
    }

    // Send email using EmailJS
    const emailResult = await sendEmailWithEmailJS({
      name,
      email,
      phone,
      company,
      message,
      imageUrl,
    });

    if (!emailResult.success) {
      throw new Error(`Email sending failed: ${emailResult.error}`);
    }

    // Store in database (your existing code)
    // ...

    return res.json({
      success: true,
      message: 'Enquiry submitted successfully',
      emailId: emailResult.data?.message_id || emailResult.data?.id,
    });

  } catch (error) {
    console.error('Error processing enquiry:', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process enquiry',
    });
  }
}