const mongoose = require('mongoose');
const TreatmentSchema = new mongoose.Schema({
  title: String, slug: String, category: String,
  shortDescription: String, fullDescription: String,
  durationMinutes: Number, recommendedDays: Number,
  indications: [String], benefits: [String],
  contraindications: [String], procedureSteps: [String],
  isFeatured: Boolean, status: String, isDeleted: Boolean
}, { timestamps: true });
const Treatment = mongoose.model('Treatment', TreatmentSchema);

const shiroSteps = [
  '{"step":"Preparation & Positioning","detail":"Comfortable supine positioning on the Droni therapy table with forehead exposed and eyes covered."}',
  '{"step":"Dhara (Oil Stream)","detail":"Steady continuous stream of warm prescribed medicated oil poured from a specific height across the forehead for a set duration."}',
  '{"step":"Scalp & Hair Care","detail":"Gentle scalp and hair treatment to remove residual oil and promote further absorption."}',
  '{"step":"Rest & Observation","detail":"Quiet rest in a low-stimulus environment afterwards; avoid sudden stimulation or cold exposure."}'
];
const abhyaSteps = [
  '{"step":"Oil Selection","detail":"Physician-directed medicated oil choice based on your dosha and condition."}',
  '{"step":"Application","detail":"Warm medicated oil massage by two trained therapists in dedicated rooms using rhythmic synchronized strokes."}',
  '{"step":"Swedana (Optional)","detail":"Herbal steam bath may follow to enhance oil absorption and open channels."}',
  '{"step":"Rest & Recovery","detail":"Post-therapy rest period; may be followed by a warm bath as advised by physician."}'
];

mongoose.connect('mongodb://127.0.0.1:27017/susrutha_db').then(async () => {
  console.log('Connected');
  const count = await Treatment.countDocuments();
  console.log('count:', count);

  if (count === 0) {
    await Treatment.create([
      {
        title: 'Abhyangam (Warm Medicated Oil Massage)', slug: 'abhyangam-warm-oil-massage',
        category: 'External Therapy',
        shortDescription: 'Full-body synchronized herbal oil massage to nourish tissues and improve lymphatic drainage.',
        fullDescription: 'Classic Kerala Ayurvedic body massage using dosha-specific medicated oils applied by two trained therapists simultaneously.',
        durationMinutes: 60, recommendedDays: 7,
        indications: ['Vata patterns', 'Muscle stiffness', 'General fatigue'],
        benefits: ['Improves blood circulation', 'Relieves muscular tension', 'Deep tissue nourishment'],
        contraindications: ['Acute fevers', 'Active skin infections', 'Open wounds at therapy site'],
        procedureSteps: abhyaSteps, isFeatured: true, status: 'published', isDeleted: false
      },
      {
        title: 'Shirodhara (Mind Calming Oil Stream Therapy)', slug: 'shirodhara-mind-calming-therapy',
        category: 'External Therapy',
        shortDescription: 'Continuous rhythm pour of warm medicated oil across forehead for nerve relaxation.',
        fullDescription: 'Shirodhara is a signature Kerala therapy - a continuous stream of warm oil poured over the forehead in a rhythmic flow.',
        durationMinutes: 45, recommendedDays: 7,
        indications: ['Insomnia', 'Anxiety & Depression', 'Hypertension', 'Migraine'],
        benefits: ['Calms the central nervous system', 'Improves sleep quality', 'Relieves chronic headaches'],
        contraindications: ['Certain acute ear or eye conditions', 'Active scalp infections', 'Severe cervical spine instability'],
        procedureSteps: shiroSteps, isFeatured: true, status: 'published', isDeleted: false
      }
    ]);
    console.log('Treatments created');
  } else {
    await mongoose.connection.db.collection('treatments').updateOne(
      { slug: 'shirodhara-mind-calming-therapy' },
      { '$set': { category: 'External Therapy', contraindications: ['Acute ear/eye conditions','Scalp infections'], procedureSteps: shiroSteps } }
    );
    await mongoose.connection.db.collection('treatments').updateOne(
      { slug: 'abhyangam-warm-oil-massage' },
      { '$set': { category: 'External Therapy', contraindications: ['Acute fevers','Skin infections'], procedureSteps: abhyaSteps } }
    );
    console.log('Treatments updated');
  }

  const final = await Treatment.find({}, { slug: 1, procedureSteps: 1 });
  final.forEach(t => console.log(t.slug, '-> steps:', t.procedureSteps.length, t.procedureSteps[0] ? t.procedureSteps[0].substring(0, 70) : 'EMPTY'));
  await mongoose.disconnect();
  console.log('Done');
}).catch(e => { console.error('ERR:', e.message); process.exit(1); });
