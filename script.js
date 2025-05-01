document.addEventListener('DOMContentLoaded', () => {

    const navToggle = document.getElementById('nav-toggle'); // Use ID for certainty
    const navList = document.getElementById('nav-list');     // Use ID for certainty

    // --- Mobile Menu Toggle ---
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            // Toggle Tailwind classes for visibility and flex display
            navList.classList.toggle('hidden');
            navList.classList.toggle('flex'); // Ensure flex is added when not hidden
        });
    }

    const playerListElement = document.getElementById('player-list');
    const playerProfileElement = document.getElementById('player-profile');
    const welcomeMessageElement = document.getElementById('welcome-message');
    let playersData = []; // To store player data

    // --- Profile Elements Cache ---
    const profilePhoto = document.getElementById('profile-photo');
    const profileName = document.getElementById('profile-name');
    const profileCategory = document.getElementById('profile-category');
    const profileSkillsContainer = document.getElementById('profile-skills');
    const paddleName = document.getElementById('paddle-name');
    const paddlePhoto = document.getElementById('paddle-photo');
    const specialPaddlePhoto = document.getElementById('special-paddle-photo');
    const profileCard = playerProfileElement.querySelector('.profile-card'); // The inner card for borders

    // --- Category Styling Map (Tailwind Classes) ---
    const categoryStyles = {
        'primera':   { border: 'border-t-[7px] border-red-600',       bg: 'bg-red-600' },
        'segunda':   { border: 'border-t-[5px] border-purple-600',    bg: 'bg-purple-600' },
        'tercera':   { border: 'border-t-[5px] border-blue-500',      bg: 'bg-blue-500' },
        'cuarta':    { border: 'border-t-[5px] border-green-500',     bg: 'bg-green-500' },
        'quinta':    { border: 'border-t-[5px] border-deep-orange-600', bg: 'bg-orange-700' }, // Using orange-700 as deep-orange isn't default
        'sexta':     { border: 'border-t-[5px] border-orange-500',    bg: 'bg-orange-500' },
        'otro':      { border: 'border-t-[5px] border-blue-gray-500', bg: 'bg-slate-500' },  // Using slate as blue-gray isn't default
        'desconocido':{ border: 'border-t-[5px] border-gray-400',     bg: 'bg-gray-400' },
    };
    const defaultCategory = categoryStyles['desconocido']; // Fallback

    // --- 1. Load Player Data ---
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
        })
        .catch(error => {
            console.error("Error loading players.json:", error);
            playerListElement.innerHTML = '<li class="p-3 text-red-600">Error al cargar jugadores.</li>';
        });

    // --- 2. Populate Player List ---
    function populatePlayerList(players) {
        playerListElement.innerHTML = ''; // Clear 'Loading...'
        if (players.length === 0) {
            playerListElement.innerHTML = '<li class="p-3 text-gray-500">No hay jugadores registrados.</li>';
            return;
        }
        players.forEach(player => {
            const listItem = document.createElement('li');
            // Base Tailwind classes for list items
            listItem.className = 'py-2 px-3 mb-2 rounded cursor-pointer transition duration-200 ease-in-out border border-gray-200 font-medium text-gray-700 hover:bg-[#e0f7fa] hover:translate-x-1';
            listItem.textContent = player.name;
            listItem.dataset.playerId = player.id; // Store ID

            listItem.addEventListener('click', () => {
                displayPlayerProfile(player);
                highlightSelectedPlayer(player.id);
            });
            playerListElement.appendChild(listItem);
        });
    }

    // --- 3. Display Player Profile with Animation ---
    function displayPlayerProfile(player) {
        // 1. Hide welcome message
        welcomeMessageElement.classList.add('hidden');

        // 2. Prepare profile for display (update content while hidden)
        playerProfileElement.classList.add('opacity-0', 'translate-y-5'); // Ensure start state for transition

        // 3. Update profile content
        profilePhoto.src = player.photo || 'images/default_player.png';
        profilePhoto.alt = `Foto de ${player.name}`;
        profileName.textContent = player.name;

        // Update and style category
        const categoryKey = (player.category || 'desconocido').toLowerCase().replace(' ', '-');
        const styles = categoryStyles[categoryKey] || defaultCategory;

        profileCategory.textContent = player.category || 'Desconocido';
        // Reset badge classes, keep base, add new bg
        profileCategory.className = 'category-badge inline-block py-1 px-3 rounded-full text-xs font-bold text-white uppercase tracking-wider';
        profileCategory.classList.add(styles.bg);

        // Reset card border, keep base, add new border
        profileCard.className = 'profile-card p-6'; // Base classes
        styles.border.split(' ').forEach(cls => profileCard.classList.add(cls)); // Add border classes

        // Update skills
        profileSkillsContainer.innerHTML = '';
        if (player.skills && typeof player.skills === 'object' && Object.keys(player.skills).length > 0) {
            for (const skillName in player.skills) {
                if (Object.hasOwnProperty.call(player.skills, skillName)) {
                    const skillLevel = player.skills[skillName];
                    const skillElement = document.createElement('div');
                    // Tailwind classes for skill item
                    skillElement.className = 'skill-item bg-gray-100 p-3 rounded-md text-center border border-gray-200 transition duration-300 hover:bg-gray-200 hover:shadow-sm';
                    skillElement.innerHTML = `
                        <span class="skill-name font-semibold block mb-1 text-sm text-gray-700">${skillName}</span>
                        <span class="skill-level text-lg font-bold text-[#0a4f6e]">${skillLevel}</span>
                    `;
                    profileSkillsContainer.appendChild(skillElement);
                }
            }
        } else {
            profileSkillsContainer.innerHTML = '<p class="text-gray-500 italic">No hay habilidades registradas.</p>';
        }

        // Update main paddle
        const paddleItem = paddlePhoto.closest('.paddle-item');
        if (player.paddle) {
            paddleName.textContent = player.paddle.name || 'Pala Principal';
            paddlePhoto.src = player.paddle.photo || 'images/default_paddle.png';
            paddlePhoto.alt = player.paddle.name ? `Pala ${player.paddle.name}` : 'Pala principal';
            paddleName.classList.toggle('hidden', !player.paddle.name);
            paddleItem.classList.remove('hidden');
        } else {
            paddleName.textContent = '';
            paddlePhoto.src = 'images/default_paddle.png';
            paddlePhoto.alt = 'Pala no especificada';
            paddleName.classList.add('hidden');
             // Optionally hide the whole item if no paddle at all
             paddleItem.classList.add('hidden');
        }

        // Update special paddle
        const specialPaddleItem = specialPaddlePhoto.closest('.paddle-item');
        if (player.specialPaddle && player.specialPaddle.photo) {
            specialPaddlePhoto.src = player.specialPaddle.photo;
            specialPaddlePhoto.alt = `Pala especial de ${player.name}`;
            specialPaddleItem.classList.remove('hidden'); // Show item
        } else {
            specialPaddleItem.classList.add('hidden'); // Hide item
            specialPaddlePhoto.src = 'images/default_paddle.png'; // Reset src
            specialPaddlePhoto.alt = 'Foto de la pala especial';
        }


        // 4. Make profile visible and trigger transition
        // Needs a slight delay or forced reflow for transition to work after display:none -> display:block
        playerProfileElement.classList.remove('hidden'); // Make it take space

        // Use requestAnimationFrame to apply transition classes in the next frame
        requestAnimationFrame(() => {
             requestAnimationFrame(() => { // Double RAF trick sometimes needed
                playerProfileElement.classList.remove('opacity-0', 'translate-y-5');
                playerProfileElement.classList.add('opacity-100', 'translate-y-0');
             });
        });
    }

    // --- 4. Highlight Selected Player in List ---
    function highlightSelectedPlayer(playerId) {
        const listItems = playerListElement.querySelectorAll('li');
        listItems.forEach(item => {
            // Reset base styles first
            item.className = 'py-2 px-3 mb-2 rounded cursor-pointer transition duration-200 ease-in-out border border-gray-200 font-medium text-gray-700 hover:bg-[#e0f7fa] hover:translate-x-1';

            if (item.dataset.playerId == playerId) {
                // Apply active styles using Tailwind classes
                item.classList.remove('border-gray-200', 'font-medium', 'text-gray-700', 'hover:bg-[#e0f7fa]', 'hover:translate-x-1');
                item.classList.add('font-bold', 'bg-[#00bcd4]', 'text-white', 'border-[#008ba3]');
                 // Optionally remove hover effect when active:
                 item.classList.remove('hover:translate-x-1');
            }
             // Handle potential loading/error classes if needed (reset them if not active)
             if(item.textContent === 'Cargando jugadores...' || item.textContent.includes('Error')){
                 item.className = 'py-2 px-3 mb-2 rounded border border-gray-200 italic text-gray-400 cursor-default';
             }
        });
    }

    // --- 5. Image Modal Logic ---
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = modal.querySelector(".close"); // Find close button inside modal

    function openModal(imgElement) {
        // Only open if the image source is valid and not the default one
        if (imgElement && imgElement.src && !imgElement.src.includes('default_paddle.png') && modal && modalImg) {
             modal.style.display = "block"; // Use style for simple toggle
             modalImg.src = imgElement.src;
             modalImg.alt = imgElement.alt; // Copy alt text
        }
    }

    function closeModal() {
        if (modal) {
            modal.style.display = "none";
        }
    }

    // Add listeners only if elements exist
    if (specialPaddlePhoto) {
        specialPaddlePhoto.addEventListener("click", () => openModal(specialPaddlePhoto));
    }
    // Optional: Make regular paddle photo also open modal
    if (paddlePhoto) {
         paddlePhoto.addEventListener("click", () => openModal(paddlePhoto));
         paddlePhoto.classList.add('cursor-pointer'); // Add pointer if clickable
    }
    // Optional: Make profile photo also open modal
    if (profilePhoto) {
         profilePhoto.addEventListener("click", () => openModal(profilePhoto));
         // profilePhoto already has hover, cursor-pointer could be added if desired
    }


    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (modal) {
        // Close modal when clicking on the background overlay
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        // Close modal with Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }

}); // End of DOMContentLoaded
