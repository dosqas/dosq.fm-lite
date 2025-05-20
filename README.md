# dosq.fm (lite version) – A Song Listening History Tracker

**Last.fm-inspired song listening history tracker with statistics & insights**  

## Overview  
dosq.fm is a personal project developed as part of the *Systems for Design and Implementation* course (2nd semester, 2nd year). The app provides statistics and insights into your song listening history, helping you track top artists and songs over custom timeframes.

## Tech Stack  
- **Frontend:** Next.js (TypeScript)
- **Backend:** ASP .NET Core
- **ORM:** Entity Framework Core
- **Database:** PostgreSQL  

## Features

### 🎵 Listening Insights

* **Tracks your song listening history**
  * View top artists and songs across custom timeframes
  * Inspired by Last.fm
  * User-specific data with statistics and insights

### 📊 Statistics & Visualizations
* **Dynamic, real-time charts**
  * Asynchronous backend thread generates and pushes new data via WebSockets
  * Charts update in real time with entity changes
    
* **Key statistics highlighted directly in CRUD views**
  * Example: Most recently listened songs which are loaded with visual indicators

### 🔧 Full CRUD Functionality
* **RESTful API** supporting:
  * `POST`, `GET`, `PATCH`, `DELETE`
  * Filtering & sorting on key entities
    
* **Entity relationships**:
  * Includes 1-to-many and many-to-many relationships
  * Uses **Entity Framework** (ORM)
  
* **Populated with >100,000 fake records using Faker**
  * Optimized queries using indexing and pagination
  * Load-tested with **JMeter**

### 🔐 Authentication & Monitoring
* **User registration and login**
  * Secure Bearer Token-based authentication
    
* **Two roles**:
  * **Admin** and **Regular user**
    
* **User activity logging system**
  * Logs every CRUD operation with user context
  * Backend thread detects abnormal behavior and flags users
  * Admin UI displays a list of suspicious users

### 🌐 Deployment & Infrastructure
* **Frontend and backend deployed**
  * Hosted on Railway
  * Automated deployment via Docker Compose
    
* **HTTPS enabled** for secure communication

### 📦 Advanced UX Features
* **Endless scrolling (pagination)**
  * Efficient client-side rendering of large datasets
    
* **Offline support**
  * Detects server/network failures
  * UI clearly shows status
  * Local storage queues actions until server connection is restored
    
### 📤 File Upload Support
* **Large file upload/download capability**
  * Backend supports video uploads via streaming endpoints to showcase the user's favorite concert video
