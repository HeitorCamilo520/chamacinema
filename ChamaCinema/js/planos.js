lucide.createIcons();

function selectPlan(planName) {
    const plans = [
    { name: 'Faísca', id: 'card-faisca' },
    { name: 'Produtor', id: 'card-produtor' }
    ];

    plans.forEach(plan => {
    const card = document.getElementById(plan.id);
    const button = card.querySelector('.plan-btn');

    if (plan.name === planName) {
        card.classList.add('ring-4', 'ring-orange-500/30');
        button.className = 'plan-btn w-full bg-white text-slate-900 font-bold py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95';
        button.innerHTML = '<i data-lucide="check" class="w-5 h-5 stroke-[3]"></i><span>Selecionado</span>';
    } else {
        card.classList.remove('ring-4', 'ring-orange-500/30');
        button.className = 'plan-btn w-full bg-[#111215] hover:bg-black text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95';
        button.innerHTML = '<i data-lucide="tag" class="w-4 h-4 fill-white"></i><span>Assinar</span>';
    }
    });

    lucide.createIcons();

    showToast(`Plano ${planName} Selecionado`, `Você alterou sua assinatura para o plano ${planName}.`);
}

function showToast(title, description) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-desc').textContent = description;

    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
    }, 3500);
}