const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

// Todo este codigo no los proporsiono google. 

const googleVerify = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,  
    });
    const payload = ticket.getPayload();

    console.log(payload);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    const {name, email, picture} = payload;

    return {name, email, picture};
}





module.exports = {
    googleVerify
}
