export default {
  subtitle: "Přihlášení do aplikace",
  alerts: {
    dev: {
      title: "ČTI PŘED POUŽITÍM",
      message: "Aplikace zatím není doporučená pro produkční použití. Aplikace je stále ve VÝVOJI!"
    },
    verify: {
      missingToken: {
        title: "Chybějící token",
        message: "Pokud jste se proklikli přes ověřovací e-mail, zkuste akci zopakovat ještě jednou.",
        goToLogin: "Zpět na přihlášení"
      },
      generic: {
        title: "Ověření bylo neúspěšné",
        message: "Token není validní nebo je prošlý.",
        sendVerification: {
          message: "Chcete zaslat nový ověřovací e-mail?",
          sent: "Ověřovací e-mail odeslán",
          send: "Odeslat nový ověřovací e-mail"
        }
      },
      success: {
        title: "Ověření bylo úspěšné!",
        message: "Nyní budete přesměrováni do aplikace..."
      }
    }
  },
  footer: {
    help: "Potřebujete pomoc? Napište nám na email"
  },

  forms: {
    signin: {
      email: "E-mail",
      password: "Heslo",
      submit: "Přihlásit se",
      or: "nebo",
      submitGoogle: "Přihlášení pomocí Google",
      forgotPassword: "Zapomněli jste heslo?",
      dontHaveAccount: "Ještě nemáte účet?",
      signUp: "Registrovat se"
    },
    signup: {
      fullName: "Celé jméno",
      email: "E-mail",
      password: "Heslo",
      submit: "Registrovat pomocí emailu",
      alreadyRegistered: "Máte již účet?",
      signIn: "Přihlásit se"
    },
    resetPassword: {
      request: {
        email: "E-mail",
        submit: "Obnovit heslo",
        sent: "Odkaz na obnovu hesla byl zaslán na zadaný e-mail.",
        goToLogin: "Zpět na přihlášení",
        signIn: "Přihlásit se"
      },
      submit: {
        password: "Heslo",
        passwordAgain: "Heslo znovu",
        submit: "Obnovit heslo"
      }
    },
  },
}