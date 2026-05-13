// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
    const maxUploadSize = 4 * 1024 * 1024

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    const fileInputs = document.querySelectorAll('input[type="file"][data-max-file-size]')

    fileInputs.forEach((input) => {
        input.addEventListener('change', () => {
            const [file] = input.files

            if (!file) {
                input.setCustomValidity('')
                return
            }

            if (file.size > maxUploadSize) {
                input.value = ''
                input.setCustomValidity('Please upload an image smaller than 4 MB.')
                window.alert('Image is too large for deployment upload limits. Please choose a file under 4 MB.')
                return
            }

            input.setCustomValidity('')
        })
    })

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

const mapElement = document.getElementById('listing-map')

if (mapElement && typeof L !== 'undefined') {
    const mapStatus = document.getElementById('map-status')
    const title = mapElement.dataset.title || 'Listing location'
    const location = mapElement.dataset.location || ''
    const country = mapElement.dataset.country || ''
    const query = [location, country].filter(Boolean).join(', ')

    const updateStatus = (message) => {
        if (mapStatus) {
            mapStatus.textContent = message
        }
    }

    const renderMap = (latitude, longitude) => {
        const map = L.map(mapElement).setView([latitude, longitude], 12)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`<strong>${title}</strong><br>${query}`)
            .openPopup()

        updateStatus(`Showing ${query} on the map.`)
    }

    if (!query) {
        updateStatus('Location details are not available for this listing.')
    } else {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`)
            .then((response) => response.json())
            .then((results) => {
                if (!Array.isArray(results) || results.length === 0) {
                    updateStatus('Map could not find this listing location.')
                    return
                }

                renderMap(Number(results[0].lat), Number(results[0].lon))
            })
            .catch(() => {
                updateStatus('Map is unavailable right now. Please try again.')
            })
    }
}
