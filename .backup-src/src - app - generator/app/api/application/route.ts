import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

export async function POST(req: Request) {
  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Server configuration error: Missing email credentials.' }, { status: 500 });
    }

    const formData = await req.formData();

    const fullName = formData.get('fullName') as string;
    const age = formData.get('age') as string;
    const fatherName = formData.get('fatherName') as string;
    const motherName = formData.get('motherName') as string;
    const englishProficiency = formData.get('englishProficiency') as string;
    const englishScore = formData.get('englishScore') as string;
    const otherCurriculum = formData.get('otherCurriculum') as string;
    const selectedCountry = formData.get('selectedCountry') as string;
    const selectedCity = formData.get('selectedCity') as string;
    const selectedUniversity = formData.get('selectedUniversity') as string;
    const selectedCourseName = formData.get('selectedCourseName') as string;
    const selectedCourseSubject = formData.get('selectedCourseSubject') as string;

    const attachments: { filename: string; content: Buffer }[] = [];
    const fileKeys = ['passport', 'sscCertificate', 'hscCertificate', 'bscCertificate', 'mscCertificate'];

    for (const key of fileKeys) {
      const file = formData.get(key) as File | null;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        attachments.push({
          filename: `${key}_${file.name}`,
          content: buffer,
        });
      }
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Student Application</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding: 40px 20px;" align="center">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" cellspacing="0" cellpadding="0" border="0">
                
                <tr>
                  <td style="background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">New Application Received</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Student Admission Portal</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Personal Information</h2>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Full Name</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Age</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${age}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Father's Name</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${fatherName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Mother's Name</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${motherName}</td>
                      </tr>
                    </table>

                    <h2 style="color: #1f2937; margin: 30px 0 20px 0; font-size: 18px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Academic Profile</h2>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">English Test</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${englishProficiency}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Score</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${englishScore}</td>
                      </tr>
                    </table>

                    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-top: 30px;">
                      <h3 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 16px;">Selected Program</h3>
                      <p style="margin: 0 0 5px 0; color: #374151; font-weight: 700; font-size: 15px;">${selectedUniversity}</p>
                      <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">${selectedCity}, ${selectedCountry}</p>
                      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 10px 0;" />
                      <p style="margin: 0; color: #1f2937; font-size: 14px;"><strong>${selectedCourseName}</strong> <span style="color: #6b7280;">(${selectedCourseSubject})</span></p>
                    </div>

                    ${
                      otherCurriculum
                        ? `
                      <div style="margin-top: 30px;">
                        <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0;">Other Activities</h3>
                        <p style="background-color: #fefce8; color: #854d0e; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.5; margin: 0;">
                          ${otherCurriculum}
                        </p>
                      </div>
                    `
                        : ''
                    }
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                       <p style="color: #6b7280; font-size: 13px; margin: 0;">Included Attachments: ${attachments.length} files</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `Application Portal <${GMAIL_USER}>`,
      to: 'info.jahidhasanavikhan@gmail.com',
      subject: `New Application: ${fullName} - ${selectedUniversity}`,
      html: htmlContent,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send application.' }, { status: 500 });
  }
}
