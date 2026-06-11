import pool from '../config/db.js';

class profileModel {

    // Get all professionals with category names, review rating averages, and dynamic filters
    static async getAllProfessionals (filters = {}) {
        const { category_id, search, city, sortBy } = filters;
        
        let query = `
            SELECT 
                u.id, u.name, u.email, u.phone, u.profile_image_url, u.created_at,
                pp.tagline, pp.bio, pp.city,
                GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS category_name,
                IFNULL(AVG(pr.rating), 0) AS average_rating
            FROM users u
            INNER JOIN professional_profiles pp ON u.id = pp.user_id
            LEFT JOIN professional_categories pc ON u.id = pc.user_id
            LEFT JOIN categories c ON pc.category_id = c.id
            LEFT JOIN professional_reviews pr ON u.id = pr.professional_id
            WHERE u.role = 'professional'
        `;
        const queryParams = [];

        // 1. Apply city filter inside WHERE clause (Before GROUP BY)
        if (city) {
            query += ` AND pp.city = ?`;
            queryParams.push(city);
        }

        // 2. Apply text search filter inside WHERE clause (Before GROUP BY)
        if (search) {
            query += ` AND u.name LIKE ?`;
            queryParams.push(`%${search}%`);
        }

        // 3. Group records after filtering to allow aggregation calculations
        query += ` GROUP BY u.id, pp.tagline, pp.bio, pp.city`;

        // 4. Apply category filter using HAVING after grouping
        if (category_id) {
            query += ` HAVING u.id IN (SELECT user_id FROM professional_categories WHERE category_id = ?)`;
            queryParams.push(category_id);
        }

        // 5. Apply sorting preference dynamically based on dashboard component triggers
        if (sortBy === 'newest') {
            query += ` ORDER BY u.created_at DESC`;
        } else if (sortBy === 'popular') {
            query += ` ORDER BY average_rating DESC`;
        } else {
            query += ` ORDER BY u.name ASC`;
        }

        const [rows] = await pool.query(query, queryParams);
        return rows;
    };

    static async getProfileById (id) {
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) return null;
        
        const user = users[0];

        // אם הוא מקצועי, נשלים את החסר (טג-ליין, עיר, ביו, וקטגוריות)
        if (user.role === 'professional' || user.role === 'admin') {
            // פרטים בסיסיים מהפרופיל
            const [profiles] = await pool.query('SELECT tagline, bio, city FROM professional_profiles WHERE user_id = ?', [id]);
            // קטגוריות
            const [categories] = await pool.query('SELECT category_id FROM professional_categories WHERE user_id = ?', [id]);
            
            return {
                ...user,
                ...(profiles[0] || {}),
                category_ids: categories.map(c => c.category_id)
            };
        }

        // אם הוא לא מקצועי, נחזיר פשוט את המשתמש כפי שהוא
        return user;
    }

    static async updateProfile(id, payload) {
        // 1. נשלוף את המצב הנוכחי מה-DB כדי לדעת מה ה-Role הנוכחי
        const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
        if (users.length === 0) throw new Error("User not found");
        
        const currentRole = users[0].role;
        const newRole = payload.role || currentRole; // אם הריאקט שלח role חדש, נשתמש בו

        // 2. עדכון טבלת משתמשים (שם, טלפון, תמונה, ועדכון ה-Role)
        await pool.query(
            `UPDATE users SET name = ?, phone = ?, profile_image_url = ?, role = ? WHERE id = ?`,
            [payload.name, payload.phone, payload.profile_image_url, newRole, id]
        );

        // 3. לוגיקה למקצוענים (אם הוא היה מקצועי או הפך לכזה)
        if (newRole === 'professional' || newRole === 'admin') {
            
            // עדכון/הוספה לטבלת הפרופיל המקצועי
            await pool.query(
                `INSERT INTO professional_profiles (user_id, tagline, bio, city) 
                VALUES (?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE tagline = VALUES(tagline), bio = VALUES(bio), city = VALUES(city)`,
                [id, payload.tagline, payload.bio, payload.city]
            );

            // עדכון קטגוריות
            await pool.query('DELETE FROM professional_categories WHERE user_id = ?', [id]);
            
            if (payload.category_ids && Array.isArray(payload.category_ids)) {
                for (const catId of payload.category_ids) {
                    await pool.query(
                        'INSERT INTO professional_categories (user_id, category_id) VALUES (?, ?)',
                        [id, catId]
                    );
                }
            }
        }

        return await this.getProfileById(id);
    }

}

export default profileModel;











// import pool from '../config/db.js';

// const professionalModel = {

