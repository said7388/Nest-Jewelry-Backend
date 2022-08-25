import * as nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (user, link: string) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'apikey', // generated ethereal user
      pass: process.env.SENDGRID_API_KEY, // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"Jewelry" <mdabusaidriyaz@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Welcome to Jewelry! Confirm Your Email', // Subject line
    text: 'Confirm your account', // plain text body
    html: `
    <b>Hello ${user.fullName}!</b><br />
    <h5>
    You're on your way! <br />
    Let's confirm your email address.</h5>
    <p>By clicking on the following link, you are confirming your email address.</p>
     <a style="background-color: #0675C4; color: #fff; font-size: 18px; font-weight: bold; border-radius: 8px; padding: 8px 20px; display: inline-block; margin: 32px auto; text-decoration: none;" href="${link}" target="_blank">confirm Email</a>
     <p>Your link is active for 24 hours. After that, you will need to resend the verification email.</p>`, // html body
  });
};
