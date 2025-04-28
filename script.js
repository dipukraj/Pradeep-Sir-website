document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    const uploadForm = document.getElementById('uploadForm');
    const resourcesContainer = document.getElementById('resourcesContainer');

    // Load existing resources from localStorage
    loadResources();

    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('pdfUpload');
        const titleInput = document.getElementById('pdfTitle');
        
        if (fileInput.files.length === 0) {
            alert('Please select a PDF file');
            return;
        }

        const file = fileInput.files[0];
        const title = titleInput.value.trim();

        if (!title) {
            alert('Please enter a title for the document');
            return;
        }

        // Create a FileReader to read the file
        const reader = new FileReader();
        reader.onload = function(e) {
            // Save the PDF to localStorage
            savePDF(title, e.target.result);
            
            // Clear the form
            fileInput.value = '';
            titleInput.value = '';
            
            // Reload the resources
            loadResources();
        };
        reader.readAsDataURL(file);
    });

    function savePDF(title, data) {
        let resources = JSON.parse(localStorage.getItem('resources') || '[]');
        resources.push({
            title: title,
            data: data,
            date: new Date().toISOString()
        });
        localStorage.setItem('resources', JSON.stringify(resources));
    }

    function loadResources() {
        const resources = JSON.parse(localStorage.getItem('resources') || '[]');
        resourcesContainer.innerHTML = '';

        if (resources.length === 0) {
            resourcesContainer.innerHTML = '<p>No resources available yet.</p>';
            return;
        }

        resources.forEach((resource, index) => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            
            card.innerHTML = `
                <h3>${resource.title}</h3>
                <p>Uploaded: ${new Date(resource.date).toLocaleDateString()}</p>
                <button onclick="downloadPDF(${index})" class="download-btn">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            `;
            
            resourcesContainer.appendChild(card);
        });
    }

    window.downloadPDF = function(index) {
        const resources = JSON.parse(localStorage.getItem('resources') || '[]');
        const resource = resources[index];
        
        // Create a link element
        const link = document.createElement('a');
        link.href = resource.data;
        link.download = `${resource.title}.pdf`;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Gallery functionality
    const galleryGrid = document.querySelector('.gallery-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const galleryUploadForm = document.getElementById('galleryUploadForm');
    let currentPage = 1;
    const imagesPerPage = 12;
    let allImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');

    // Load initial images
    if (allImages.length > 0) {
        loadImages();
    }

    // Handle image upload
    galleryUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('imageUpload');
        const files = fileInput.files;

        if (files.length === 0) {
            alert('Please select at least one image');
            return;
        }

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                allImages.push(e.target.result);
                localStorage.setItem('galleryImages', JSON.stringify(allImages));
                
                // Clear the grid and reload images
                galleryGrid.innerHTML = '';
                currentPage = 1;
                loadImages();
            };
            reader.readAsDataURL(file);
        });

        // Reset the form
        fileInput.value = '';
    });

    function loadImages() {
        const start = (currentPage - 1) * imagesPerPage;
        const end = start + imagesPerPage;
        const imagesToLoad = allImages.slice(start, end);

        imagesToLoad.forEach(imageData => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${imageData}" alt="Gallery Image">`;
            galleryGrid.appendChild(galleryItem);
        });

        // Show/hide load more button
        if (end >= allImages.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        loadImages();
    });
}); 