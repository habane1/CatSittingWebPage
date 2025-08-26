#!/usr/bin/env node

/**
 * Script to check and cancel expired deposits
 * Run this manually or set up as a cron job to run every hour
 * 
 * Note: Deposits now expire after 23 hours (Stripe limitation)
 * 
 * Usage:
 * - Manual: node scripts/check-expired-deposits.js
 * - Cron: 0 * * * * cd /path/to/your/project && node scripts/check-expired-deposits.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text, html) {
  try {
    await transporter.sendMail({
      from: `"Cat Sitting Service" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
  }
}

async function checkExpiredDeposits() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB || "catsitting");
    const now = new Date();
    
            // Find bookings with pending deposits that have expired (23 hours)
        const expiredBookings = await db.collection("bookings").find({
          status: "approved",
          "deposit.status": "pending",
          "deposit.deadline": { $lt: now }
        }).toArray();
    
    if (expiredBookings.length === 0) {
      console.log('✅ No expired deposits found');
      return;
    }
    
    console.log(`⚠️ Found ${expiredBookings.length} expired deposits`);
    
    const cancelledBookings = [];
    
    for (const booking of expiredBookings) {
      console.log(`🔄 Processing expired booking for ${booking.name} (${booking.email})`);
      
      // Update booking status to cancelled
      await db.collection("bookings").updateOne(
        { _id: booking._id },
        { 
          $set: { 
            status: "cancelled",
            "deposit.status": "expired",
            cancelledAt: now,
            cancellationReason: "Deposit payment expired after 23 hours"
          } 
        }
      );
      
      // Send cancellation email to client
      try {
        const emailSubject = "❌ Your Cat Sitting Booking Has Been Cancelled";
        const emailText = `Hi ${booking.name},

Unfortunately, your cat sitting booking has been automatically cancelled because the 50% deposit payment was not completed within the required 23-hour window.

Booking Details:
- Service: Cat Sitting
- Dates: ${Array.isArray(booking.dates) ? booking.dates.map(d => new Date(d).toLocaleDateString()).join(", ") : "To be confirmed"}
- Notes: ${booking.notes || "None"}

If you would like to rebook, please visit our website and submit a new booking request.

We apologize for any inconvenience this may cause.

Best regards,
The Cat Sitting Team`;

        const emailHtml = `
          <div style="font-family: 'Inter', 'Nunito', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; padding: 20px; border-radius: 12px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #E1D4C8;">
              <div style="background-color: #8A9A6B; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; font-weight: bold;">🐱</div>
              <h1 style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; font-weight: bold;">Cat Nanny Ottawa</h1>
            </div>
            
            <h2 style="color: #B0967A; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 20px; text-align: center;">❌ Your Cat Sitting Booking Has Been Cancelled</h2>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${booking.name},</p>
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Unfortunately, your cat sitting booking has been automatically cancelled because the 50% deposit payment was not completed within the required 23-hour window.</p>
            
            <div style="background-color: #F0EBE6; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #B0967A;">
              <h3 style="color: #6B4C3B; margin-top: 0; font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 15px;">📋 Cancelled Booking Details:</h3>
              <div style="color: #515151; font-size: 15px; line-height: 1.8;">
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Service:</strong> Cat Sitting</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Dates:</strong> ${Array.isArray(booking.dates) ? booking.dates.map(d => new Date(d).toLocaleDateString()).join(", ") : "To be confirmed"}</p>
                <p style="margin: 8px 0;"><strong style="color: #6B4C3B;">Notes:</strong> ${booking.notes || "None"}</p>
              </div>
            </div>

            <div style="background-color: #F7F8F4; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #DDE3D1;">
              <p style="color: #6F7D55; font-size: 16px; margin: 0; text-align: center;"><strong>🔄 Would you like to rebook?</strong></p>
              <p style="color: #515151; font-size: 14px; margin: 10px 0 0 0; text-align: center;">Please visit our website and submit a new booking request when you're ready.</p>
            </div>
            
            <p style="color: #515151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">We apologize for any inconvenience this may cause and hope to serve you in the future.</p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #E1D4C8;">
              <p style="color: #6B4C3B; font-family: 'Playfair Display', serif; font-size: 16px; margin: 0;"><strong>Best regards,<br>The Cat Nanny Ottawa Team</strong></p>
              <p style="color: #818181; font-size: 12px; margin-top: 10px;">🐱 Professional Cat Sitting Services in Ottawa</p>
            </div>
          </div>
        `;

        await sendEmail(booking.email, emailSubject, emailText, emailHtml);
      } catch (emailError) {
        console.error(`❌ Error sending cancellation email for booking ${booking._id}:`, emailError);
      }
      
      cancelledBookings.push({
        id: booking._id,
        name: booking.name,
        email: booking.email,
        dates: booking.dates
      });
    }
    
    console.log(`✅ Successfully cancelled ${cancelledBookings.length} expired bookings`);
    
    // Log summary
    console.log('\n📊 Summary of cancelled bookings:');
    cancelledBookings.forEach(booking => {
      console.log(`  - ${booking.name} (${booking.email}) - ${Array.isArray(booking.dates) ? booking.dates.map(d => new Date(d).toLocaleDateString()).join(", ") : "No dates"}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking expired deposits:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('✅ Disconnected from MongoDB');
    }
  }
}

// Run the script
if (require.main === module) {
  console.log('🚀 Starting expired deposits check...');
  console.log(`⏰ Current time: ${new Date().toLocaleString()}`);
  
  checkExpiredDeposits()
    .then(() => {
      console.log('✅ Expired deposits check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkExpiredDeposits };
