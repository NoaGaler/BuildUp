export const validateProfileUpdate = (req, res, next) => {
    const { name, phone, category_id } = req.body;

    if (!name || !phone || !category_id) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: name, phone, and category_id are mandatory fields."
        });
    }

    if (phone.length < 9) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: Provided phone number is invalid."
        });
    }

    next();
};