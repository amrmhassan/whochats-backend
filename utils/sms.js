import twilio from 'twilio';

const sendSMS = async (text, phoneNo) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const myPhone = process.env.TWILIO_PHONE_NUMBER;
  const client = twilio(accountSid, authToken);
  await client.messages.create({
    body: text,
    from: myPhone,
    to: phoneNo,
  });
};
export default sendSMS;
