<h1 align="center">🧠 Quiz App – Full Stack Web Application</h1>

<p align="center">
  <img src="demo.png" alt="Quiz App Demo" width="700"/>
</p>

<p align="center">
  <b>A full-stack web application built to streamline and digitalize quiz management in educational institutions.</b>
</p>

---

## 🚀 Overview

The **Quiz App** is a full-stack web application designed to simplify and digitalize the quiz management process in colleges and schools.  
It provides an interactive, secure, and user-friendly platform for **faculty** to create and manage quizzes, and for **students** to attempt them in a real exam-like environment with **real-time evaluation**.

---

## 🧩 Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/API-DRF-EF4B3E?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Animations-Framer--Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

---

## 🌟 Features

✅ **Role-based Authentication**
- Admin, Faculty, and Student roles with specific permissions

✅ **Faculty Dashboard**
- Create, update, and delete quizzes with schedule management

✅ **Student Dashboard**
- Attempt quizzes with timer, “mark for review,” “save & next,” and navigation

✅ **Department & Year-based Segregation**
- Faculty can assign quizzes to specific departments (COMP, IT, MECH, etc.)

✅ **Quiz Categorization**
- Automatic division into **Previous**, **Ongoing**, and **Upcoming** quizzes

✅ **Instant Result Generation**
- Real-time result display after submission

✅ **Interactive & Responsive UI**
- Built with **React + TailwindCSS + Framer Motion** for a modern experience

---

## 🧠 Future Enhancements

🚀 **AI-powered Quiz Generation**  
Automatically generate quizzes using AI prompts based on syllabus or topic.

📧 **Email Notifications**  
Send alerts for quiz creation, scheduling, and results.

📊 **Analytics Dashboard**  
Visual insights into student performance and participation.

🏆 **Leaderboard System**  
Encourage competition through department-wise and global leaderboards.

---

## 🧰 Project Setup

Follow the steps below to set up and run the project locally.

---

## 🧩 1️⃣ Clone the Repository

### 🔹 Step 1 — Clone
```bash
git clone https://github.com/<your-username>/quiz-app.git
cd quiz-app
```
---
### ⚙️ 2️⃣ Frontend Setup (React)
📍 Navigate to Frontend
```bash
cd Frontend
```
---

### 📦 Install Dependencies
```bash
npm install
```
---

### 🚀 Run the App
The React app will start at:
📍 http://localhost:5173/
```bash
npm run dev
```

---

### 🐍 3️⃣ Backend Setup (Django + MySQL)
📍 Navigate to Backend
```bash
cd ../Backend
```
---

### 🧰 Create Virtual Environment (Windows)
```bash
python -m venv venv
venv\Scripts\activate
```
> 💡 On macOS/Linux, use:
> ```bash
>python3 -m venv venv
>source venv/bin/activate
> ```
---

### 📦 Install Requirements
```bash
pip install -r requirements.txt

```

---



### 🗄️ Database Setup (MySQL)
⚙️ Step 1 — Create Database in MySQL
```bash
Open MySQL shell or any MySQL client and run:
```sql
CREATE DATABASE quiz_app;
```
---
⚙️ Step 2 — Update settings.py in Backend
In your Backend/core/settings.py, configure your MySQL database like this 👇
(Replace your_username and your_password with your MySQL credentials)
```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'quiz_app',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```
---
### ⚙️ Make Migrations
```bash
python manage.py makemigrations
python manage.py migrate

```
---
### Create Superuser (for Admin Login)
```bash
python manage.py createsuperuser

```
---

### ▶️ Run the Django Server
The backend will run at:
📍 http://127.0.0.1:8000/
```bash
python manage.py runserver

```
---