//     // Get all professionals with category names, review rating averages, and dynamic filters
//     getAllProfessionals: async (filters = {}) => {
//         const { category_id, search, city, sortBy } = filters;
        
//         let query = `
//             SELECT 
//                 u.id, u.name, u.email, u.phone, u.profile_image_url, u.created_at,
//                 pp.tagline, pp.bio, pp.city,
//                 GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS category_name,
//                 IFNULL(AVG(pr.rating), 0) AS average_rating
//             FROM users u
//             INNER JOIN professional_profiles pp ON u.id = pp.user_id
//             LEFT JOIN professional_categories pc ON u.id = pc.user_id
//             LEFT JOIN categories c ON pc.category_id = c.id
//             LEFT JOIN professional_reviews pr ON u.id = pr.professional_id
//             WHERE u.role = 'professional'
//         `;
//         const queryParams = [];

//         // 1. Apply city filter inside WHERE clause (Before GROUP BY)
//         if (city) {
//             query += ` AND pp.city = ?`;
//             queryParams.push(city);
//         }

//         // 2. Apply text search filter inside WHERE clause (Before GROUP BY)
//         if (search) {
//             query += ` AND u.name LIKE ?`;
//             queryParams.push(`%${search}%`);
//         }

//         // 3. Group records after filtering to allow aggregation calculations
//         query += ` GROUP BY u.id, pp.tagline, pp.bio, pp.city`;

//         // 4. Apply category filter using HAVING after grouping
//         if (category_id) {
//             query += ` HAVING u.id IN (SELECT user_id FROM professional_categories WHERE category_id = ?)`;
//             queryParams.push(category_id);
//         }

//         // 5. Apply sorting preference dynamically based on dashboard component triggers
//         if (sortBy === 'newest') {
//             query += ` ORDER BY u.created_at DESC`;
//         } else if (sortBy === 'popular') {
//             query += ` ORDER BY average_rating DESC`;
//         } else {
//             query += ` ORDER BY u.name ASC`;
//         }

//         const [rows] = await pool.query(query, queryParams);
//         return rows;
//     },

//     // Get complete profile data for a specific professional including category name and score average
//     getProfessionalById: async (id) => {
//         const query = `
//             SELECT 
//                 u.id, u.name, u.email, u.phone, u.profile_image_url, u.created_at,
//                 pp.tagline, pp.bio, pp.city,
//                 GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS category_name,
//                 IFNULL(AVG(pr.rating), 0) AS average_rating
//             FROM users u
//             INNER JOIN professional_profiles pp ON u.id = pp.user_id
//             LEFT JOIN professional_categories pc ON u.id = pc.user_id
//             LEFT JOIN categories c ON pc.category_id = c.id
//             LEFT JOIN professional_reviews pr ON u.id = pr.professional_id
//             WHERE u.id = ? AND u.role = 'professional'
//             GROUP BY u.id, pp.tagline, pp.bio, pp.city
//         `;
//         const [rows] = await pool.query(query, [id]);
//         return rows[0] || null;
//     },


//     updateProfessionalProfile: async (id, updateFields) => {
//         const userAllowed = ['name', 'phone', 'profile_image_url'];
//         const profileAllowed = ['tagline', 'bio', 'city'];

//         const userUpdates = {};
//         const profileUpdates = {};

//         Object.keys(updateFields).forEach(key => {
//             if (updateFields[key] !== undefined) {
//                 if (userAllowed.includes(key)) userUpdates[key] = updateFields[key];
//                 if (profileAllowed.includes(key)) profileUpdates[key] = updateFields[key];
//             }
//         });

//         const userKeys = Object.keys(userUpdates);
//         if (userKeys.length > 0) {
//             const fields = userKeys.map(k => `${k} = ?`).join(', ');
//             const params = [...userKeys.map(k => userUpdates[k]), id];
//             await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, params);
//         }

//         const profileKeys = Object.keys(profileUpdates);
//         if (profileKeys.length > 0) {
//             const fields = profileKeys.map(k => `${k} = ?`).join(', ');
//             const params = [...profileKeys.map(k => profileUpdates[k]), id];
//             await pool.query(`UPDATE professional_profiles SET ${fields} WHERE user_id = ?`, params);
//         }

//         if (updateFields.category_name !== undefined) {
//             await pool.query(`DELETE FROM professional_categories WHERE user_id = ?`, [id]);

//             if (updateFields.category_name && updateFields.category_name.trim() !== '') {
//                 const categoryMapping = {
//                     "architecture": 1,
//                     "interior design": 2,
//                     "construction": 3,
//                     "renovation": 4,
//                     "tiling & wall": 5,
//                     "kitchens": 6,
//                     "custom carpentry": 7,
//                     "systems & utilities": 8,
//                     "gardening & landscaping": 9
//                 };

