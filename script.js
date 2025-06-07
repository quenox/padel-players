document.addEventListener('DOMContentLoaded', () => {

    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');

    // --- Mobile Menu Toggle (sin cambios) ---
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('hidden');
            navList.classList.toggle('flex');
        });
    }

    // --- 1. Inicializar AutoAnimate ---
    // ¡Esto animará automáticamente cualquier cambio en estos contenedores!
    const mainContainer = document.getElementById('main-container');
    const playerListElement = document.getElementById('player-list');
    if (mainContainer) AutoAnimate(mainContainer);
    if (playerListElement) AutoAnimate(playerListElement);

    const playerProfileElement = document.getElementById('player-profile');
    const welcomeMessageElement = document.getElementById('welcome-message');
    let playersData = [];

    // --- Profile Elements Cache (sin cambios) ---
    const profilePhoto = document.getElementById('profile-photo');
    const profileName = document.getElementById('profile-name');
    const profileCategory = document.getElementById('profile-category');
    const profileSkillsContainer = document.getElementById('profile-skills');
    const paddleName = document.getElementById('paddle-name');
    const paddlePhoto = document.getElementById('paddle-photo');
    const specialPaddlePhoto = document.getElementById('special-paddle-photo');
    // Actualizamos el selector para el nuevo ID de profile-card
    const profileCard = document.getElementById('profile-card'); 

    // --- Category Styling Map (Ahora con clases de badge de DaisyUI) ---
    const categoryStyles = {
        'primera': { border: 'border-t-[7px] border-red-600', bg: 'badge-error' },
        'segunda': { border: 'border-t-[5px] border-purple-600', bg: 'badge-secondary' },
        'tercera': { border: 'border-t-[5px] border-blue-500', bg: 'badge-info' },
        'cuarta': { border: 'border-t-[5px] border-green-500', bg: 'badge-success' },
        'quinta': { border: 'border-t-[5px] border-orange-700', bg: 'badge-warning' },
        'sexta': { border: 'border-t-[5px] border-orange-500', bg: 'badge-warning' },
        'otro': { border: 'border-t-[5px] border-slate-500', bg: 'badge-neutral' },
        'desconocido': { border: 'border-t-[5px] border-gray-400', bg: 'badge' },
    };
    const defaultCategory = categoryStyles['desconocido'];

    // --- Load Player Data (sin cambios) ---
    fetch('players.json')
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(data => {
            playersData = data;
            populatePlayerList(playersData);
        })
        .catch(error => {
            console.error("Error loading players.json:", error);
            playerListElement.innerHTML = '<li><a class="text-red-600">Error al cargar jugadores.</a></li>';
        });

    // --- Populate Player List (adaptado a "menu" de DaisyUI) ---
    function populatePlayerList(players) {
        playerListElement.innerHTML = ''; // Clear 'Loading...'
        if (players.length === 0) {
            playerListElement.innerHTML = '<li><a>No hay jugadores registrados.</a></li>';
            return;
        }
        players.forEach(player => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = player.name;
            listItem.appendChild(link);
            
            listItem.dataset.playerId = player.id;

            listItem.addEventListener('click', () => {
                displayPlayerProfile(player);
                highlightSelectedPlayer(player.id);
            });
            playerListElement.appendChild(listItem);
        });
    }

    // --- Display Player Profile (MUY SIMPLIFICADO) ---
    function displayPlayerProfile(player) {
        // 1. Ocultar mensaje de bienvenida y mostrar perfil.
        // AutoAnimate se encarga de la transición visual.
        welcomeMessageElement.classList.add('hidden');
        playerProfileElement.classList.remove('hidden');

        // 2. Actualizar contenido del perfil
        profilePhoto.src = player.photo || 'images/default_player.png';
        profilePhoto.alt = `Foto de ${player.name}`;
        profileName.textContent = player.name;

        const categoryKey = (player.category || 'desconocido').toLowerCase().replace(' ', '-');
        const styles = categoryStyles[categoryKey] || defaultCategory;

        profileCategory.textContent = player.category || 'Desconocido';
        // Reset badge classes, usa la clase base de DaisyUI y la de color
        profileCategory.className = 'badge badge-lg text-white font-bold uppercase tracking-wider';
        profileCategory.classList.add(styles.bg);
        
        // Reset card border
        profileCard.className = 'card-body p-6'; // Clases base
        styles.border.split(' ').forEach(cls => profileCard.classList.add(cls));

        // Update skills (sin cambios en la lógica interna)
        profileSkillsContainer.innerHTML = '';
        if (player.skills && Object.keys(player.skills).length > 0) {
            Object.entries(player.skills).forEach(([skillName, skillLevel]) => {
                const skillElement = document.createElement('div');
                skillElement.className = 'bg-base-200 p-3 rounded-md text-center border border-base-300 transition duration-300 hover:bg-base-300 hover:shadow-sm';
                skillElement.innerHTML = `
                    <span class="font-semibold block mb-1 text-sm">${skillName}</span>
                    <span class="text-lg font-bold text-[#0a4f6e]">${skillLevel}</span>
                `;
                profileSkillsContainer.appendChild(skillElement);
            });
        } else {
            profileSkillsContainer.innerHTML = '<p class="text-gray-500 italic">No hay habilidades registradas.</p>';
        }

        // Update equipment (sin cambios en la lógica interna)
        const paddleItem = paddlePhoto.closest('.paddle-item');
        if (player.paddle) {
            paddleName.textContent = player.paddle.name || 'Pala Principal';
            paddlePhoto.src = player.paddle.photo || 'images/default_paddle.png';
            paddleName.classList.toggle('hidden', !player.paddle.name);
            paddleItem.classList.remove('hidden');
        } else {
            paddleItem.classList.add('hidden');
        }
        
        const specialPaddleItem = specialPaddlePhoto.closest('.paddle-item');
        if (player.specialPaddle && player.specialPaddle.photo) {
            specialPaddlePhoto.src = player.specialPaddle.photo;
            specialPaddleItem.classList.remove('hidden');
        } else {
            specialPaddleItem.classList.add('hidden');
        }
    }
    
    // --- Highlight Selected Player (adaptado para "menu" de DaisyUI) ---
    function highlightSelectedPlayer(playerId) {
        const listItems = playerListElement.querySelectorAll('li');
        listItems.forEach(item => {
            // La clase "active" de DaisyUI se encarga de todo el estilo.
            if (item.dataset.playerId == playerId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // --- Image Modal Logic (adaptado para DaisyUI) ---
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");

    function openModal(imgElement) {
        if (imgElement && imgElement.src && !imgElement.src.includes('default') && modal) {
             modalImg.src = imgElement.src;
             modalImg.alt = imgElement.alt;
             modal.showModal(); // API de DaisyUI para abrir el modal
        }
    }

    // Listeners para abrir el modal (sin cambios, pero ahora llaman a showModal())
    [profilePhoto, paddlePhoto, specialPaddlePhoto].forEach(img => {
        if(img) img.addEventListener("click", () => openModal(img));
    });

}); // End of DOMContentLoaded
