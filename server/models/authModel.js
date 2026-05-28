import pool from '../config/db.js';

class authModel {
    // Checks if the email exists in the users table
    static async checkEmailExists (email) {
        const query = 'SELECT id FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        return rows[0];
    }

    // Full registration insertion: Runs a transaction to save everything safely AT ONCE
    static async registerFullUser (userData) {
        const { email, password, name, role, phone, profile_image_url, categoryIds } = userData;
        
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert into 'users' table with all data populated
            const [userResult] = await connection.query(
                'INSERT INTO users (name, email, role, phone, profile_image_url) VALUES (?, ?, ?, ?, ?)',
                [name, email, role, phone || null, profile_image_url || null]
            );
            const userId = userResult.insertId;

            // Insert into 'password' table
            await connection.query(
                'INSERT INTO password (user_id, password) VALUES (?, ?)',
                [userId, password]
            );

            // If professional and has categories, insert into 'professional_categories'
            if (role === 'professional' && Array.isArray(categoryIds) && categoryIds.length > 0) {
                const records = categoryIds.map(categoryId => [userId, categoryId]);
                
                await connection.query(
                    'INSERT INTO professional_categories (user_id, category_id) VALUES ?',
                    [records]
                );
            }

            await connection.commit();
            return userId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Corrected to perform a JOIN with your exact 'password' table name
    static async login (email) {
        const query = `
            SELECT u.id, u.email, u.name, u.role, u.profile_image_url, p.password 
            FROM users u
            JOIN password p ON u.id = p.user_id
            WHERE u.email = ?
        `;
        const [rows] = await pool.query(query, [email]);
        return rows[0];
    }

    // Retrieves user details by ID
    static async findById (id) {
        const query = 'SELECT id, email, name, role, profile_image_url FROM users WHERE id = ?';
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    }
}

export default authModel;