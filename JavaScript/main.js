const publicationsContainer = document.getElementById('publicationsContainer');
const searchInput = document.getElementById('searchInput');

// Load all publication JSON files
async function loadPublications() {
    try {
        // Fetch JSON file names dynamically
        const response = await fetch('./../publications/index.json'); // File containing the list of JSON filenames
        const files = await response.json();

        const publications = [];
        for (const file of files) {
            const pubResponse = await fetch(`./../publications/${file}`);
            const publication = await pubResponse.json();
            publications.push(publication);
        }

        // Sort by date (latest first)
        publications.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Generate cards
        renderPublications(publications);

        // Add search functionality
        searchInput.addEventListener('input', () => filterPublications(publications));
    } catch (error) {
        console.error('Error loading publications:', error);
    }
}

// Render publication cards
function renderPublications(publications) {
    publicationsContainer.innerHTML = ''; // Clear previous content
    publications.forEach(pub => {
        const card = document.createElement('div');
        card.classList.add('col-md-6', 'publication');
        card.setAttribute('data-title', pub.title.toLowerCase());
        card.setAttribute('data-description', pub.description.toLowerCase());

        card.innerHTML = `
            <div class="card shadow-sm d-flex flex-row align-items-center" data-aos="fade-up">
                <img src="${pub.image}" class="card-img-left border border-end img-fluid p-3" alt="${pub.title}" style="max-width: 120px; height: 150px;">
                <div class="card-body">
                    <h6 class="card-title">${pub.title}</h6>
                    <p class="card-text">${pub.description}</p>
                    <div class="d-flex justify-content-between">
                        <a href="${pub.readMoreLink}" class="btn btn-link p-0">Read More</a>
                        <p class="text-muted mb-1 pe-1">Published: ${new Date(pub.date).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `;
        publicationsContainer.appendChild(card);
    });
}

// Filter publications based on search input
function filterPublications(publications) {
    const query = searchInput.value.toLowerCase();
    const filtered = publications.filter(pub => 
        pub.title.toLowerCase().includes(query) || 
        pub.description.toLowerCase().includes(query)
    );
    renderPublications(filtered);
}

// Initialize
loadPublications();
