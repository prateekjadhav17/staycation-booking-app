# Staycation Booking App ✈️
### Your Infinite Private Staycation

## Project Overview

**Wanderlust** is a feature-rich, full-stack web application designed to help travelers discover and book unique staycation experiences. It serves as a bridge between hosts listing their properties and travelers seeking their next getaway.

### What problem it solves
Finding unique, local, and private rentals can often be a fragmented experience. Wanderlust consolidates these listings into a user-friendly platform with location visualization, reviews, and easy booking management.

### Who it is for
- **Travelers**: People looking for unique stays, weekend getaways, or local experiences.
- **Hosts**: Property owners wanting to list their spaces (villas, apartments, cabins) for rent.

### Why I built it
I built Wanderlust to master full-stack web development using the **MEN Stack (MongoDB, Express, Node.js)**. This project allowed me to dive deep into backend logic, database relationships, authentication, and integrating third-party APIs like Mapbox and Cloudinary.

---

## Features

This is what makes Wanderlust stand out:

- ** User Authentication & Authorization**: Secure signup and login using `Passport.js`. Users must be logged in to create listings or leave reviews.
- **CRUD Functionality**: Users can Create, Read, Update, and Delete their own listings.
- **Reviews & Ratings**: Users can leave reviews and star ratings for listings they visit.
- **️ Interactive Maps**: Integrated **Mapbox** to display the exact location of each listing on an interactive map.
- ** Image Uploads**: Seamless image uploading and storage using **Cloudinary** and **Multer**.
- ** Flash Messages**: Interactive feedback for success/error messages (e.g., "Listing Created!", "Welcome back!").
- ** Responsive Design**: Built with **Bootstrap 5** to ensure the app looks great on mobiles, tablets, and desktops.
- ** MVC Architecture**: Clean and organized codebase following the Model-View-Controller pattern.

---

## Tech Stack

### Frontend
- **HTML5 & CSS3**
- **Bootstrap 5** (Styling & Layout)
- **EJS** (Embedded JavaScript Templating)
- **Mapbox GL JS** (Maps)

### Backend
- **Node.js** (Runtime Environment)
- **Express.js** (Web Framework)

### Database
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** (ODM)

### Authentication
- **Passport.js** (Local Strategy)
- **Express-Session** (Session Management)

### Tools & Services
- **Cloudinary** (Image Storage)
- **Mapbox SDK** (Geocoding)
- **Render** (Deployment)

---

##  Project Structure

```bash
major_project/
├── controllers/      # Route logic (MVC)
├── init/             # Database initialization scripts
├── models/           # Mongoose schemas (Listing, Review, User)
├── public/           # Static files (CSS, JS, Images)
├── routes/           # Express routes (listings, reviews, users)
├── utils/            # Error handling & wrappers
├── views/            # EJS templates
├── app.js            # Main entry point
├── middleware.js     # Auth & validation middleware
└── .env              # Environment variables (Hidden)
```

---

## Installation

Follow these steps to run the project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/prateekjadhav17/staycation-booking-app.git
    cd staycation-booking-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add the following credentials:
    ```env
    CLOUD_NAME=your_cloudinary_name
    CLOUD_API_KEY=your_cloudinary_api_key
    CLOUD_API_SECRET=your_cloudinary_api_secret
    MAP_TOKEN=your_mapbox_token
    ATLASDB_URL=your_mongodb_connection_string
    SECRET=your_session_secret
    ```

4.  **Run the application**
    ```bash
    node app.js
    ```
    *Or if you have nodemon installed:*
    ```bash
    nodemon app.js
    ```


---

## Future Improvements

- [ ] **Live Website Demo**: currently deployed on **Render**, planning to share a stable public demo link soon.
- [ ] **Search Functionality**: Implement full search filters (by price, location, amenities).
- [ ] **Payment Integration**: Add payment gateway (Stripe/Razorpay) for real bookings.
- [ ] **User Profiles**: Enhanced profiles with booking history.

---