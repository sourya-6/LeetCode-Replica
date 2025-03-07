import nodemailer from "nodemailer";
//import dotenv from "dotenv";

//dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail ID
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

export const sendWelcomeEmail = async (userEmail, userName) => {
  console.log("hey", userEmail);
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "🚀 Welcome to CodeChamp!",
      html: `
        <h1>Welcome to CodeChamp, ${userName}! 🚀</h1>
        <p>We're thrilled to have you onboard.</p>
        <p>Start solving coding challenges, improve your skills, and climb the leaderboard! 🏆</p>
        <p>Get ready to code, compete, and become a coding champion! 💻🔥</p>
        <br>
        <p>Best Regards,</p>
        <p><strong>CodeChamp Team</strong></p>
`,
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Welcome email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

//sendWelcomeEmail(userEmail,userName);
