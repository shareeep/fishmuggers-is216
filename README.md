
# PetConnect

![Project Logo](/frontend//src/assets/images/logo.png)

**Access PetConnect:** [Website Link](https://petconnect-is216.onrender.com/) 


## Table of Contents
- [Group Members](#group-members)
- [Project Overview](#project-overview)
  - [Features](#features)
- [Installation Guide](#installation-guide)
  - [Project Setup](#project-setup)
  - [Local Setup](#local-setup)
  - [Cloud Deployment Guide](#cloud-deployment-guide)
- [Test-Users Account](#test-users-account)

---

### Group Members
| Name                  | Student ID | Email                               |
|-----------------------|------------|-------------------------------------|
| Kee Er Cong     | 01445410   | ercong.kee.2023@scis.smu.edu.sg     |
| Koh Choon Kiat   | 01483384   | ck.koh.2023@scis.smu.edu.sg    |
| Sim Yingyi Tabitha   | 01489282   | tabitha.sim.2023@scis.smu.edu.sg    |
| Ng Hui Ting   | 01481249   | huiting.ng.2023@scis.smu.edu.sg    |
| Axel Teo Pin Bo   | 01413416   | pinbo.teo.2022@scis.smu.edu.sg    |
| Muhammad Shariff Bin Abdul Rashid   | 01443150   | shariffar.2023@scis.smu.edu.sg    |



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
   - Copy the .env.example to a .env file in the root of the frontend folder (request for the values from @binkicentre or @cityboykiki from telegram)
   Frontend .env should consist of firebase private keys, google maps private keys and the backend url
4. **Start the Development Server**:
   - Run the following command to serve the frontend application:
        ```bash
        npm run dev
        ```
5. **Backend setup**:
   - Navigate to the project directory and cd into the backend directory and install dependencies:
        ```bash
        cd backend
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



### Cloud Deployment Guide

#### Prerequisites
1. **Render Account**: Make sure you have a render account set up [https://render.com/]

2. **Repository Access**:
   - Clone the repository to your local device if you haven’t already:
     ```bash
     git clone https://github.com/shareeep/fishmuggers-is216.git
     ```

#### Deployment Setup

1. **Deploy the Backend as a Web Service on Render**:
  - Go to your Render dashboard and select **New + > Web Service**.
  - Connect the service to your repository set the **Root Directory** as 'backend'.
  - Configure the environment:
    -   **Build Command**: `npm install`
    -   **Start Command**: `node app.js`
- Add your environment variables (reference the backend `.env.example` file, populated with values - request for the values from @binkicentre or @cityboykiki from telegram) in the **Environment Variables** section on Render.

- Deploy the backend and note the URL, which you’ll need for the frontend setup.

2. **Deploy the Frontend as a Static Site on Render**:
  - In your Render dashboard, select **New + > Static Site**.

-   Connect the service to your repository and select the frontend folder for deployment.

-   Configure the environment:
    -   **Build Command**: `npm install && npm run build`
    -   **Publish Directory**: `dist`

-   Add the environment variables needed for the frontend referencing what is in the `.env.example` file (including the backend URL from the previous step).

-   In the **Redirect and Rewrite Rules** section, add the following rule:
    -   **Source**: `/*`
    -   **Destination**: `/index.html`
    -   **Action**: `Rewrite`

5. **Verify Deployment**:
-   Once both services are deployed, verify that the backend API is accessible and that the frontend is able to communicate with it.

-   Test key features to confirm that everything is functioning correctly.


### Test-Users Account
| User  | Email            | Password    |
|-------|---------------------|-------------|
| User 1| shariff@events.com     | shariff@events.com    |
| User 2| tabithasim@gmail.com      | 1234567    |
| User 3| mason@jar.com      | mason@jar.com    |