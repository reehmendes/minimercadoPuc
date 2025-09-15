function doisDigitos(n) { return n.toString().padStart(2, "0"); }

// Relógio
function atualizarRelogio() {
    const d = new Date();
    const txt = `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()} ${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}:${doisDigitos(d.getSeconds())}`;
    document.getElementById("relogio").textContent = txt;
}
setInterval(atualizarRelogio, 1000); atualizarRelogio();

// Máscaras
function aplicarMascaraTelefone(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    e.target.value = v;
}
function aplicarMascaraCEP(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
    e.target.value = v;
}
function aplicarMascaraCPF(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length > 7) v = `${v.slice(0, 7)}.${v.slice(7)}`;
    if (v.length > 11) v = `${v.slice(0, 11)}-${v.slice(11)}`;
    e.target.value = v;
}

// CPF
function validarCPF(cpf) {
    const s = cpf.replace(/\D/g, "");
    if (s.length !== 11 || /^([0-9])\1{10}$/.test(s)) return false;
    const dv = (base) => {
        let soma = 0; for (let i = 0; i < base; i++) soma += parseInt(s[i], 10) * (base + 1 - i);
        const r = (soma * 10) % 11; return r === 10 ? 0 : r;
    };
    return dv(9) === parseInt(s[9], 10) && dv(10) === parseInt(s[10], 10);
}

// Serviço
function alternarAvisoEntrega() {
    const entrega = document.getElementById("servicoEntrega");
    document.getElementById("avisoEnderecoEntrega").classList.toggle("d-none", !entrega.checked);
}

// Submit + delay 20s
function aoEnviarFormulario(ev) {
    const form = ev.target;
    const erros = [];

    if (!form.checkValidity()) { ev.preventDefault(); ev.stopPropagation(); }

    const cpf = document.getElementById("cpf");
    const tel = document.getElementById("telefone");
    const cep = document.getElementById("cep");
    const data = document.getElementById("dataAgendamento");
    const hora = document.getElementById("horaAgendamento");

    if (!validarCPF(cpf.value)) { cpf.setCustomValidity("CPF inválido"); erros.push("CPF inválido."); } else cpf.setCustomValidity("");
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(tel.value)) { tel.setCustomValidity("Telefone inválido"); erros.push("Telefone inválido."); } else tel.setCustomValidity("");
    if (!/^\d{5}-\d{3}$/.test(cep.value)) { cep.setCustomValidity("CEP inválido"); erros.push("CEP inválido."); } else cep.setCustomValidity("");

    const algumServico = [...document.querySelectorAll('input[name="servico"]')].some(r => r.checked);
    if (!algumServico) erros.push("Selecione o serviço.");

    if (data.value && hora.value) {
        const when = new Date(`${data.value}T${hora.value}:00`);
        if (when < new Date()) erros.push("Escolha data/horário no futuro.");
    }

    form.classList.add("was-validated");
    const resumo = document.getElementById("resumoErros");
    const avisoDelay = document.getElementById("mensagemSucessoDelay");
    const btn = document.getElementById("btnSalvar");

    if (erros.length) {
        ev.preventDefault();
        resumo.innerHTML = `<strong>Confira:</strong><ul>${erros.map(x => `<li>${x}</li>`).join("")}</ul>`;
        avisoDelay.classList.add("d-none");
        btn.disabled = false; btn.textContent = "Cadastrar";
        return;
    }

    // Tudo válido: aguarda 20s
    ev.preventDefault();
    resumo.textContent = "";
    avisoDelay.classList.remove("d-none");
    let restante = 20;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Validando dados... (${restante}s)`;
    const t = setInterval(() => {
        restante -= 1;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Validando dados... (${restante}s)`;
        if (restante <= 0) { clearInterval(t); btn.textContent = "Enviando..."; form.submit(); }
    }, 1000);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("telefone").addEventListener("input", aplicarMascaraTelefone);
    document.getElementById("cep").addEventListener("input", aplicarMascaraCEP);
    document.getElementById("cpf").addEventListener("input", aplicarMascaraCPF);

    document.getElementById("servicoEntrega").addEventListener("change", alternarAvisoEntrega);
    document.getElementById("servicoRetirada").addEventListener("change", alternarAvisoEntrega);

    document.getElementById("formCliente").addEventListener("submit", aoEnviarFormulario);
});