//                 const chosenCategoryNames = updateFields.category_name.split(', ').map(c => c.toLowerCase().trim());
                
//                 for (const catName of chosenCategoryNames) {
//                     const catId = categoryMapping[catName];
//                     if (catId) {
//                         await pool.query(
//                             `INSERT INTO professional_categories (user_id, category_id) VALUES (?, ?)`,
//                             [id, catId]
//                         );
//                     }
//                 }
//             }
//         }

//         return true;
//     }
// };

// export default professionalModel;






// import pool from '../config/db.js';

// const professionalModel = {

//     // Get all professionals with category names and dynamic filters
//     getAllProfessionals: async (filters = {}) => {
//         const { category_id, search, city, sortBy } = filters;
        
//         let query = `
//             SELECT 
//                 u.id, u.name, u.email, u.phone, u.profile_image_url, u.created_at,
//                 pp.tagline, pp.bio, pp.city,
//                 GROUP_CONCAT(c.name SEPARATOR ', ') AS category_name
//             FROM users u
//             INNER JOIN professional_profiles pp ON u.id = pp.user_id
//             LEFT JOIN professional_categories pc ON u.id = pc.user_id
//             LEFT JOIN categories c ON pc.category_id = c.id
//             WHERE u.role = 'professional'
//         `;
//         const queryParams = [];

//         // 1. Apply city filter inside WHERE clause (Before GROUP BY)
//         if (city) {
//             query += ` AND pp.city = ?`;
//             queryParams.push(city);
//         }

//         // 2. Apply text search filter inside WHERE clause (Before GROUP BY)
//         if (search) {
//             query += ` AND u.name LIKE ?`;
//             queryParams.push(`%${search}%`);
//         }

//         // 3. Group records after filtering
//         query += ` GROUP BY u.id, pp.tagline, pp.bio, pp.city`;

//         // 4. Apply category filter using HAVING after grouping
//         if (category_id) {
//             query += ` HAVING u.id IN (SELECT user_id FROM professional_categories WHERE category_id = ?)`;
//             queryParams.push(category_id);
//         }

//         // 5. Apply sorting preference
//         if (sortBy === 'newest') {
//             query += ` ORDER BY u.created_at DESC`;
//         } else {
//             query += ` ORDER BY u.name ASC`;
//         }

//         const [rows] = await pool.query(query, queryParams);
//         return rows;
//     },

//     // Get complete profile data for a specific professional including category name
//     getProfessionalById: async (id) => {
//         const query = `
//             SELECT 
//                 u.id, u.name, u.email, u.phone, u.profile_image_url, u.created_at,
//                 pp.tagline, pp.bio, pp.city,
//                 GROUP_CONCAT(c.name SEPARATOR ', ') AS category_name
//             FROM users u
//             INNER JOIN professional_profiles pp ON u.id = pp.user_id
//             LEFT JOIN professional_categories pc ON u.id = pc.user_id
//             LEFT JOIN categories c ON pc.category_id = c.id
//             WHERE u.id = ? AND u.role = 'professional'
//             GROUP BY u.id, pp.tagline, pp.bio, pp.city
//         `;
//         const [rows] = await pool.query(query, [id]);
//         return rows[0] || null;
//     },

//     // Dynamically update professional profile fields across tables
//     updateProfessionalProfile: async (id, updateFields) => {
//         const userAllowed = ['name', 'phone', 'profile_image_url'];
//         const profileAllowed = ['tagline', 'bio', 'city'];

//         const userUpdates = {};
//         const profileUpdates = {};

//         Object.keys(updateFields).forEach(key => {
//             if (updateFields[key] !== undefined) {
//                 if (userAllowed.includes(key)) userUpdates[key] = updateFields[key];
//                 if (profileAllowed.includes(key)) profileUpdates[key] = updateFields[key];
//             }
//         });

//         const userKeys = Object.keys(userUpdates);
//         if (userKeys.length > 0) {
//             const fields = userKeys.map(k => `${k} = ?`).join(', ');
//             const params = [...userKeys.map(k => userUpdates[k]), id];
//             await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, params);
//         }

//         const profileKeys = Object.keys(profileUpdates);
//         if (profileKeys.length > 0) {
//             const fields = profileKeys.map(k => `${k} = ?`).join(', ');
//             const params = [...profileKeys.map(k => profileUpdates[k]), id];
//             await pool.query(`UPDATE professional_profiles SET ${fields} WHERE user_id = ?`, params);
//         }

//         return true;
//     }
// };

// export default professionalModel;

