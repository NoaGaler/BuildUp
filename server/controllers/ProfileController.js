import profileModel from '../models/profileModel.js';

class profileController {


    // Get all professionals with optional filters and sorting
    static async getAllProfessionals(req, res) {
        try {
            // Extract category_id, search, city, and sortBy from the URL query
            const { category_id, search, city, sortBy } = req.query;

            // Pass all active parameters directly into the database model
            const professionals = await profileModel.getAllProfessionals({
                category_id: category_id || null,
                search: search || null,
                city: city || null,
                sortBy: sortBy || 'newest'
            });

            return res.status(200).json({
                success: true,
                message: "Professional directory fetched successfully.",
                count: professionals.length,
                data: professionals
            });

        } catch (error) {
            console.error("Error inside getAllProfessionals controller:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve professional directory.",
                error: error.message
            });
        }
    }


    static async getProfile(req, res) {
        try {
            const profile = await profileModel.getProfileById(req.params.id);
            if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
            
            return res.status(200).json({ success: true, data: profile });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.params.id;

            const updatedProfile = await profileModel.updateProfile(userId, req.body);
            
            return res.status(200).json({ 
                success: true, 
                message: "Profile updated successfully",
                data: updatedProfile
            });
        } catch (error) {
            console.error("Update profile error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default profileController;












// import professionalModel from '../models/professionalModel.js';

// class professionalController {


//     // Get all professionals with optional filters and sorting
//     static async getAllProfessionals(req, res) {
//         try {
//             // Extract category_id, search, city, and sortBy from the URL query
//             const { category_id, search, city, sortBy } = req.query;

//             // Pass all active parameters directly into the database model
//             const professionals = await professionalModel.getAllProfessionals({
//                 category_id: category_id || null,
//                 search: search || null,
//                 city: city || null,
//                 sortBy: sortBy || 'newest'
//             });

//             return res.status(200).json({
//                 success: true,
//                 message: "Professional directory fetched successfully.",
//                 count: professionals.length,
//                 data: professionals
//             });

//         } catch (error) {
//             console.error("Error inside getAllProfessionals controller:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to retrieve professional directory.",
//                 error: error.message
//             });
//         }
//     }

//     // Get a single professional profile by ID
//     static async getProfessionalProfile(req, res) {
//         try {
//             const professionalId = req.params.id;
//             const professional = await professionalModel.getProfessionalById(professionalId);

//             if (!professional) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `Professional profile with ID ${professionalId} could not be found.`
//                 });
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: "Professional profile details fetched successfully.",
//                 data: professional
//             });

//         } catch (error) {
//             console.error("Error inside getProfessionalProfile controller:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to retrieve professional profile due to an internal server error.",
//                 error: error.message
//             });
//         }
//     }

//     static async updateProfile(req, res) {
//         try {
//             const professionalId = req.params.id; 
//             const { name, phone, bio, tagline, city, profile_image, category_name } = req.body;

//             const updateFields = { name, phone, bio, tagline, city, category_name };

//             if (profile_image) {
//                 let finalProfileImageUrl = profile_image;
//                 if (!finalProfileImageUrl.startsWith('/uploads/')) {
//                     finalProfileImageUrl = `/uploads/profiles/${finalProfileImageUrl}`;
//                 }
//                 updateFields.profile_image_url = finalProfileImageUrl;
//             }

//             const success = await professionalModel.updateProfessionalProfile(professionalId, updateFields);
            
//             if (!success) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Profile modifications could not be applied or no changes were detected."
//                 });
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: "Professional profile specifications synchronized successfully."
//             });

//         } catch (error) {
//             console.error("Error inside updateProfile controller:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to apply profile modifications due to an internal server error.",
//                 error: error.message
//             });
//         }
//     }
// }

// export default professionalController;



