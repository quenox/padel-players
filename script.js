document.addEventListener('DOMContentLoaded', () => {

    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    // Verificar que ambos elementos existen antes de añadir el event listener
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            // Alterna la clase 'visible' en la lista de navegación
            navList.classList.toggle('visible');
        });
    }
    
    const playerListElement = document.getElementById('player-list');
    const playerProfileElement = document.getElementById('player-profile');
    const welcomeMessageElement = document.getElementById('welcome-message');
    let playersData = []; // Para almacenar los datos de los jugadores

    // --- Elementos del perfil (para no buscarlos cada vez) ---
    const profilePhoto = document.getElementById('profile-photo');
    const profileName = document.getElementById('profile-name');
    const profileCategory = document.getElementById('profile-category');
    const profileSkillsContainer = document.getElementById('profile-skills');
    const paddleName = document.getElementById('paddle-name');
    const paddlePhoto = document.getElementById('paddle-photo');
    const specialPaddlePhoto = document.getElementById('special-paddle-photo');
    const profileCard = playerProfileElement.querySelector('.profile-card'); // El contenedor interno

    // --- 1. Cargar datos de los jugadores ---
    fetch('players.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            playersData = data;
            populatePlayerList(playersData);
            // Opcional: Mostrar el primer jugador por defecto
            // if (playersData.length > 0) {
            //     displayPlayerProfile(playersData[0]);
            //     highlightSelectedPlayer(playersData[0].id);
            // }
        })
        .catch(error => {
            console.error("Error al cargar players.json:", error);
            playerListElement.innerHTML = '<li class="error">Error al cargar jugadores.</li>';
        });

    // --- 2. Poblar la lista de jugadores ---
    function populatePlayerList(players) {
        playerListElement.innerHTML = ''; // Limpiar 'Cargando...'
        if (players.length === 0) {
            playerListElement.innerHTML = '<li>No hay jugadores registrados.</li>';
            return;
        }
        players.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = player.name;
            listItem.dataset.playerId = player.id; // Guardar el ID para fácil acceso
            listItem.addEventListener('click', () => {
                displayPlayerProfile(player);
                highlightSelectedPlayer(player.id);
            });
            playerListElement.appendChild(listItem);
        });
    }

    // --- 3. Mostrar el perfil del jugador seleccionado ---
    function displayPlayerProfile(player) {
        // Ocultar mensaje de bienvenida y mostrar perfil
        welcomeMessageElement.style.display = 'none';
        playerProfileElement.classList.add('visible'); // Añade clase para animación CSS

        // Actualizar datos básicos
        profilePhoto.src = player.photo || 'images/default_player.png'; // Imagen por defecto si no hay
        profilePhoto.alt = `Foto de ${player.name}`;
        profileName.textContent = player.name;

        // Actualizar y estilizar categoría
        profileCategory.textContent = player.category || 'Desconocido';
        // Limpiar clases de categoría anteriores y añadir la nueva
        const categoryClass = `category-${(player.category || 'desconocido').toLowerCase().replace(' ', '-')}`;
        profileCard.className = 'profile-card'; // Resetea clases excepto la base
        profileCard.classList.add(categoryClass); // Añade la clase específica de la categoría
        profileCategory.className = 'category-badge'; // Resetea clases de la insignia
        profileCategory.classList.add(categoryClass); // Añade la clase a la insignia también


        // Actualizar Habilidades (DINÁMICAMENTE)
        profileSkillsContainer.innerHTML = ''; // Limpiar habilidades anteriores
        if (player.skills && typeof player.skills === 'object') {
            for (const skillName in player.skills) {
                if (Object.hasOwnProperty.call(player.skills, skillName)) {
                    const skillLevel = player.skills[skillName];
                    const skillElement = document.createElement('div');
                    skillElement.classList.add('skill-item');
                    // Podrías añadir data-aos aquí si usas esa librería
                    // skillElement.setAttribute('data-aos', 'fade-up');
                    skillElement.innerHTML = `
                        <span class="skill-name">${skillName}</span>
                        <span class="skill-level">${skillLevel}</span>
                    `;
                    profileSkillsContainer.appendChild(skillElement);
                }
            }
        } else {
             profileSkillsContainer.innerHTML = '<p>No hay habilidades registradas.</p>';
        }

        // Actualizar Pala Normal
        if (player.paddle) {
            paddleName.textContent = player.paddle.name || 'Pala Principal'; // Nombre por defecto si no se especifica
             paddlePhoto.src = player.paddle.photo || 'images/default_paddle.png'; // Imagen por defecto
             paddlePhoto.alt = player.paddle.name ? `Pala ${player.paddle.name}` : 'Pala principal';
             paddleName.style.display = player.paddle.name ? 'block' : 'none'; // Ocultar si no hay nombre
        } else {
             paddleName.textContent = '';
             paddlePhoto.src = 'images/default_paddle.png';
             paddlePhoto.alt = 'Pala no especificada';
             paddleName.style.display = 'none';
        }


        // Actualizar Pala Especial
         if (player.specialPaddle && player.specialPaddle.photo) {
             specialPaddlePhoto.src = player.specialPaddle.photo;
             specialPaddlePhoto.alt = `Pala especial de ${player.name}`;
             specialPaddlePhoto.parentElement.style.display = 'block'; // Mostrar contenedor
         } else {
              specialPaddlePhoto.parentElement.style.display = 'none'; // Ocultar si no hay pala especial
         }

         // Opcional: Si usas AOS, refresca para detectar nuevos elementos
         // if (typeof AOS !== 'undefined') { AOS.refresh(); }
    }

    // --- 4. Resaltar jugador seleccionado en la lista ---
    function highlightSelectedPlayer(playerId) {
        const listItems = playerListElement.querySelectorAll('li');
        listItems.forEach(item => {
            if (item.dataset.playerId == playerId) { // Usar == porque dataset es string
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

     // Opcional: Inicializar AOS si lo has añadido
     // if (typeof AOS !== 'undefined') {
     //    AOS.init({
     //        duration: 800, // Duración de las animaciones
     //        once: true // Animación solo una vez
     //    });
     // }



    /* para el modal */
    // Referencias
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close");
    
    // Abrir modal al hacer clic en la imagen
    specialPaddlePhoto.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = specialPaddlePhoto.src;
    });
    
    // Cerrar modal al hacer clic en la "X"
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });


    
}); // Fin de DOMContentLoaded
