
# MyBlogApp on WWMDB branch
- This Project is using Ejs as frontend, ExpressJs as backend and Mongodb as database 

- In this app, users must log in to create, update, or delete posts, otherwise viewing posts is only accessible to everyone. After login, there are createPost, Profile and logout in Navbar. If user is not premium user, only setName is available and user can buy premium (via Stripe). A premium user can upload profile photo and download post as pdf. Additionally, users can change password if they forget and i implements it with nodemailer. 
 
## Deployment

To use this project run on browser (please wait a while, it can delay on some computers)

```bash
  https://myblog-ejsandbackend.onrender.com/
```

or

To run in app
```bash
  nodemon app.js (or) node app.js
```

## Before Login

- Home Page

![1](https://github.com/user-attachments/assets/9ab2c045-c048-424d-8010-911b462a3702)
![2](https://github.com/user-attachments/assets/41fd1df2-7457-4e8b-8372-f0fe646a5486)

- Register Page
  
![3](https://github.com/user-attachments/assets/b31bff5a-c728-4069-b945-31139d61d5ea)

- Login Page
  
![4](https://github.com/user-attachments/assets/649cbb85-252b-42ac-a4b3-ac1fab845a25)

- Reset Password Page (via Forget password button in Login Page)
  
![5](https://github.com/user-attachments/assets/a3332ad0-9f69-45f9-8605-e45f5d85a070)

## After Login

- Home Page
  
![6](https://github.com/user-attachments/assets/44fa1e55-67b2-4dea-923b-2fe7ddf06882)

- Create Post Page
  
![7](https://github.com/user-attachments/assets/155b6acc-e817-462d-9c29-1e3d2b6fa561)

- Profile Page (Premium User)
  
![8](https://github.com/user-attachments/assets/26dad098-3c04-4be8-9b31-fecb59d9a114)

- Set Username Page
  
![9](https://github.com/user-attachments/assets/bf0f3dff-7c63-4761-8e69-15c839497e33)

- Upload Profile Page
  
![10](https://github.com/user-attachments/assets/e530bf69-28da-49a6-9e82-a4d473170844)

- Premium Details Page
  
![12](https://github.com/user-attachments/assets/09c2d3f2-6918-458f-b40e-336f655f92a2)

- Profile Page (Non-premium User)

![11 2](https://github.com/user-attachments/assets/301d16fc-68cc-443d-aac4-a69134332aa4)

- Buy Profile Page
  
![11](https://github.com/user-attachments/assets/80112df9-58c0-46cc-a871-69e4cae314a6)

- Detail Page (only premium user can download post as PDF)
  
![13](https://github.com/user-attachments/assets/3168f043-b77d-4557-a224-ce74670717f0)

![14](https://github.com/user-attachments/assets/025bb651-0eec-4740-90a6-fde7f397880c)

- Update Page

![15](https://github.com/user-attachments/assets/1ad2d56f-63a3-42ce-ab55-64ddeb3466a9)

