# Four-Bytes
<p align="center">
  <img src="images/naslovna.png" alt="Traditional Cousine Logo" width="230"/>
</p>

<h1 align="center">Traditional Cuisine 



## Project Description

This project is a fullstack web application dedicated to traditional cuisine.  
Its goal is to present authentic dishes through a clean, responsive, and user friendly interface.

Visitors can browse and search recipes, while registered users gain access to additional features such as favorites, reviews, ratings, and personal notes. Administrators have full control over recipe management.

##  Features

###  1. Guest User (Not Logged In)
- Browse all recipes  
- Search recipes by ingredients  
- See a welcome screen upon entering the website  

###  2. Registered User 
In addition to guest features, registered users can:  
- Add recipes to **Favorites**  
- Leave **public reviews and ratings**  
- Write **private notes/reminders** under any recipe  
- Use ingredient-based search  

###  3. Administrator
Admins can fully manage recipe content:  
- Add new recipes  
- Edit existing recipes  
- Delete recipes  
- Moderate content if needed  
- Delete comments

##  Technologies

### **Frontend**
- React 
- HTML, CSS, JavaScript  
- Axios for API communication  

### Backend
- Node.js + Express  
- REST API  
- JWT authentication  

### Database
- MongoDB   

### Routes
- "/"
- "home:userId" - home page route
- "bookmarks:useirId?userRole"
- "recipe:recipeId?userRole"
- "recipe/edit:recipeId"
- "recipe/delete:recipeId"
- "recipe/create:recipeId"
- "signUp"
- "signIn"
- "signOut"

## Project Structure**

<br>├──frontend/
<br>| ├── src/
<br>│ │ ├── components/
<br>│ │ ├── pages/
<br>│ │ └── services/
<br>│ └── App.js

<br>├── backend/
<br>││ ├── controllers/
<br>││ ├── models/
<br>││ ├── routes/
<br>││ └── server.js
<br>└── database/

## Recipe Search

Users can type one or more ingredients into the search bar.  
The backend returns all recipes that contain the given ingredients.

## Favorites System

Registered users can:  
- Add recipes to **Favorites**  
- View all saved favorites on a dedicated page  

##  Notes / Reminders (Private)

Each registered user can write private notes under any recipe, such as:  
- “Use less salt next time”  
- “Try this for the birthday dinner”  

Notes are **visible only to the user** who created them.

##  Development Plan

1. Wireframe and UI design  
2. Frontend setup  
3. Backend API implementation  
4. User authentication  
5. Recipe CRUD functionality  
6. Favorites, reviews, and notes  
7. Testing  
8. Final optimization and presentation  

---

## Project Authors

- **Rajna**  
- **Andrijana**  
- **Marko**  
- **Vasilije**

---

### ERD

![ERD](<images/ERD.png>)

### Home Page

![Home Page](<images/Home Page.png>)

### Bookmarks Page
![Bookmarks Page](<images/Bookmarks Page.png>)

### Recipes Page

![Recipes Page](<images/Recipes Page.png>)