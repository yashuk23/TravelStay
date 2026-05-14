// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
    const maxUploadSize = 4 * 1024 * 1024
    const maxImageDimension = 1600
    const compressionFloor = 0.55

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    const fileInputs = document.querySelectorAll('input[type="file"][data-max-file-size]')

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B'

        const units = ['B', 'KB', 'MB', 'GB']
        let size = bytes
        let unitIndex = 0

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex += 1
        }

        return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
    }

    const updateUploadFeedback = (input, message, isError = false) => {
        const feedback = input.parentElement.querySelector('.upload-feedback')

        if (!feedback) return

        feedback.textContent = message
        feedback.classList.toggle('text-danger', isError)
        feedback.classList.toggle('text-success', !isError && message.includes('Compressed'))
    }

    const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Unable to read the selected image.'))
        reader.readAsDataURL(file)
    })

    const loadImage = (src) => new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('Unable to process the selected image.'))
        image.src = src
    })

    const canvasToBlob = (canvas, type, quality) => new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Unable to compress the selected image.'))
                return
            }

            resolve(blob)
        }, type, quality)
    })

    const replaceInputFile = (input, file) => {
        const transfer = new DataTransfer()
        transfer.items.add(file)
        input.files = transfer.files
    }

    const buildCompressedFileName = (originalName, mimeType) => {
        const baseName = originalName.replace(/\.[^.]+$/, '')
        const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png'
        return `${baseName}-compressed.${extension}`
    }

    const compressImage = async (file) => {
        const fileSource = await readFileAsDataUrl(file)
        const image = await loadImage(fileSource)
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) {
            throw new Error('Browser image compression is not supported here.')
        }

        const scale = Math.min(1, maxImageDimension / Math.max(image.width, image.height))
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        const outputType = file.type === 'image/png' ? 'image/jpeg' : (file.type || 'image/jpeg')
        let quality = 0.88
        let compressedBlob = await canvasToBlob(canvas, outputType, quality)

        while (compressedBlob.size > maxUploadSize && quality > compressionFloor) {
            quality -= 0.08
            compressedBlob = await canvasToBlob(canvas, outputType, quality)
        }

        return new File(
            [compressedBlob],
            buildCompressedFileName(file.name, outputType),
            { type: outputType, lastModified: Date.now() }
        )
    }

    const ensureUploadSize = async (input) => {
        const [file] = input.files

        if (!file) {
            input.setCustomValidity('')
            updateUploadFeedback(input, 'Large images will be compressed automatically before upload.')
            return
        }

        if (!file.type.startsWith('image/')) {
            input.value = ''
            input.setCustomValidity('Please select a valid image file.')
            updateUploadFeedback(input, 'Only image files are supported.', true)
            return
        }

        input.setCustomValidity('')
        updateUploadFeedback(input, 'Preparing image for upload...')

        if (file.size <= maxUploadSize) {
            updateUploadFeedback(input, `Selected image size: ${formatBytes(file.size)}.`)
            return
        }

        const compressedFile = await compressImage(file)

        if (compressedFile.size > maxUploadSize) {
            input.value = ''
            input.setCustomValidity('Image is still too large after compression. Please choose a smaller image.')
            updateUploadFeedback(input, 'Image is still above 4 MB after compression. Choose a smaller file.', true)
            return
        }

        replaceInputFile(input, compressedFile)
        input.setCustomValidity('')
        updateUploadFeedback(
            input,
            `Compressed image from ${formatBytes(file.size)} to ${formatBytes(compressedFile.size)}.`
        )
    }

    fileInputs.forEach((input) => {
        input.addEventListener('change', async () => {
            try {
                await ensureUploadSize(input)
            } catch (error) {
                input.value = ''
                input.setCustomValidity(error.message)
                updateUploadFeedback(input, error.message, true)
            }
        })
    })

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async event => {
            if (form.dataset.readyToSubmit === 'true') {
                delete form.dataset.readyToSubmit
                return
            }

            event.preventDefault()
            const fileInput = form.querySelector('input[type="file"][data-max-file-size]')

            if (fileInput && fileInput.files.length > 0) {
                try {
                    await ensureUploadSize(fileInput)
                } catch (error) {
                    fileInput.value = ''
                    fileInput.setCustomValidity(error.message)
                    updateUploadFeedback(fileInput, error.message, true)
                }
            }

            if (!form.checkValidity()) {
                event.stopPropagation()
                form.classList.add('was-validated')
                return
            }

            form.classList.add('was-validated')
            form.dataset.readyToSubmit = 'true'
            form.requestSubmit()
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
