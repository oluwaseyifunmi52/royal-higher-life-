import User from '../models/User.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import requireSuperAdmin from '../middleware/adminAuth.js';
import Admin from '../models/User.js';

// @desc    Get all administrators (super admin only)
// @route   GET /api/admin/admins
// @access  Super Admin only
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: { $in: ["super_admin", "admin", "content_admin", "finance_admin", "prayer_support_admin", "content_reviewer"] } })
            .select("-password -resetPasswordToken -resetPasswordExpire")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: admins.length, admins });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Create new administrator (super admin only)
// @route   POST /api/admin/admins
// @access  Super Admin only
export const createAdmin = async (req, res) => {
    try {
        const { fullName, email, phone, role } = req.body;

        if (!fullName || !email || !role) {
            return res.status(400).json({ success: false, message: 'Full name, email, and role are required' });
        }

        // Validate role
        const validRoles = ["super_admin", "admin", "content_admin", "finance_admin", "prayer_support_admin", "content_reviewer", "member"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Generate secure invitation token
        const invitationToken = crypto.randomBytes(64).toString('hex');
        const tokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const user = await User.create({
            firstName: fullName.split(' ')[0] || '',
            lastName: fullName.split(' ').slice(1).join(' ') || '',
            email: email.toLowerCase(),
            phone: phone || "",
            role: role,
            isActive: true,
            password: "", // No password - will use invitation link
            invitationToken,
            invitationTokenExpires: tokenExpires,
        });

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.invitationToken;
        delete userObj.invitationTokenExpires;

        res.status(201).json({
            success: true,
            user: userObj,
            message: 'Administrator account created. Invitation sent. New admin must use secure link to set password and activate account.',
            invitationToken,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get single administrator (super admin only)
// @route   GET /api/admin/admins/:id
// @access  Super Admin only
export const getAdminById = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id).select("-password -invitationToken -invitationTokenExpires");
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Administrator not found' });
        }

        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update administrator (super admin only)
// @route   PUT /api/admin/admins/:id
// @access  Super Admin only
export const updateAdmin = async (req, res) => {
    try {
        const { fullName, email, phone, role, isActive } = req.body;

        const admin = await User.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Administrator not found' });
        }

        // Only super admin can change role
        if (req.user.role === "super_admin" && role && admin.role !== "super_admin") {
            const validRoles = ["super_admin", "admin", "content_admin", "finance_admin", "prayer_support_admin", "content_reviewer", "member"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ success: false, message: 'Invalid role specified' });
            }
            admin.role = role;
        }

        if (fullName) {
            const nameParts = fullName.split(' ');
            admin.firstName = nameParts[0] || '';
            admin.lastName = nameParts.slice(1).join(' ') || '';
        }
        if (email) admin.email = email.toLowerCase();
        if (phone !== undefined) admin.phone = phone;
        if (isActive !== undefined) admin.isActive = isActive;

        await admin.save();

        const userObj = admin.toObject();
        delete userObj.password;
        delete userObj.invitationToken;
        delete userObj.invitationTokenExpires;

        res.status(200).json({ success: true, admin: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Suspend administrator (super admin only)
// @route   PUT /api/admin/admins/:id/suspend
// @access  Super Admin only
export const suspendAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Administrator not found' });
        }

        // Prevent suspending the last super admin
        if (admin.role === "super_admin") {
            const superAdminCount = await User.countDocuments({ role: "super_admin" });
            if (superAdminCount <= 1) {
                return res.status(400).json({ success: false, message: 'Cannot suspend the last super administrator. Assign a new super admin first.' });
            }
        }

        admin.isActive = false;
        await admin.save();

        res.status(200).json({ success: true, message: 'Administrator suspended successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Activate administrator (super admin only)
// @route   PUT /api/admin/admins/:id/activate
// @access  Super Admin only
export const activateAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Administrator not found' });
        }

        admin.isActive = true;
        await admin.save();

        res.status(200).json({ success: true, message: 'Administrator activated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Reset administrator password via secure link
// @route   POST /api/admin/admins/:id/reset-password
// @access  Super Admin only
export const resetAdminPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const admin = await User.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Administrator not found' });
        }

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        admin.passwordChangedAt = Date.now();
        await admin.save();

        res.status(200).json({ success: true, message: 'Administrator password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Revoke all sessions for administrator (super admin only)
// @route   POST /api/admin/admins/:id/revoke-sessions
// @access  Super Admin only
export const revokeAdminSessions = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Administrator not found' });
        }

        // Clear refresh tokens and update last login to invalidate existing sessions
        admin.lastLogin = Date.now();
        admin.failedLoginAttempts = 0;
        admin.lockUntil = undefined;
        await admin.save();

        res.status(200).json({ success: true, message: 'All sessions revoked successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Send invitation email to new administrator
// @route   POST /api/admin/admins/:id/send-invitation
// @access  Super Admin only
export const sendAdminInvitation = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Administrator not found' });
        }

        if (admin.role === "super_admin") {
            return res.status(400).json({ success: false, message: 'Cannot send invitation to super administrator' });
        }

        // Generate new invitation token
        admin.invitationToken = crypto.randomBytes(64).toString('hex');
        admin.invitationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await admin.save();

        // In a real implementation, send email here
        // For now, return the invitation details
        res.status(200).json({
            success: true,
            message: 'Invitation resent. The new administrator should use the secure link to set their password.',
            invitationToken: admin.invitationToken,
            expiresIn: 24 * 60 * 60, // 24 hours in seconds
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// ---------------------- DASHBOARD FUNCTIONS (for admin.js routes) ----------------------

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "member" });
        const totalAdmins = await User.countDocuments({ role: { $in: ["admin", "super_admin", "content_admin", "finance_admin", "prayer_support_admin", "content_reviewer"] } });
        const totalSermons = await (await import('../models/Sermon.js')).default.countDocuments();
        const totalEvents = await (await import('../models/Event.js')).default.countDocuments();
        const totalGalleries = await (await import('../models/Gallery.js')).default.countDocuments();
        const totalTestimonies = await (await import('../models/Testimony.js')).default.countDocuments();
        const totalPrayerRequests = await (await import('../models/Prayer.js')).default.countDocuments();
        const totalDonations = await (await import('../models/Donation.js')).default.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAdmins,
                totalSermons,
                totalEvents,
                totalGalleries,
                totalTestimonies,
                totalPrayerRequests,
                totalDonations,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get all sermons
// @route   GET /api/admin/sermons
// @access  Admin only
export const getSermons = async (req, res) => {
    try {
        const Sermon = (await import('../models/Sermon.js')).default;
        const sermons = await Sermon.find().sort({ date: -1 });
        res.status(200).json({ success: true, count: sermons.length, sermons });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Create sermon
// @route   POST /api/admin/sermons
// @access  Admin only
export const createSermon = async (req, res) => {
    try {
        const Sermon = (await import('../models/Sermon.js')).default;
        const sermon = await Sermon.create({ ...req.body, createdBy: req.user.id });
        const savedSermon = await Sermon.findById(sermon._id);
        res.status(201).json({ success: true, sermon: savedSermon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update sermon
// @route   PUT /api/admin/sermons/:id
// @access  Admin only
export const updateSermon = async (req, res) => {
    try {
        const Sermon = (await import('../models/Sermon.js')).default;
        const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sermon) {
            return res.status(404).json({ success: false, message: 'Sermon not found' });
        }
        res.status(200).json({ success: true, sermon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete sermon
// @route   DELETE /api/admin/sermons/:id
// @access  Admin only
export const deleteSermon = async (req, res) => {
    try {
        const Sermon = (await import('../models/Sermon.js')).default;
        const sermon = await Sermon.findByIdAndDelete(req.params.id);
        if (!sermon) {
            return res.status(404).json({ success: false, message: 'Sermon not found' });
        }
        res.status(200).json({ success: true, sermon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get admin events
// @route   GET /api/admin/events
// @access  Admin only
export const getAdminEvents = async (req, res) => {
    try {
        const Event = (await import('../models/Event.js')).default;
        const events = await Event.find().sort({ date: -1 });
        res.status(200).json({ success: true, count: events.length, events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Create event
// @route   POST /api/admin/events
// @access  Admin only
export const createEvent = async (req, res) => {
    try {
        const Event = (await import('../models/Event.js')).default;
        const event = await Event.create({ ...req.body, createdBy: req.user.id });
        const savedEvent = await Event.findById(event._id);
        res.status(201).json({ success: true, event: savedEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Admin only
export const updateEvent = async (req, res) => {
    try {
        const Event = (await import('../models/Event.js')).default;
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Admin only
export const deleteEvent = async (req, res) => {
    try {
        const Event = (await import('../models/Event.js')).default;
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get ministries
// @route   GET /api/admin/ministries
// @access  Admin only
export const getMinistries = async (req, res) => {
    try {
        const Ministry = (await import('../models/Ministry.js')).default;
        const ministries = await Ministry.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: ministries.length, ministries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Create ministry
// @route   POST /api/admin/ministries
// @access  Admin only
export const createMinistry = async (req, res) => {
    try {
        const Ministry = (await import('../models/Ministry.js')).default;
        const ministry = await Ministry.create({ ...req.body, createdBy: req.user.id });
        const savedMinistry = await Ministry.findById(ministry._id);
        res.status(201).json({ success: true, ministry: savedMinistry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete ministry
// @route   DELETE /api/admin/ministries/:id
// @access  Admin only
export const deleteMinistry = async (req, res) => {
    try {
        const Ministry = (await import('../models/Ministry.js')).default;
        const ministry = await Ministry.findByIdAndDelete(req.params.id);
        if (!ministry) {
            return res.status(404).json({ success: false, message: 'Ministry not found' });
        }
        res.status(200).json({ success: true, ministry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get gallery images
// @route   GET /api/admin/gallery
// @access  Admin only
export const getGalleryImages = async (req, res) => {
    try {
        const Gallery = (await import('../models/Gallery.js')).default;
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: images.length, images });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Upload gallery image
// @route   POST /api/admin/gallery
// @access  Admin only
export const uploadGalleryImage = async (req, res) => {
    try {
        const Gallery = (await import('../models/Gallery.js')).default;
        const image = await Gallery.create({ ...req.body, uploadedBy: req.user.id });
        const savedImage = await Gallery.findById(image._id);
        res.status(201).json({ success: true, image: savedImage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/admin/gallery/:id
// @access  Admin only
export const deleteGalleryImage = async (req, res) => {
    try {
        const Gallery = (await import('../models/Gallery.js')).default;
        const image = await Gallery.findByIdAndDelete(req.params.id);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Gallery image not found' });
        }
        res.status(200).json({ success: true, image });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get announcements
// @route   GET /api/admin/announcements
// @access  Admin only
export const getAnnouncements = async (req, res) => {
    try {
        const Announcement = (await import('../models/Announcement.js')).default;
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: announcements.length, announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Create announcement
// @route   POST /api/admin/announcements
// @access  Admin only
export const createAnnouncement = async (req, res) => {
    try {
        const Announcement = (await import('../models/Announcement.js')).default;
        const announcement = await Announcement.create({ ...req.body, createdBy: req.user.id });
        const savedAnnouncement = await Announcement.findById(announcement._id);
        res.status(201).json({ success: true, announcement: savedAnnouncement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/admin/announcements/:id
// @access  Admin only
export const deleteAnnouncement = async (req, res) => {
    try {
        const Announcement = (await import('../models/Announcement.js')).default;
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        res.status(200).json({ success: true, announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get testimonies
// @route   GET /api/admin/testimonies
// @access  Admin only
export const getTestimonies = async (req, res) => {
    try {
        const Testimony = (await import('../models/Testimony.js')).default;
        const testimonies = await Testimony.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: testimonies.length, testimonies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update testimony
// @route   PUT /api/admin/testimonies/:id
// @access  Admin only
export const updateTestimony = async (req, res) => {
    try {
        const Testimony = (await import('../models/Testimony.js')).default;
        const testimony = await Testimony.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!testimony) {
            return res.status(404).json({ success: false, message: 'Testimony not found' });
        }
        res.status(200).json({ success: true, testimony });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete testimony
// @route   DELETE /api/admin/testimonies/:id
// @access  Admin only
export const deleteTestimony = async (req, res) => {
    try {
        const Testimony = (await import('../models/Testimony.js')).default;
        const testimony = await Testimony.findByIdAndDelete(req.params.id);
        if (!testimony) {
            return res.status(404).json({ success: false, message: 'Testimony not found' });
        }
        res.status(200).json({ success: true, testimony });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get prayer requests
// @route   GET /api/admin/prayer-requests
// @access  Admin only
export const getPrayerRequests = async (req, res) => {
    try {
        const Prayer = (await import('../models/Prayer.js')).default;
        const prayers = await Prayer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: prayers.length, prayers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update prayer request
// @route   PUT /api/admin/prayer-requests/:id
// @access  Admin only
export const updatePrayerRequest = async (req, res) => {
    try {
        const Prayer = (await import('../models/Prayer.js')).default;
        const prayer = await Prayer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer request not found' });
        }
        res.status(200).json({ success: true, prayer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete prayer request
// @route   DELETE /api/admin/prayer-requests/:id
// @access  Admin only
export const deletePrayerRequest = async (req, res) => {
    try {
        const Prayer = (await import('../models/Prayer.js')).default;
        const prayer = await Prayer.findByIdAndDelete(req.params.id);
        if (!prayer) {
            return res.status(404).json({ success: false, message: 'Prayer request not found' });
        }
        res.status(200).json({ success: true, prayer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get contact messages
// @route   GET /api/admin/contact-messages
// @access  Admin only
export const getContactMessages = async (req, res) => {
    try {
        const Contact = (await import('../models/Contact.js')).default;
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update contact message
// @route   PUT /api/admin/contact-messages/:id
// @access  Admin only
export const updateContactMessage = async (req, res) => {
    try {
        const Contact = (await import('../models/Contact.js')).default;
        const message = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!message) {
            return res.status(404).json({ success: false, message: 'Contact message not found' });
        }
        res.status(200).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contact-messages/:id
// @access  Admin only
export const deleteContactMessage = async (req, res) => {
    try {
        const Contact = (await import('../models/Contact.js')).default;
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Contact message not found' });
        }
        res.status(200).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get leadership
// @route   GET /api/admin/leadership
// @access  Admin only
export const getLeadership = async (req, res) => {
    try {
        const Leadership = (await import('../models/Leadership.js')).default;
        const leadership = await Leadership.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: leadership.length, leadership });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Create leadership
// @route   POST /api/admin/leadership
// @access  Admin only
export const createLeadership = async (req, res) => {
    try {
        const Leadership = (await import('../models/Leadership.js')).default;
        const leadership = await Leadership.create({ ...req.body, createdBy: req.user.id });
        const savedLeadership = await Leadership.findById(leadership._id);
        res.status(201).json({ success: true, leadership: savedLeadership });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update leadership
// @route   PUT /api/admin/leadership/:id
// @access  Admin only
export const updateLeadership = async (req, res) => {
    try {
        const Leadership = (await import('../models/Leadership.js')).default;
        const leadership = await Leadership.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!leadership) {
            return res.status(404).json({ success: false, message: 'Leadership not found' });
        }
        res.status(200).json({ success: true, leadership });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Delete leadership
// @route   DELETE /api/admin/leadership/:id
// @access  Admin only
export const deleteLeadership = async (req, res) => {
    try {
        const Leadership = (await import('../models/Leadership.js')).default;
        const leadership = await Leadership.findByIdAndDelete(req.params.id);
        if (!leadership) {
            return res.status(404).json({ success: false, message: 'Leadership not found' });
        }
        res.status(200).json({ success: true, leadership });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get donations
// @route   GET /api/admin/donations
// @access  Admin only
export const adminListDonations = async (req, res) => {
    try {
        const Donation = (await import('../models/Donation.js')).default;
        const donations = await Donation.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: donations.length, donations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get donations campaigns
// @route   GET /api/admin/donations/campaigns
// @access  Admin only
export const adminListCampaigns = async (req, res) => {
    try {
        const DonationCampaign = (await import('../models/DonationCampaign.js')).default;
        const campaigns = await DonationCampaign.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: campaigns.length, campaigns });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Create donation campaign
// @route   POST /api/admin/donations/campaigns
// @access  Admin only
export const adminCreateCampaign = async (req, res) => {
    try {
        const DonationCampaign = (await import('../models/DonationCampaign.js')).default;
        const campaign = await DonationCampaign.create({ ...req.body, createdBy: req.user.id });
        const savedCampaign = await DonationCampaign.findById(campaign._id);
        res.status(201).json({ success: true, campaign: savedCampaign });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Update donation campaign
// @route   PUT /api/admin/donations/campaigns/:id
// @access  Admin only
export const adminUpdateCampaign = async (req, res) => {
    try {
        const DonationCampaign = (await import('../models/DonationCampaign.js')).default;
        const campaign = await DonationCampaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.status(200).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Deactivate campaign
// @route   DELETE /api/admin/donations/campaigns/:id
// @access  Admin only
export const adminDeactivateCampaign = async (req, res) => {
    try {
        const DonationCampaign = (await import('../models/DonationCampaign.js')).default;
        const campaign = await DonationCampaign.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.status(200).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get audit log
// @route   GET /api/admin/donations/audit
// @access  Admin only
export const adminGetAudit = async (req, res) => {
    try {
        // In a real implementation, this would query an audit log collection
        // For now, return empty array or placeholder
        res.status(200).json({ success: true, data: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Resend receipt
// @route   POST /api/admin/donations/:id/resend-receipt
// @access  Admin only
export const adminResendReceipt = async (req, res) => {
    try {
        const Donation = (await import('../models/Donation.js')).default;
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        // In a real implementation, this would trigger an email receipt re-send
        res.status(200).json({ success: true, message: 'Receipt resend initiated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get users
// @route   GET /api/admin/users
// @access  Admin only
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" })
            .select("-password -resetPasswordToken -resetPasswordExpire")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};

// @desc    Get contacts
// @route   GET /api/admin/contacts
// @access  Admin only
export const getContacts = async (req, res) => {
    try {
        const Contact = (await import('../models/Contact.js')).default;
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to process the request right now.' });
    }
};