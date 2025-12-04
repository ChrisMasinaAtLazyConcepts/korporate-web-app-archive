import { useState } from 'react';
import { Pool } from 'pg';

// PostgreSQL connection - only create once
let pool: Pool | null = null;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
};

interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  fileName?: string | null;  // Allow null
  fileType?: string | null;  // Allow null
  fileSize?: number | null;  // Allow null
  fileData?: string | null;  // Allow null
}

interface UseEnquiryReturn {
  submitEnquiry: (data: EnquiryData) => Promise<{ success: boolean; error?: string; enquiryId?: number }>;
  loading: boolean;
  error: string | null;
}

export const useEnquiry = (): UseEnquiryReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEnquiry = async (data: EnquiryData): Promise<{ success: boolean; error?: string; enquiryId?: number }> => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!data.name || !data.email || !data.message) {
        throw new Error('Missing required fields: name, email, and message are required');
      }

      const pool = getPool();
      const client = await pool.connect();

      try {
        const result = await client.query(
          `INSERT INTO enquiries 
           (name, email, phone, company, message, file_name, file_type, file_size, file_data, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING id`,
          [
            data.name,
            data.email,
            data.phone || null,
            data.company || null,
            data.message,
            data.fileName || null,
            data.fileType || null,
            data.fileSize || null,
            data.fileData ? Buffer.from(data.fileData, 'base64') : null,
            'new'
          ]
        );

        return {
          success: true,
          enquiryId: result.rows[0].id,
        };
      } finally {
        client.release();
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to submit enquiry';
      setError(errorMessage);
      console.error('Database error:', err);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitEnquiry,
    loading,
    error,
  };
};