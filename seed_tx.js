const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
  title: String, slug: String, category: String, malayalam: String,
  shortDescription: String, fullDescription: String, coverImage: String,
  durationMinutes: Number, recommendedDays: Number,
  indications: [String], benefits: [String], contraindications: [String],
  preparation: [String], aftercare: [String], safety: [String],
  procedureSteps: mongoose.Schema.Types.Mixed,
  faqs: mongoose.Schema.Types.Mixed,
  isFeatured: Boolean, status: String, isDeleted: Boolean
}, { timestamps: true });

const Treatment = mongoose.model('Treatment', TreatmentSchema);

const abhyaSteps = [
  { step: 'Oil Selection', detail: 'Physician-directed medicated oil choice based on your dosha and condition.' },
  { step: 'Application', detail: 'Warm medicated oil massage by two trained therapists in dedicated rooms using rhythmic synchronized strokes.' },
  { step: 'Swedana (Optional)', detail: 'Herbal steam bath may follow to enhance oil absorption and open channels.' },
  { step: 'Rest & Recovery', detail: 'Post-therapy rest period; may be followed by a warm bath as advised by physician.' }
];

const shiroSteps = [
  { step: 'Preparation & Positioning', detail: 'Comfortable supine positioning on the Droni (therapy table) with forehead exposed and eyes covered.' },
  { step: 'Dhara (Oil Stream)', detail: 'Steady, continuous stream of warm prescribed medicated oil or liquid poured from a specific height across the forehead for a set duration.' },
  { step: 'Scalp & Hair Care', detail: 'Gentle scalp and hair treatment to remove residual oil and promote further absorption.' },
  { step: 'Rest & Observation', detail: 'Quiet rest in a low-stimulus environment afterwards; avoid sudden stimulation or cold exposure.' }
];

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/susrutha_db';

mongoose.connect(mongoUri).then(async () => {
  console.log('Connected to MongoDB');

  await Treatment.updateOne(
    { slug: 'abhyangam-warm-oil-massage' },
    {
      $set: {
        title: 'Abhyangam (Warm Medicated Oil Massage)',
        category: 'External Therapy',
        malayalam: 'ആയുർവേദ ശരീര തിരുമ്മൽ',
        shortDescription: 'Full-body synchronized herbal oil massage to nourish tissues and improve lymphatic drainage.',
        fullDescription: 'Classic Kerala Ayurvedic body massage using dosha-specific medicated oils applied by two trained therapists simultaneously. Beyond relaxation, Abhyanga is a clinical external therapy prescribed for specific indications and oil choices matched to the patient.',
        durationMinutes: 60,
        recommendedDays: 7,
        indications: ['Patients prescribed oleation', 'Guests on multi-day care packages', 'Those with dry, stiff Vata patterns', 'Vata-predominant stiffness', 'Stress-linked tension'],
        benefits: ['Improves blood circulation', 'Relieves muscular tension', 'Deeply tones body tissues', 'Supports relaxation and sleep quality', 'Prepares body for further therapies', 'Nourishes skin and peripheral tissues'],
        contraindications: ['Acute fevers', 'Active skin infections', 'Open wounds at therapy site'],
        preparation: [
          'Light vegetarian meal 2 hours prior to session',
          'Inform doctor of any active skin allergies or acute pain',
          'Wear comfortable loose clothing'
        ],
        aftercare: [
          'Drink warm boiled herbal water',
          'Avoid direct cold wind or fan exposure',
          'Take 30 minutes rest in a warm quiet room',
          'Bathe with warm water only after 1 hour'
        ],
        safety: [
          'Supervised by certified BAMS Ayurvedic physicians',
          'Discontinued immediately if fever or dizziness develops',
          'Sterile fresh medicated oils prepared daily in GMP unit'
        ],
        faqs: [
          { q: 'Is a doctor consultation mandatory before treatment?', a: 'Yes, all therapies are prescribed following a detailed physician diagnostic examination.' },
          { q: 'What is the recommended duration?', a: '7 to 14 consecutive days for optimal clinical results.' }
        ],
        procedureSteps: abhyaSteps,
        isFeatured: true,
        status: 'published'
      }
    },
    { upsert: true }
  );

  await Treatment.updateOne(
    { slug: 'shirodhara-mind-calming-therapy' },
    {
      $set: {
        title: 'Shirodhara (Mind Calming Oil Stream Therapy)',
        category: 'External Therapy',
        malayalam: 'ശിരോധാര ചികിത്സ',
        shortDescription: 'Continuous rhythm pour of warm medicated oil across forehead for nerve relaxation.',
        fullDescription: 'Shirodhara is a signature Kerala therapy — a continuous stream of warm oil or liquid poured over the forehead in a rhythmic flow. It is indicated in selected stress, sleep and neurological-support contexts under physician guidance.',
        durationMinutes: 45,
        recommendedDays: 7,
        indications: ['Patients with stress-linked complaints', 'Guests on rejuvenation or stress packages', 'Insomnia', 'Anxiety & Depression', 'Hypertension', 'Migraine'],
        benefits: ['Calms the central nervous system', 'Improves sleep quality', 'Relieves chronic headaches', 'Deep rest opportunity', 'Supports nervous system calm in traditional framing'],
        contraindications: ['Certain acute ear or eye conditions', 'Active scalp infections', 'Severe cervical spine instability'],
        preparation: [
          'Avoid heavy meals right before therapy',
          'Remove hair accessories and spectacles',
          'Inform physician of any neck or spine movement restriction'
        ],
        aftercare: [
          'Keep head wrapped with a dry towel',
          'Protect ears from cold breeze',
          'Avoid watching bright TV/phone screens immediately after therapy'
        ],
        safety: [
          'Performed by trained therapists under constant physician observation',
          'Oil temperature continuously monitored'
        ],
        faqs: [
          { q: 'Is Shirodhara suitable for insomnia?', a: 'Yes, Shirodhara is widely prescribed in Ayurveda for chronic sleeplessness and nervous exhaustion.' },
          { q: 'How many sessions are recommended?', a: 'Typically 7 to 14 sessions are recommended for long-term neurological benefit.' }
        ],
        procedureSteps: shiroSteps,
        isFeatured: true,
        status: 'published'
      }
    },
    { upsert: true }
  );

  console.log('Treatments seeded/updated successfully in MongoDB');
  await mongoose.disconnect();
}).catch(e => {
  console.error('Seed Error:', e.message);
  process.exit(1);
});
