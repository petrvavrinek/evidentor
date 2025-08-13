import csAuth from "../cs/auth";

export default {
  alerts: {
    dev: {
      title: "README BEFORE USE",
      message: "Keep in mind that this app should not be used for production work. Application is still in development! "
    },
    verify: {
      success: {
        title: "Verification successful!",
        message: "You will be redirected to dashboard in few seconds...",
      },
      missingToken: {
        title: "No token found",
        message: "Missing token, if you came from your verification e-mail, try to sign in once again and request token one more time.",
        goToLogin: "Go back to login"
      },
      generic: {
        title: "Verification unsuccessful",
        message: "Token is invalid or timeouted.",
        sendVerification: {
          message: "You can try to request new one",
          send: "Send new verification e-mail",
          sent: "Verification e-mail sent"
        }
      }
    }
  },
  footer: {
    help: "Need help? Feel free to contact is at"
  },
  subtitle: "Sign in to access dashboard",
  forms: {
    signin: {
      email: "E-mail",
      or: "or",
      password: "Password",
      submit: "Sign in",
      submitGoogle: "Sign in with Google",
      forgotPassword: "Forgot your password?",
      dontHaveAccount: "Don't have an account?",
      signUp: "Sign up"
    },
    signup: {
      email: "E-mail",
      fullName: "Full name",
      password: "Password",
      submit: "Sign up with e-mail",
      alreadyRegistered: "Already registered?",
      signIn: "Sign in"
    },
    resetPassword: {
      request: {
        email: "E-mail",
        goToLogin: "Go to login",
        sent: "Password reset sent. Check your e-mail inbox.",
        submit: "Request password reset",
        signIn: "Sign in"
      },
      submit: {
        password: "Password",
        passwordAgain: "Repeat password",
        submit: "Reset password"
      }
    }
  }
} satisfies typeof csAuth;