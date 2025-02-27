const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'ambulance',
      'doctor_consultation',
      'health_insurance',
      'medical_reimbursement',
      'hospital',
      'diagnostic_center',
      'physiotherapy',
      'pharmacy'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'coming_soon', 'inactive'],
    default: 'active'
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  availabilityHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for location-based queries
serviceSchema.index({ "location.coordinates": "2dsphere" });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
