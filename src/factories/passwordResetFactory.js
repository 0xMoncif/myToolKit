const { generateVerificationToken } = require("../utils/tokenGenerators");
const { sendPasswordReset } = require("../services/emailServices");
const bcrypt = require("bcrypt");
const createPasswordController = (options) => {
  const {
    // essential configs :
    UserModel,
    VerificationEmailTokenModel,
    //token config
    tokenExpiration = 1000 * 60 * 5,
    // messages
    messages = {
      emailSent: "Email sent to the intended email",
      passwordReseted: "password reseted successfully",
      // error messages
      badRequest: "bad Request",
      tokenError: "something went wrong with generating the token",
      invalidToken: "expired or invalid token",
      somethingWrong: "something went wrong",
    },
  } = options;

  return {
    forgotPassword: async (req, res) => {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ message: "bad request email required" });

      try {
        const user = await UserModel.findOne({ email: email });
        if (!user) return res.status(200).json({ message: messages.emailSent });
        const token = await generateVerificationToken(
          user._id,
          tokenExpiration,
          VerificationEmailTokenModel
        );

        if (!token)
          return res.status(401).json({ message: messages.tokenError });
        await sendPasswordReset(user, token , {expiryTime : "1 hour"});
        res.status(200).json({ message: messages.emailSent });
      } catch (error) {
        res
          .status(500)
          .json({ message: messages.somethingWrong, error: error.message });
        console.log(error);
      }
    },
    resetPassword: async (req, res) => {
      const { newPassword } = req.body;
      const { token } = req.query;
      if (!newPassword || !token) {
        return res
          .status(400)
          .json({ message: messages.badRequest + "new password or token" });
      }

      try {
        const verificationToken = await VerificationEmailTokenModel.findOne({
          token: token,
        });
        if (!verificationToken)
          return res.status(401).json({ message: messages.invalidToken });

        const newHashedPassword = await bcrypt.hash(newPassword, 12);
        const newUserData = await UserModel.findByIdAndUpdate(
          verificationToken.user_id,
          {
            $set: { password: newHashedPassword },
          }
        );
        // deleting the token from the DB
        if (newUserData) {
          await VerificationEmailTokenModel.findOneAndDelete({ token: token });
        }

        res.status(200).json({ message: messages.passwordReseted });
      } catch (error) {
        res
          .status(500)
          .json({ message: messages.somethingWrong, error: error.message });
      }
    },
  };
};

module.exports = createPasswordController;
