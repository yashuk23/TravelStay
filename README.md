# TravelStay 🌍🏡

TravelStay is a full-stack Airbnb-style property listing web application where users can create travel stay listings, upload property images, add reviews/comments, and explore locations through interactive maps.

## Features

* Create, edit, and delete property listings
* Upload images using Cloudinary
* Interactive maps with Leaflet
* Add reviews and comments
* Responsive UI using EJS templates
* RESTful routing and MVC architecture
* MongoDB database integration

## Tech Stack

* Frontend: EJS, HTML, CSS, JavaScript
* Backend: Node.js, Express.js
* Database: MongoDB
* Image Storage: Cloudinary
* Maps: Leaflet

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/travelstay.git
```

### 2. Navigate to the project directory

```bash
cd travelstay
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_map_token
DB_URL=your_mongodb_connection_url
SECRET=your_secret_key
```

### 5. Run the application

```bash
node app.js
```

or

```bash
npm start
```

### 6. Open in browser

```bash
http://localhost:3000
```

## Folder Structure

```bash
├── models
├── routes
├── controllers
├── views
├── public
├── utils
├── app.js
└── package.json
```

## Future Enhancements

* User authentication
* Booking system
* Search and filters
* Wishlist feature
* Payment gateway integration

