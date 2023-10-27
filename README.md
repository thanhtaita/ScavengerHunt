Tai Ta

# Geo Scavenger Hunt: https://scavenger-hunt-rust.vercel.app/

# Member information

Tai Ta - nta3@uic.edu , Ali Saeed - asaee2@uic.edu, Hemalatha Ningappa kondakundi - hning4@uic.edu, Vishaal Karthik Muralidharan - vmural9@uic.edu

# To run the project

1. Direct to server folder `cd standard-auth/server`, then install packages `npm i`
2. Run `npm start` to run the server
3. Direct to the client folder from the root `cd client`, then install package `npm i`
4. Run `npm run dev` to run the client

# Github link

https://github.com/thanhtaita/ScavengerHunt

## What does your application do?

Present "Scavenger Hunt Adventure," a web application crafted to bring the excitement of scavenger hunts into the digital realm. Our mission is to offer users an immersive and interactive experience suitable for individuals, families, and groups of all sizes. In general, our web app serves as your premier destination for crafting and engaging in captivating scavenger hunts.

## What makes it different than a CRUD app? I.e., what functionality does it provide that is not just a user interface layer on top of a database of user information, and the ability to view / add to / change that information?

A scavenger hunt web application differs from a typical CRUD (Create, Read, Update, Delete) application in several ways, as it introduces specific gameplay and interaction elements that go beyond basic data management. It creates dynamic scavenger hunts with unique challenges and real-time interaction. Besides that, there are two different modes for administrators and players. Administrators can craft tasks and riddles, extending beyond typical data management. The game utilizes GPS for location-based challenges and tracks the players’ locations. It creates the whole user experience with gamification (time constraints, rules, grouping), storytelling, and multimedia content.

## What security and privacy concerns do you expect you (as developers) or your users to have with this application?

1. Authentication and Authorization:
   Implement a robust user authentication system to ensure that only authorized users can access and participate in the scavenger hunt.
   Use role-based access control (RBAC) to manage permissions for different user roles, such as administrators and participants.
2. Data Encryption:
   Encrypt sensitive data, such as user passwords and personal information, using strong encryption algorithms.
   Use HTTPS to secure data in transit between the user's browser and your web server.
3. Input Validation:
   Validate all user inputs on the server-side to prevent SQL injection, cross-site scripting (XSS), and other common vulnerabilities.
   Sanitize and validate inputs on the client-side as well to provide a better user experience.
4. Secure File Uploads:
   If your scavenger hunt includes image uploads or file submissions, ensure that uploaded files are properly validated, scanned for malware, and stored in a secure location.
5. Session Management:
   Implement secure session management to protect against session fixation and session hijacking attacks.
   Use techniques like session timeouts and secure cookies.
6. API Security:
   The app includes APIs. Secure them with authentication mechanisms like API keys or OAuth, and implement rate limiting to prevent abuse.
7. Database Security:
   Use parameterized queries or an ORM (Object-Relational Mapping) to interact with the database to prevent SQL injection.
   Apply the principle of least privilege when configuring database access.
8. Error Handling:
   Implement proper error handling to avoid exposing sensitive information in error messages to users.
   Log errors securely for debugging purposes.
