import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { nome, cpf, email, senha } = req.body;

  if (!nome || !cpf || !email || !senha) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

    await sendEmailVerification(userCredential.user);

    await setDoc(doc(db, "usuarios", userCredential.user.uid), {
      nome,
      cpf,
      email,
      criado_em: new Date(),
    });

    return res.status(200).json({ message: "Usuário cadastrado com sucesso!" });

  } catch (error) {
    console.error("ERRO BACKEND:", error);
    return res.status(400).json({ error: error.message });
  }
}
