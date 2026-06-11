// export const validateProfileUpdate = (req, res, next) => {
//     const { name, phone, category_id } = req.body;

//     if (!name || !phone || !category_id) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation failed: name, phone, and category_id are mandatory fields."
//         });
//     }

//     if (phone.length < 9) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation failed: Provided phone number is invalid."
//         });
//     }

//     next();
// };



export const validateProfileUpdate = (req, res, next) => {
    // 1. שינינו ל-category_ids (עם s) כדי שיתאים ל-JSON שלך
    const { name, phone, category_ids } = req.body;

    // 2. בדיקת קיום שדות בסיסיים
    // שים לב: הורדתי את הבדיקה הנוקשה על הקטגוריות כי לקוח רגיל לא שולח אותן, 
    // אבל אם אתה רוצה לחייב אותן לכולם - תשאיר את זה ככה
    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: name and phone are mandatory fields."
        });
    }

    // 3. ולידציה לטלפון
    if (phone.length < 9) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: Provided phone number is invalid."
        });
    }

    // 4. אם נשלחו קטגוריות, נוודא שהן במבנה של מערך
    if (category_ids && !Array.isArray(category_ids)) {
         return res.status(400).json({
            success: false,
            message: "Validation failed: category_ids must be an array."
        });
    }

    next();
};