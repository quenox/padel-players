document.addEventListener('DOMContentLoaded', () => {

    const navToggle = document.getElementById('nav-toggle');
    const navList = document.getElementById('nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('hidden');
            navList.classList.toggle('flex');
        });
    }

    // Se eliminó toda la inicialización de AutoAnimate
    const playerListElement = document.getElementById('player-list');
    const playerProfileElement = document.getElementById('player-profile');
    const welcomeMessageElement = document.getElementById('welcome-message');
    let playersData = [];

    const profilePhoto = document.getElementById('profile-photo');
    const profileName = document.getElementById('profile-name');
    const profileCategory = document.getElementById('profile-category');
    const profileSkillsContainer = document.getElementById('profile-skills');
    const paddleName = document.getElementById('paddle-name');
    const paddlePhoto = document.getElementById('paddle-photo');
    const specialPaddlePhoto = document.getElementById('special-paddle-photo');
    const profileCard = document.getElementById('profile-card');

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

    function populatePlayerList(players) {
        playerListElement.innerHTML = ''; 

        if (!players || players.length === 0) {
            playerListElement.innerHTML = '<li><a>No hay jugadores registrados.</a></li>';
            return;
        }

        players.forEach(player => {
            const listItem = document.createElement('li');
            listItem.dataset.playerId = player.id;
            const link = document.createElement('a');
            link.textContent = player.name;
            link.href = "#";
            listItem.appendChild(link);
            listItem.addEventListener('click', (e) => {
                e.preventDefault();
                displayPlayerProfile(player);
                highlightSelectedPlayer(player.id);
            });
            playerListElement.appendChild(listItem);
        });
    }

    // Se restaura la lógica simple de mostrar/ocultar, sin animaciones.
    function displayPlayerProfile(player) {
        welcomeMessageElement.classList.add('hidden');
        playerProfileElement.classList.remove('hidden');

        profilePhoto.src = player.photo || 'images/default_player.png';
        profilePhoto.alt = `Foto de ${player.name}`;
        profileName.textContent = player.name;

        const categoryKey = (player.category || 'desconocido').toLowerCase().replace(' ', '-');
        const styles = categoryStyles[categoryKey] || defaultCategory;

        profileCategory.textContent = player.category || 'Desconocido';
        profileCategory.className = 'badge badge-lg text-white font-bold uppercase tracking-wider';
        profileCategory.classList.add(styles.bg);
        
        profileCard.className = 'card-body p-6';
        styles.border.split(' ').forEach(cls => profileCard.classList.add(cls));

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
    
    function highlightSelectedPlayer(playerId) {
        const listItems = playerListElement.querySelectorAll('li');
        listItems.forEach(item => {
            if (item.dataset.playerId == playerId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");

    function openModal(imgElement) {
        if (imgElement && imgElement.src && !imgElement.src.includes('default') && modal) {
             modalImg.src = imgElement.src;
             modalImg.alt = imgElement.alt;
             modal.showModal();
        }
    }
    
    [profilePhoto, paddlePhoto, specialPaddlePhoto].forEach(img => {
        if(img) img.addEventListener("click", () => openModal(img));
    });

});
