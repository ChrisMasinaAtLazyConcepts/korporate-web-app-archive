import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb', // Set higher limit for file uploads
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, phone, company, message, fileName, fileType, fileSize, fileData } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, and message are required',
        });
      }

      // Insert into database
      const client = await pool.connect();
      
      try {
        const result = await client.query(
          `INSERT INTO enquiries 
           (name, email, phone, company, message, file_name, file_type, file_size, file_data, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING id`,
          [
            name,
            email,
            phone || null,
            company || null,
            message,
            fileName || null,
            fileType || null,
            fileSize || null,
            fileData ? Buffer.from(fileData, 'base64') : null, // Convert base64 to buffer for BYTEA
            'new'
          ]
        );

        res.status(200).json({
          success: true,
          message: 'Enquiry submitted successfully',
          enquiryId: result.rows[0].id,
        });
      } finally {
        client.release();
      }

    } catch (error: any) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to submit enquiry',
      });
    }
  } else if (req.method === 'GET') {
    // Optional: Add endpoint to retrieve enquiries
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT id, name, email, company, status, created_at FROM enquiries ORDER BY created_at DESC');
      client.release();
      
      res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error: any) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch enquiries',
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  }
}