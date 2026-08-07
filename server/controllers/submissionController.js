import Contact from '../models/Contact.js';
import Prayer from '../models/Prayer.js';
import Donation from '../models/Donation.js';
import Review from '../models/Review.js';
import Newsletter from '../models/Newsletter.js';
import Testimony from '../models/Testimony.js';
import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import Volunteer from '../models/Volunteer.js';
import Partnership from '../models/Partnership.js';

// 1. Contact Form
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 2. Prayer Request
export const createPrayer = async (req, res) => {
  try {
    const { name, email, phone, prayer, category } = req.body;

    if (!name || !email || !prayer) {
      return res.status(400).json({ success: false, message: 'Name, email, and prayer are required' });
    }

    const prayerRequest = await Prayer.create({ name, email, phone, prayer, category });
    res.status(201).json({ success: true, data: prayerRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 3. Donation
export const createDonation = async (req, res) => {
  try {
    const { firstName, lastName, email, amount, currency, payment } = req.body;

    if (!firstName || !lastName || !email || !amount || !currency || !payment) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const donation = await Donation.create(req.body);
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 4. Review
export const createReview = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required' });
    }

    const review = await Review.create({ name, message, rating: rating || 5 });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 5. Newsletter Subscription
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      if (!existing.subscribed) {
        existing.subscribed = true;
        await existing.save();
        return res.status(200).json({ success: true, message: 'Successfully resubscribed', data: existing });
      }
      return res.status(200).json({ success: true, message: 'Already subscribed', data: existing });
    }

    const subscription = await Newsletter.create({ email });
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 6. Testimony
export const createTestimony = async (req, res) => {
  try {
    const { name, email, title, testimony } = req.body;

    if (!name || !email || !testimony) {
      return res.status(400).json({ success: false, message: 'Name, email, and testimony are required' });
    }

    const testimonyEntry = await Testimony.create({ name, email, title, testimony });
    res.status(201).json({ success: true, data: testimonyEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 7. Event Registration
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, name, email } = req.body;

    if (!eventId || !name || !email) {
      return res.status(400).json({ success: false, message: 'Event ID, name, and email are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.capacity && event.registrations >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event has reached maximum capacity' });
    }

    const registration = await EventRegistration.create(req.body);

    event.registrations = (event.registrations || 0) + 1;
    await event.save();

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 8. Volunteer
export const createVolunteer = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'First name, last name, and email are required' });
    }

    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 9. Partnership
export const createPartnership = async (req, res) => {
  try {
    const { organization, contactName, email } = req.body;

    if (!organization || !contactName || !email) {
      return res.status(400).json({ success: false, message: 'Organization, contact name, and email are required' });
    }

    const partnership = await Partnership.create(req.body);
    res.status(201).json({ success: true, data: partnership });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
