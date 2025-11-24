import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { nome, cpf, email, senha } = req.body;

    // Criar usuário na autenticação Firebase
    const user = await getAuth().createUser({
      email,
      password: senha,
      displayName: nome,
    });

    // Gerar link de verificação do Firebase
    const verificationLink = await getAuth().generateEmailVerificationLink(email);

    // Salvar dados no Firestore
    await getFirestore()
      .collection("usuarios")
      .doc(user.uid)
      .set({
        nome,
        cpf,
        email,
        criado_em: new Date(),
        verificado: false,
      });

    return res.status(200).json({
      message: "Usuário criado com sucesso!",
      verificar_email: verificationLink, // opcional: enviar via e-mail SMTP
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}
