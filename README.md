# 🚀 BuildUp - Full-Stack Professional Networking Platform

**BuildUp** is a dynamic, fully-featured web application designed to connect clients with service professionals. Clients can post job openings, browse rich interactive portfolios, interact via dynamic comment threads, and manage their favorite projects. 

The platform is designed with a clean separation of concerns, robust security practices, database normalization, and high-performance querying.

---

## 🛠️ Key Skills & Technologies Applied

### 💻 Client-Side (Frontend)
* **React & Context API:** Advanced global state management using custom hooks (`useAuth`, `useProjects`) for clean, prop-drilling-free architecture.
* **Component-Driven UI:** Developed reusable, responsive components featuring conditional rendering and fluid user experiences.
* **Axios Interceptors:** Implemented global request/response interceptors to seamlessly manage JWT header injections and session expirations (401/403).
* **Optimistic UI Updates:** Real-time client-side rendering for comments and ratings to ensure zero page refreshes and rapid user feedback.

### ⚙️ Server-Side (Backend)
* **Node.js & Express:** Built a modular MVC REST API backed by secure routing, custom error handling, and robust middleware pipelines.
* **Secure JWT Auth:** Implemented token-based authentication with bcrypt password hashing and granular, role-based access control (`client`, `professional`, `admin`).
* **Multipart File Uploads:** Configured **Multer** middleware to handle complex concurrent image and audio file uploads directly to the disk storage.

### 🗄️ Relational Database (MySQL)
* **Database Normalization:** Designed an efficient, multi-table database schema maintaining strict referential integrity and zero redundancy.
* **Complex SQL & Joins:** Leveraged deep relational queries (`INNER/LEFT JOIN`), grouping aggregates (`GROUP_CONCAT`, `HAVING`), and subqueries to calculate real-time rating averages.
* **Connection Pooling:** Integrated `mysql2/promise` connection pooling to prevent connection leaks and optimize resource cleanup using `finally` blocks.
* **ACID Transactions:** Maintained data consistency using `beginTransaction`, `commit`, and `rollback` operations during multi-table registration workflows.
