// // components/emails/EnquiryEmail.jsx
// import {
//   Html,
//   Head,
//   Preview,
//   Body,
//   Container,
//   Section,
//   Heading,
//   Text,
//   Hr,
//   Link,
// } from '@react-email/components';

// const EnquiryEmail = ({ name, email, phone, company, message, imageUrl }) => {
//   return (
//     <Html>
//       <Head />
//       <Preview>New Enquiry from {name}</Preview>
//       <Body style={main}>
//         <Container style={container}>
//           <Section style={header}>
//             <Heading style={h1}>New Enquiry Received</Heading>
//           </Section>
          
//           <Section style={content}>
//             <Text style={field}>
//               <strong>Name:</strong> {name}
//             </Text>
            
//             <Text style={field}>
//               <strong>Email:</strong> <Link href={`mailto:${email}`} style={link}>{email}</Link>
//             </Text>
            
//             {phone && (
//               <Text style={field}>
//                 <strong>Phone:</strong> <Link href={`tel:${phone}`} style={link}>{phone}</Link>
//               </Text>
//             )}
            
//             {company && (
//               <Text style={field}>
//                 <strong>Company:</strong> {company}
//               </Text>
//             )}
            
//             <Text style={field}>
//               <strong>Message:</strong>
//             </Text>
//             <Text style={messageText}>{message}</Text>
            
//             {imageUrl && (
//               <>
//                 <Text style={field}>
//                   <strong>Attached Image:</strong>
//                 </Text>
//                 <Section style={imageSection}>
//                   <img 
//                     src={imageUrl} 
//                     alt="Attached file" 
//                     style={image} 
//                   />
//                   <br />
//                   <Link href={imageUrl} style={link}>View full image</Link>
//                 </Section>
//               </>
//             )}
//           </Section>
          
//           <Hr style={hr} />
          
//           <Section style={footer}>
//             <Text style={footerText}>
//               This email was sent from the Korporate contact form on {new Date().toLocaleDateString()}
//             </Text>
//           </Section>
//         </Container>
//       </Body>
//     </Html>
//   );
// };

// const main = {
//   backgroundColor: '#f6f9fc',
//   fontFamily: 'Arial, sans-serif',
// };

// const container = {
//   backgroundColor: '#ffffff',
//   margin: '0 auto',
//   padding: '20px',
//   maxWidth: '600px',
//   borderRadius: '8px',
//   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
// };

// const header = {
//   backgroundColor: '#f4f4f4',
//   padding: '20px',
//   textAlign: 'center' as const,
//   borderRadius: '8px 8px 0 0',
// };

// const h1 = {
//   color: '#333333',
//   fontSize: '24px',
//   fontWeight: 'bold',
//   margin: '0',
// };

// const content = {
//   padding: '20px',
// };

// const field = {
//   marginBottom: '15px',
//   color: '#555555',
//   fontSize: '16px',
//   lineHeight: '1.5',
// };

// const messageText = {
//   backgroundColor: '#f8f9fa',
//   padding: '15px',
//   borderRadius: '4px',
//   borderLeft: '4px solid #007bff',
//   fontStyle: 'italic',
//   whiteSpace: 'pre-line',
// };

// const link = {
//   color: '#007bff',
//   textDecoration: 'none',
// };

// const imageSection = {
//   textAlign: 'center' as const,
//   marginTop: '15px',
// };

// const image = {
//   maxWidth: '300px',
//   height: 'auto',
//   borderRadius: '4px',
// };

// const hr = {
//   borderColor: '#e6ebf1',
//   margin: '20px 0',
// };

// const footer = {
//   padding: '20px 0 0 0',
// };

// const footerText = {
//   color: '#888888',
//   fontSize: '12px',
//   textAlign: 'center' as const,
// };

// export default EnquiryEmail;