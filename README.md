# Petconnect

**Access SustainablEats:** [Website Link](https://petconnect-is216.onrender.com/)  

## Table of Contents
- [Group Members](#group-members)
- [Important Notes](#important-notes)
- [Project Overview](#project-overview)
  - [Features](#features)
- [Installation Guide](#installation-guide)
  - [Project Setup](#project-setup)
  - [Local Setup](#local-setup)
  - [Google Firebase Setup](#google-firebase-setup)
  - [Online Hosting](#online-hosting)
  - [Dependencies & Libraries Installation](#dependencies--libraries-installation)
- [Test-Users Account](#test-users-account)

---

### Group Members
| Name                  | Student ID | Email                               |
|-----------------------|------------|-------------------------------------|
| Kee Er Cong     | 01445410   | ercong.kee.2023@scis.smu.edu.sg     |
| Koh Choon Kiat   | 01483384   | ck.koh.2023@scis.smu.edu.sg    |
| Sim Yingyi Tabitha   | 01489282   | tabitha.sim.2023@scis.smu.edu.sg    |
| Ng Hui Ting   | 01481249   | huiting.ng.2023@scis.smu.edu.sg    |


---

### Important Notes
- **Image Upload Limitation:** Users must upload images manually for recipe generation due to API constraints.
- **Bandwidth Limitations:** Limited bandwidth on the free Firebase plan may result in image loading delays. Please allow up to 24 hours for bandwidth reset.

---

### Project Overview
Problem statement: Pet owners often struggle to find opportunities for their pets to interact with others, especially for new pet owners who have not found a community. In Singapore, where pet ownership is rising, the limited pet-friendly spaces and events leave both pets and owners feeling isolated. Without regular socialisation, pets are prone to anxiety and behavioural issues, adding stress for owners. By fostering a community for both pets and their owners, we can ease this isolation and help pets thrive through connection.

Solution: Pet Connect aims to help owners find events, organise playdates and connect with others in their community, ensuring their pets stay active, engaged and socially fulfilled!

#### Features
- **Petpost:** A dynamic homepage featuring a feed of pet-related posts from all users, creating a vibrant hub for pet lovers to connect and share.
- **Events:** A dedicated page showcasing both large-scale and casual events, helping users discover and participate in community gatherings or small meet-ups.
- **Calendar:** A personalized calendar that tracks events users have signed up for, helping them stay organized and never miss an occasion.
- **Friends:** A streamlined page for managing friendships, where users can view friend requests, keep track of their friends, and receive tailored friend suggestions.
- **Profile:** A comprehensive profile page summarizing all user activities, including personal posts, joined or created events, and a showcase of their pets.
- **Chats:** A real-time chat feature that allows users to connect and share content, such as posts or events, directly with friends for a more interactive experience.

---

### Installation Guide

#### Project Setup
1. **Install Node.js**: [Download here](http://node.js.org/en).
2. **Install Vue CLI**:
   - After installing Node.js, install Vue CLI by running:
     ```bash
     npm install -g @vue/cli
     ```

#### Local Setup
1. **Clone Repository**:
   - Run:
     ```bash
     git clone [https://github.com/shareeep/fishmuggers-is216.git]
     ```
2. **Frontend setup**:
   - Navigate to the project directory and cd into the frontend directory and install dependencies:
     ```bash
    cd frontend
    npm install
     ```
3. **Frontend environment setup**:
   - Place the .env file in the frontend folder (request from @binkicentre or @cityboykiki from telegram)
   Frontend .env should consist of firebase private keys, google maps private keys and the backend url
4. **Start the Development Server**:
   - Run the following command to serve the frontend application:
     ```bash
    npm run dev
     ```
5. **Backend setup**:
   - Navigate to the project directory and cd into the backend directory and install dependencies:
     ```bash
    cd frontend
    npm install
     ```
6. **Backend environment setup**:
   - Place the .env file in the backend folder (request from @binkicentre or @cityboykiki from telegram)
   Backend .env should consist of firebase serviceaccountkey and firebase project ID 
7. **Start the Backend Server**:
    - Start the backend server using node app.js:
    ```bash
    node app.js
     ```
    
