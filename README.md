#CourseCare

Application is live at https://coursecare.ml

For testing you can create an account or use the provided credentials --

For tutor --
ranita@gmail.com 
username - ranita
password - 1234567890

For student --
Student 1
harsh@gmail.com
username - harshjn
password - 1234567890

Student 2
ssubrat@gmail.com
username - ssubrat
password - 1234567890


## Inspiration

Recently my college has started using online platforms like techtud.com for some courses. It is platform where students can post their query and get answers from the instructor.  Or the instructor can post some article or course related material whenever they want. But it is more or less a discussion forum. 
It is would have been better if the platform provided some real-time collaboration like video lecture, chats etc. So, this is what CourseCare is about.

## Flow

On visiting the main page of CourseCare, one has to choose to continue as a student or tutor.
Then signup or login as that role and users will be redirected to their respective profiles.

### Instructor 
- Can create courses
- Then distribute the password of the course to students.
- Go to the dashboard for the course.
- Broadcast lectures
- Use whiteboard for exampling problems 
- Solve doubts  by Chat with students

### Students
- Search Courses
- Register for Course
- Attend real-time lectures
- Chat with the instructor and Fellow classmates


## Features

Whiteboard -- a blackboard white in color where the instructor can explain some problem or use it for lectures.

Real-time Video lecture -- Instructor and students can have interactive lessons with the comfort of their home. 

Chat -- user to user chat with a course room.

Discussion -- basic template is ready only backend connection is left coming soon.

## Instruction To Run

- copy config.sample.json to config.json in src/config folder and provide the database credentails
- copy .env.sample file in root folder to .env
- provide facebook and google api keys, also generate the mitter and agora api keys
- provide the website url
- npm install
- generate web compatible mitter-io package by using browserify
- `browserify mitter-cdn.js -o bundle.js && mv bundle.js public/bower_components`
- enjoy :) !!

## Todos:
- [x] double course registration halts the server

