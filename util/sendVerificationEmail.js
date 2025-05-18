const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const getAccessToken = async () => {
  const accessTokenResponse = await oAuth2Client.getAccessToken();
  if (!accessTokenResponse.token) throw new Error("Failed to generate access token");
  return accessTokenResponse.token;
};

const createTransporter = async () => {
  const accessToken = await getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken,
    },
  });
};

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"Truckers Talents INC." <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `
      <h1>Welcome to Truckers Talents INC.</h1>
      <p>To complete your registration, please verify your email address with your verification code:</p>
      <p><strong>${code}</strong></p>
      <p>Enter your code in the verification page: <a href="${process.env.FRONTEND_URL}/verify">${process.env.FRONTEND_URL}/verify</a></p>
      <p>Your verification code will expire in 15 minutes. Please, verify as soon as possible.</p>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };

  try {
    const transporter = await createTransporter();
    await transporter.sendMail(mailOptions);
  } catch (err) {
    // Reintento en caso de error relacionado al token
    console.warn("⚠️ First attempt to send email failed. Retrying...", err.message);
    try {
      const transporterRetry = await createTransporter(); // genera nuevo token
      await transporterRetry.sendMail(mailOptions);
    } catch (finalErr) {
      console.error("❌ Failed to send email after retry:", finalErr);
      throw new Error("Error sending email, even after retry.");
    }
  }
};

module.exports = sendVerificationEmail;