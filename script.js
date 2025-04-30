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

    // Resources functionality
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

    // Subject Expertise Toggle Function
    const headerToggle = document.querySelector('.header-toggle');
    const expertiseContent = document.getElementById('expertiseContent');
    const toggleIcon = document.getElementById('toggleIcon');

    headerToggle.addEventListener('click', () => {
        expertiseContent.classList.toggle('open');
        toggleIcon.classList.toggle('rotate');
        
        if (expertiseContent.classList.contains('open')) {
            toggleIcon.innerHTML = '▲';
            loadExpertise(); // Load expertise data when opening
        } else {
            toggleIcon.innerHTML = '▼';
        }
    });

    // Load expertise data
    function loadExpertise() {
        const expertiseData = JSON.parse(localStorage.getItem('expertiseData') || '[]');
        const expertiseContent = document.getElementById('expertiseContent');
        
        if (expertiseData.length > 0) {
            expertiseContent.innerHTML = expertiseData.map((item, index) => `
                <div class="expertise-box" data-index="${index}">
                    <input type="text" class="expertise-title" value="${item.title}" placeholder="Enter subject name">
                    <textarea class="expertise-description" placeholder="Enter subject description">${item.description}</textarea>
                </div>
            `).join('');
        } else {
            expertiseContent.innerHTML = Array(5).fill().map((_, index) => `
                <div class="expertise-box" data-index="${index}">
                    <input type="text" class="expertise-title" placeholder="Enter subject name">
                    <textarea class="expertise-description" placeholder="Enter subject description"></textarea>
                </div>
            `).join('');
        }
    }

    // Save expertise data
    function saveExpertise() {
        const expertiseBoxes = document.querySelectorAll('.expertise-box');
        const expertiseData = Array.from(expertiseBoxes).map(box => ({
            title: box.querySelector('.expertise-title').value,
            description: box.querySelector('.expertise-description').value
        }));
        
        localStorage.setItem('expertiseData', JSON.stringify(expertiseData));
        alert('Subject expertise saved successfully!');
    }

    // Add save button
    const saveButton = document.createElement('button');
    saveButton.className = 'save-expertise-btn';
    saveButton.textContent = 'Save Changes';
    saveButton.onclick = saveExpertise;
    document.querySelector('.subject-expertise').appendChild(saveButton);

    function toggleExpertise() {
        const content = document.querySelector('.expertise-content');
        const icon = document.querySelector('.toggle-icon');
        
        content.classList.toggle('open');
        icon.classList.toggle('rotate');
        
        if (content.classList.contains('open')) {
            icon.innerHTML = '▲';
        } else {
            icon.innerHTML = '▼';
        }
    }
}); 




 