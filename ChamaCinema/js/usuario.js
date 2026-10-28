function showToast(message) {
      const toastContainer = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = 'toast-anim bg-[#1f2130] border border-cinema-cardBorder text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 pointer-events-auto';
      toast.innerHTML = `<span>️️️</span> <span>${message}</span>`;
      
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 2500);
    }

    // Modal Editar Perfil
    function openEditModal() {
      const name = document.getElementById('userNameDisplay').innerText;
      const bio = document.getElementById('userBioDisplay').innerText;
      const date = document.getElementById('userDateDisplay').innerText;

      document.getElementById('inputName').value = name;
      document.getElementById('inputBio').value = bio;
      document.getElementById('inputDate').value = date;

      document.getElementById('editProfileModal').classList.remove('hidden');
    }

    function closeEditModal() {
      document.getElementById('editProfileModal').classList.add('hidden');
    }

    function saveProfile(e) {
      e.preventDefault();
      const newName = document.getElementById('inputName').value.trim();
      const newBio = document.getElementById('inputBio').value.trim();
      const newDate = document.getElementById('inputDate').value.trim();

      if (newName) document.getElementById('userNameDisplay').innerText = newName;
      if (newBio) document.getElementById('userBioDisplay').innerText = newBio;
      if (newDate) document.getElementById('userDateDisplay').innerText = newDate;

      closeEditModal();
      showToast('Perfil atualizado com sucesso!');
    }

    // Toggle Favorito (Coração Rosa / Cinza)
    function toggleFavorite(btn, event) {
      event.stopPropagation();
      const svg = btn.querySelector('svg');
      const isCurrentlyActive = btn.classList.contains('active');

      if (isCurrentlyActive) {
        btn.classList.remove('active');
        svg.setAttribute('fill', '#4b5563');
        showToast('Removido dos favoritos');
      } else {
        btn.classList.add('active');
        svg.setAttribute('fill', '#ff007a');
        showToast('Adicionado aos favoritos!');
      }
    }

    // Toggle Tag de Preferência
    function toggleTag(tagElement) {
      const isSelected = tagElement.classList.contains('bg-cinema-pink');
      if (isSelected) {
        tagElement.classList.remove('bg-cinema-pink', 'text-white', 'border-cinema-pink');
        tagElement.classList.add('bg-[#1a1c28]', 'text-gray-300', 'border-cinema-cardBorder');
      } else {
        tagElement.classList.add('bg-cinema-pink', 'text-white', 'border-cinema-pink');
        tagElement.classList.remove('bg-[#1a1c28]', 'text-gray-300', 'border-cinema-cardBorder');
      }
    }

    // Filtro de Busca de Filmes
    function filterMovies() {
      const query = document.getElementById('searchInput').value.toLowerCase().trim();
      const movieCards = document.querySelectorAll('.movie-card-item');

      movieCards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        if (title.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }