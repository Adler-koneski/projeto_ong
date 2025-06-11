document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.getElementById("cep");
  const form = document.getElementById("form");

  if (cepInput) {
    cepInput.addEventListener("blur", async () => {
      const cep = cepInput.value.replace(/\D/g, "");
      if (cep.length === 8) {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          document.getElementById("rua").value = data.logradouro;
          document.getElementById("bairro").value = data.bairro;
          document.getElementById("cidade").value = data.localidade;
          document.getElementById("estado").value = data.uf;
        }
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const necessidade = {
        instituicao: form.instituicao.value,
        tipoAjuda: form.tipoAjuda.value,
        titulo: form.titulo.value,
        descricao: form.descricao.value,
        cep: form.cep.value,
        rua: form.rua.value,
        bairro: form.bairro.value,
        cidade: form.cidade.value,
        estado: form.estado.value,
        contato: form.contato.value,
      };

      const lista = JSON.parse(localStorage.getItem("necessidades") || "[]");
      lista.push(necessidade);
      localStorage.setItem("necessidades", JSON.stringify(lista));

      alert("Necessidade cadastrada com sucesso!");
      form.reset();
    });
  }

  const listaDiv = document.getElementById("lista");
  if (listaDiv) {
    const dados = JSON.parse(localStorage.getItem("necessidades") || "[]");

    const render = () => {
      const filtro = document.getElementById("filtro").value.toLowerCase();
      const busca = document.getElementById("pesquisa").value.toLowerCase();
      listaDiv.innerHTML = "";

      dados
        .filter(item =>
          (!filtro || item.tipoAjuda.toLowerCase() === filtro) &&
          (item.titulo.toLowerCase().includes(busca) || item.descricao.toLowerCase().includes(busca))
        )
        .forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p><strong>Instituição:</strong> ${item.instituicao}</p>
            <p><strong>Tipo:</strong> ${item.tipoAjuda}</p>
            <p><strong>Descrição:</strong> ${item.descricao}</p>
            <p><strong>Contato:</strong> ${item.contato}</p>
            <p><strong>Endereço:</strong> ${item.rua}, ${item.bairro}, ${item.cidade} - ${item.estado}</p>
          `;
          listaDiv.appendChild(card);
        });
    };

    document.getElementById("filtro").addEventListener("change", render);
    document.getElementById("pesquisa").addEventListener("input", render);
    render();
  }
}); 