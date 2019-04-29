# LoacPrototypeApp
Prototype, NativeScript

This is the repository for the mobile application of the prototype. The app is a NativeScript Vue application.

# Preview
To preview the app install the NativeScript Playground app and run
`tns preview --bundle`

# Code Structure

```
app/
│
├── app.js                             This is the main file of the app
│
├── App_Resources
│   ├── Android/                       Contains android specific resources
│   └── iOS/                           Contains iOS specific resources
│      
├── app.scss                           Global styles
├── _app-variables.scss                Global style variables
├── _app-common.scss
│
├── components/                        In this folder is all user interface logic
│
├── controllers/                       In this folder is all code which has nothing to
│                                      with the user interface
│
├── fonts/                             Folder for special fonts 
```