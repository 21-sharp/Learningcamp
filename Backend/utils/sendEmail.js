import nodemailer from "nodemailer";

import { ENV } from "../config/env.js";

// Create transporter - uses Gmail App Password
const createTransporter = () => {
  if (!ENV.SMTP_EMAIL || !ENV.SMTP_PASSWORD) {
    console.error("❌ SMTP credentials missing in environment variables!");
    throw new Error("SMTP credentials not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ENV.SMTP_EMAIL,
      pass: ENV.SMTP_PASSWORD,
    },
  });
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Verification Email
export const sendOTPEmail = async (email, otp, fullName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"LearningCamp" <${ENV.SMTP_EMAIL}>`,
    to: email,
    subject: "Verify Your Email - LearningCamp",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 32px;text-align:center;">
            <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:28px;line-height:56px;">🔐</span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;letter-spacing:-0.5px;">Email Verification</h1>
            <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">Confirm your email to get started</p>
          </div>
          
          <!-- Body -->
          <div style="padding:40px 32px;">
            <p style="color:#374151;font-size:16px;margin:0 0 8px;">Hello <strong>${fullName}</strong>,</p>
            <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 32px;">
              Thank you for registering with LearningCamp. Please use the verification code below to complete your registration.
            </p>
            
            <!-- OTP Box -->
            <div style="background:linear-gradient(135deg,#f0f0ff,#faf5ff);border:2px dashed #6366f1;border-radius:16px;padding:28px;text-align:center;margin:0 0 32px;">
              <p style="color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your Verification Code</p>
              <p style="font-size:40px;font-weight:800;color:#6366f1;letter-spacing:12px;margin:0;font-family:monospace;">${otp}</p>
            </div>
            
            <div style="background:#fef3c7;border-radius:12px;padding:16px;margin:0 0 24px;">
              <p style="color:#92400e;font-size:13px;margin:0;line-height:1.5;">
                ⏳ This code expires in <strong>10 minutes</strong>. Do not share this code with anyone.
              </p>
            </div>
            
            <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:0;">
              If you didn't create an account on LearningCamp, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">© 2026 LearningCamp. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send Welcome Email (after verification)
export const sendWelcomeEmail = async (email, fullName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"LearningCamp" <${ENV.SMTP_EMAIL}>`,
    to: email,
    subject: "Welcome to LearningCamp! 🎓",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#10b981,#059669);padding:40px 32px;text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">🎉</div>
            <h1 style="color:#ffffff;font-size:26px;margin:0;font-weight:700;">Welcome Aboard!</h1>
            <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:8px 0 0;">Your journey to excellence begins now</p>
          </div>
          
          <!-- Body -->
          <div style="padding:40px 32px;">
            <p style="color:#374151;font-size:16px;margin:0 0 16px;">Hi <strong>${fullName}</strong>,</p>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px;">
              Your email has been verified successfully! Welcome to LearningCamp — the world's most advanced learning platform.
            </p>
            
            <div style="background:#f0fdf4;border-radius:16px;padding:24px;margin:0 0 24px;">
              <h3 style="color:#166534;font-size:15px;margin:0 0 16px;font-weight:700;">Here's what you can do:</h3>
              <div style="margin-bottom:12px;display:flex;align-items:center;">
                <span style="font-size:18px;margin-right:12px;">📚</span>
                <span style="color:#374151;font-size:13px;">Browse and enroll in 200+ expert-led courses</span>
              </div>
              <div style="margin-bottom:12px;display:flex;align-items:center;">
                <span style="font-size:18px;margin-right:12px;">🏆</span>
                <span style="color:#374151;font-size:13px;">Earn certificates upon course completion</span>
              </div>
              <div style="margin-bottom:12px;display:flex;align-items:center;">
                <span style="font-size:18px;margin-right:12px;">✨</span>
                <span style="color:#374151;font-size:13px;">Collect points and unlock achievement badges</span>
              </div>
              <div style="display:flex;align-items:center;">
                <span style="font-size:18px;margin-right:12px;">📊</span>
                <span style="color:#374151;font-size:13px;">Track your learning progress on your dashboard</span>
              </div>
            </div>
            
            <div style="text-align:center;margin:32px 0;">
              <a href="${ENV.CLIENT_URL || 'http://localhost:3000'}/courses" 
                 style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:12px;font-weight:700;font-size:14px;">
                Start Learning Now →
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">© 2026 LearningCamp. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send Login Notification Email  
export const sendLoginNotificationEmail = async (email, fullName) => {
  const transporter = createTransporter();

  const now = new Date();
  const loginTime = now.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const mailOptions = {
    from: `"LearningCamp Security" <${ENV.SMTP_EMAIL}>`,
    to: email,
    subject: "New Sign-in to Your LearningCamp Account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);padding:36px 32px;text-align:center;">
            <div style="font-size:36px;margin-bottom:12px;">🔒</div>
            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">New Sign-in Detected</h1>
          </div>
          
          <!-- Body -->
          <div style="padding:36px 32px;">
            <p style="color:#374151;font-size:15px;margin:0 0 20px;">Hi <strong>${fullName}</strong>,</p>
            <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
              We noticed a new sign-in to your LearningCamp account.
            </p>
            
            <div style="background:#eff6ff;border-radius:12px;padding:20px;margin:0 0 24px;border-left:4px solid #3b82f6;">
              <p style="color:#1e40af;font-size:13px;margin:0 0 8px;font-weight:600;">Sign-in Details</p>
              <p style="color:#374151;font-size:13px;margin:0;">🕐 Time: <strong>${loginTime}</strong></p>
            </div>
            
            <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0 0 16px;">
              If this was you, no further action is required. If you didn't sign in, please secure your account immediately by changing your password.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">© 2026 LearningCamp Security Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send Thank You Email  
export const sendThankYouEmail = async (email, fullName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"LearningCamp" <${ENV.SMTP_EMAIL}>`,
    to: email,
    subject: "Thank You for Joining LearningCamp! 💜",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#8b5cf6,#a855f7);padding:40px 32px;text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">💜</div>
            <h1 style="color:#ffffff;font-size:26px;margin:0;font-weight:700;">Thank You!</h1>
          </div>
          
          <div style="padding:40px 32px;text-align:center;">
            <p style="color:#374151;font-size:16px;margin:0 0 16px;">Dear <strong>${fullName}</strong>,</p>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px;">
              Thank you for being part of the LearningCamp community. We truly appreciate your trust in us for your learning journey.
            </p>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 32px;">
              We're committed to providing you with the best learning experience. If you ever need any help, don't hesitate to reach out!
            </p>
            <p style="color:#8b5cf6;font-size:16px;font-weight:700;margin:0;">Happy Learning! 🚀</p>
          </div>
          
          <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">© 2026 LearningCamp. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send Contact Us Notification
export const sendContactEmail = async (name, email, message) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"LearningCamp Support" <${ENV.SMTP_EMAIL}>`,
    to: ENV.SMTP_EMAIL, // Send to self/admin
    subject: `New Support Inquiry from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px;text-align:center;">
             <h1 style="color:#ffffff;font-size:22px;margin:0;">New Message Received</h1>
          </div>
          <div style="padding:32px;">
            <p style="margin:0 0 16px;color:#374151;"><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <div style="background:#f9fafb;border-radius:12px;padding:20px;border:1px solid #e5e7eb;color:#4b5563;line-height:1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #f3f4f6;font-size:12px;color:#9ca3af;">
            Sent from LearningCamp Contact Form
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);

  // Send confirmation to user
  const userOptions = {
    from: `"LearningCamp Support" <${ENV.SMTP_EMAIL}>`,
    to: email,
    subject: "We've received your message!",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px;">
        <h2 style="color:#6366f1;">Hi ${name},</h2>
        <p>Thank you for reaching out to us. We have received your message and our team will get back to you shortly.</p>
        <p style="color:#666;">Best Regards,<br>LearningCamp Team</p>
      </div>
    `
  };

  await transporter.sendMail(userOptions);
};
