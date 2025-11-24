document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("https://atlas-pay.vercel.app/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, cpf, email, senha })
        });

        // Lê como texto para evitar erro
        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text); // transforma em JSON
        } catch {
            alert("Erro inesperado no servidor!");
            console.log("Resposta bruta:", text);
            return;
        }

        if (response.ok) {
            alert("Usuário cadastrado com sucesso! Verifique seu email.");
        } else {
            alert("Erro ao cadastrar: " + data.error);
        }

    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com servidor.");
    }
});
