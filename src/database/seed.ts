import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import { Role } from '../models/Role.model';
import { Branch } from '../models/Branch.model';
import { Doctor } from '../models/Doctor.model';
import { Department } from '../models/Department.model';
import { Appointment } from '../models/Appointment.model';
import { CarePackage } from '../models/CarePackage.model';
import { Infrastructure } from '../models/Infrastructure.model';
import { Blog } from '../models/Blog.model';
import { Lead } from '../models/Lead.model';
import { Setting } from '../models/Setting.model';
import Condition from '../models/Condition.model';
import Treatment from '../models/Treatment.model';
import Ecosystem from '../models/Ecosystem.model';
import NewsEvent from '../models/NewsEvent.model';
import Video from '../models/Video.model';
import GalleryAlbum from '../models/GalleryAlbum.model';
import Affiliation from '../models/Affiliation.model';
import MediaFile from '../models/MediaFile.model';
import AuditLog from '../models/AuditLog.model';
import { FAQ } from '../models/FAQ.model';
import { Testimonial } from '../models/Testimonial.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/susrutha_db';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Purging all existing data across collections...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await Branch.deleteMany({});
    await Doctor.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});
    await CarePackage.deleteMany({});
    await Infrastructure.deleteMany({});
    await Blog.deleteMany({});
    await Lead.deleteMany({});
    await Setting.deleteMany({});
    await Condition.deleteMany({});
    await Treatment.deleteMany({});
    await Ecosystem.deleteMany({});
    await NewsEvent.deleteMany({});
    await Video.deleteMany({});
    await GalleryAlbum.deleteMany({});
    await Affiliation.deleteMany({});
    await MediaFile.deleteMany({});
    await AuditLog.deleteMany({});
    await FAQ.deleteMany({});
    await Testimonial.deleteMany({});

    console.log('1. Seeding Hospital Branches...');
    const kattakadaBranch = await Branch.create({
      name: 'Kattakada Inpatient Hospital & Research Center',
      code: 'KTK',
      type: 'INPATIENT_HOSPITAL',
      tagline: '40-Bed Inpatient Panchakarma Hospital Campus & Research Institute',
      address: {
        street: 'Kattakada-Killi Main Road',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695572',
        coordinates: { lat: 8.5085, lng: 77.0805 },
      },
      contact: {
        phone: ['+91 96566 56736', '+91 471 229 0256'],
        email: 'kattakada@susruthaayurveda.com',
        emergencyPhone: '+91 96566 56736',
      },
      opdTimings: '09:00 AM - 07:00 PM (Mon - Sun)',
      bedCapacity: 40,
      features: ['40 Inpatient Beds', 'Private Panchakarma Cottages', 'Herbal Species Botanical Garden', 'Organic Pure Vegetarian Kitchen', '24x7 Resident Doctor & Nursing'],
      isMainBranch: true,
      status: 'ACTIVE',
    });

    const kowdiarBranch = await Branch.create({
      name: 'Kowdiar City Outpatient Clinic',
      code: 'KWR',
      type: 'CITY_CLINIC',
      tagline: 'Premium City Outpatient Consultation & Specialty Care Center',
      address: {
        street: 'Kowdiar Palace Road',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695003',
        coordinates: { lat: 8.5241, lng: 76.9637 },
      },
      contact: {
        phone: ['+91 96566 56736'],
        email: 'kowdiar@susruthaayurveda.com',
        emergencyPhone: '+91 96566 56736',
      },
      opdTimings: '09:00 AM - 07:00 PM (Mon - Sat)',
      bedCapacity: 0,
      features: ['Executive OPD Consultation', 'Daycare Panchakarma & Kizhi Therapy', 'In-house GMP Medicine Pharmacy', 'Diagnostic OPD Laboratory'],
      isMainBranch: false,
      status: 'ACTIVE',
    });

    console.log('2. Seeding Clinical Departments...');
    const panchakarmaDept = await Department.create({
      title: 'Panchakarma & Bio-Purification',
      slug: 'panchakarma-bio-purification',
      code: 'PKM',
      tagline: 'Authentic 5-Fold Classical Purification & Detoxification Therapy',
      overview: 'Classical Panchakarma treatments (Vamana, Virechana, Nasyam, Vasthi, Raktamokshana) under senior Kerala Vaidyas.',
      status: 'ACTIVE',
    });

    const kayachikitsaDept = await Department.create({
      title: 'Kayachikitsa (General Internal Medicine)',
      slug: 'kayachikitsa-general-internal-medicine',
      code: 'KCY',
      tagline: 'Comprehensive Internal Medicine, Metabolic & Chronic Illness Care',
      overview: 'Holistic management of diabetes, hypertension, digestive ailments, fatty liver, and metabolic disorders.',
      status: 'ACTIVE',
    });

    const neuroRehabDept = await Department.create({
      title: 'Neurological & Stroke Rehabilitation',
      slug: 'neurological-stroke-rehabilitation',
      code: 'NEU',
      tagline: 'Post-Stroke Recovery, Motor Paralysis & Movement Disorder Care',
      overview: 'Integrated Ayurvedic neuro-rehabilitation protocols combining Shirodhara, Pizhichil, and intensive physical rehabilitation.',
      status: 'ACTIVE',
    });

    const spineJointDept = await Department.create({
      title: 'Spine Care & Musculoskeletal Health',
      slug: 'spine-care-musculoskeletal-health',
      code: 'SPN',
      tagline: 'Non-Surgical Management for Disc Herniation, Spondylosis & Arthritis',
      overview: 'Specialized Ayurvedic therapies (Kadi Vasthi, Griva Vasthi, Elakizhi) for spine and joint degeneration.',
      status: 'ACTIVE',
    });

    console.log('3. Seeding Expert Doctors...');
    const doctor1 = await Doctor.create({
      name: 'Dr. Krishnakumar K.',
      slug: 'dr-krishnakumar-k',
      designation: 'Chief Medical Officer & Senior Physician',
      qualifications: 'BAMS, MD (Ayurveda)',
      experienceYears: 24,
      departmentId: panchakarmaDept._id,
      assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
      bio: 'Renowned Ayurvedic physician with over 24 years of clinical experience in classical Panchakarma, severe degenerative spine disorders, and chronic arthritis.',
      consultationFee: 500,
      specialties: ['Panchakarma Detoxification', 'Spine Disc Herniation', 'Rheumatoid Arthritis'],
      languagesSpoken: ['Malayalam', 'English', 'Hindi'],
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
      isDirector: true,
      isFeatured: true,
      status: 'ACTIVE',
    });

    const doctor2 = await Doctor.create({
      name: 'Dr. Sreeja Krishna S.',
      slug: 'dr-sreeja-krishna-s',
      designation: 'Senior Consultant Physician',
      qualifications: 'BAMS, MS (Ayurveda)',
      experienceYears: 18,
      departmentId: kayachikitsaDept._id,
      assignedBranchIds: [kattakadaBranch._id],
      bio: 'Expert in Gynaecology, Infertility, PCOS management, Chronic Psoriasis, and Lifestyle Metabolic Disorders.',
      consultationFee: 400,
      specialties: ['PCOS & Women Health', 'Psoriasis & Skin Care', 'Metabolic Disorders'],
      languagesSpoken: ['Malayalam', 'English'],
      photoUrl: 'https://images.unsplash.com/photo-1594824813570-78a295000527',
      isDirector: false,
      isFeatured: true,
      status: 'ACTIVE',
    });

    const doctor3 = await Doctor.create({
      name: 'Dr. Anoop Varma',
      slug: 'dr-anoop-varma',
      designation: 'Senior Neuro-Ayurvedic Specialist',
      qualifications: 'BAMS, MD (Neuro-Ayurveda)',
      experienceYears: 15,
      departmentId: neuroRehabDept._id,
      assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
      bio: 'Specialist in post-stroke hemiplegia recovery, Parkinsonism, motor neuron disorders, and nerve compression management.',
      consultationFee: 550,
      specialties: ['Stroke Rehabilitation', 'Parkinsonism', 'Nerve Palsy'],
      languagesSpoken: ['Malayalam', 'English', 'Tamil'],
      photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7',
      isDirector: false,
      isFeatured: true,
      status: 'ACTIVE',
    });

    console.log('4. Seeding Clinical Conditions...');
    await Condition.create([
      {
        title: 'Rheumatoid & Osteoarthritis',
        slug: 'rheumatoid-osteoarthritis',
        category: 'Joint & Spine',
        shortDescription: 'Ayurvedic non-surgical management of joint pain, swelling, and cartilage degeneration.',
        fullDescription: 'Comprehensive treatment protocols including Abhyanga, Podikizhi, and Janu Vasthi for lasting joint flexibility and pain relief.',
        ayurvedicRootCause: 'Vata-Kapha & Amavata Dosha Accumulation',
        symptoms: ['Joint swelling and warmth', 'Morning stiffness lasting over 30 mins', 'Reduced range of motion', 'Grinding joint pain'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Cervical & Lumbar Spondylosis (Disc Bulge)',
        slug: 'cervical-lumbar-spondylosis-disc-bulge',
        category: 'Spine Care',
        shortDescription: 'Targeted spine therapies for compressed nerve roots, sciatica, and chronic neck & back stiffness.',
        fullDescription: 'Specialized Kadi Vasthi and Griva Vasthi procedures with medicated herbal oils to nourish spinal discs and relieve sciatica.',
        ayurvedicRootCause: 'Vata Dosha Imbalance & Asthi-Majja Dhatu Kshaya',
        symptoms: ['Radiating leg or arm pain', 'Numbness in fingers and toes', 'Lower back stiffness', 'Neck stiffness'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Stroke & Hemiplegia Rehabilitation',
        slug: 'stroke-hemiplegia-rehabilitation',
        category: 'Neurological',
        shortDescription: 'Intensive inpatient Ayurvedic neuro-rehabilitation for post-stroke recovery.',
        fullDescription: 'Pizhichil, Njavarakizhi, and specialized Shirodhara therapies combined with daily physical rehab to regain motor functions.',
        ayurvedicRootCause: 'Pakshaghata (Vata Roga affecting Brain Channels)',
        symptoms: ['One-sided body paralysis', 'Slurred speech (Dysarthria)', 'Loss of muscle strength and balance'],
        assignedBranchIds: [kattakadaBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Psoriasis & Chronic Eczema',
        slug: 'psoriasis-chronic-eczema',
        category: 'Skin Health',
        shortDescription: 'Holistic skin purification through Takradhara, Vamana, and herbal blood purifiers.',
        fullDescription: 'Deep bio-cleansing Panchakarma therapies addressing root immune imbalance and skin scaling without chemical steroidal creams.',
        ayurvedicRootCause: 'Rakta-Kustha & Pitta-Kapha Toxicity',
        symptoms: ['Red silvery skin patches', 'Severe skin itching and scaling', 'Dry cracked bleeding skin'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
    ]);

    console.log('5. Seeding Classical Treatments...');
    await Treatment.create([
      {
        title: 'Abhyangam (Warm Medicated Oil Massage)',
        slug: 'abhyangam-warm-oil-massage',
        category: 'Panchakarma',
        shortDescription: 'Full-body synchronized herbal oil massage to nourish tissues and improve lymphatic drainage.',
        fullDescription: 'Classic Kerala Ayurvedic body massage using dosha-specific medicated oils applied by two trained therapists simultaneously.',
        durationMinutes: 60,
        recommendedDays: 7,
        indications: ['Vata disorders', 'Muscle stiffness', 'General fatigue', 'Insomnia'],
        benefits: ['Improves blood circulation', 'Relieves muscular tension', 'Deeply tones body tissues'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Shirodhara (Mind Calming Oil Stream Therapy)',
        slug: 'shirodhara-mind-calming-therapy',
        category: 'Panchakarma',
        shortDescription: 'Continuous rhythm pour of warm medicated oil across forehead for nerve relaxation.',
        fullDescription: 'Profound nervous system relaxation procedure highly recommended for anxiety, insomnia, hypertension, and stress.',
        durationMinutes: 45,
        recommendedDays: 7,
        indications: ['Insomnia', 'Anxiety & Depression', 'Hypertension', 'Migraine'],
        benefits: ['Calms the central nervous system', 'Improves sleep quality', 'Relieves chronic headaches'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Elakizhi (Herbal Leaf Poultice Massage)',
        slug: 'elakizhi-herbal-leaf-poultice',
        category: 'Therapeutic Massage',
        shortDescription: 'Fomentation massage using warm boluses packed with medicinal leaves and spices.',
        fullDescription: 'Therapeutic sweating treatment using herbal poultices dipped in warm medicated oils to treat swelling, stiffness, and joint pain.',
        durationMinutes: 60,
        recommendedDays: 14,
        indications: ['Arthritis pain', 'Spondylosis', 'Sports injuries', 'Muscular cramps'],
        benefits: ['Reduces joint inflammation', 'Relieves acute muscle pain', 'Enhances flexibility'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Kadi Vasthi (Spine Disc Care Therapy)',
        slug: 'kadi-vasthi-spine-care',
        category: 'Specialty Spine Care',
        shortDescription: 'Localized oil retention bath over lower lumbar spine to treat disc bulges.',
        fullDescription: 'A dough ring made of black gram flour is placed over the lower back, filled with warm medicated oil to nourish lumbar vertebrae and nerve roots.',
        durationMinutes: 45,
        recommendedDays: 7,
        indications: ['Sciatica', 'Lumbar disc hernia', 'Lower backache', 'Spinal stenosis'],
        benefits: ['Nourishes intervertebral discs', 'Relieves nerve compression', 'Strengthens lumbar muscles'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
    ]);

    console.log('6. Seeding Care Packages...');
    await CarePackage.create([
      {
        title: 'Panchakarma Rejuvenation Package',
        slug: 'panchakarma-rejuvenation-package',
        subtitle: '7 to 28 Days Deep Body Purification & Tissue Rejuvenation',
        durationDays: 14,
        assignedBranchIds: [kattakadaBranch._id],
        overview: 'Comprehensive 14-day inpatient detox package including daily doctor consultations, custom organic diet, full Panchakarma therapies, and stay in serene cottages.',
        inclusions: [
          'Daily Physician Consultations',
          '2 Classical Panchakarma Procedures Daily (Abhyangam, Shirodhara, Kizhi)',
          'Pure Doctor-Prescribed Organic Vegetarian Meals',
          'Private Cottage / AC Room Accommodation',
          'Yoga & Meditation Sessions',
        ],
        exclusions: ['Personal Laundry', 'Outside Diagnostic Lab Scans', 'Airport Pickup/Drop'],
        targetAilments: ['General Body Detox', 'Chronic Fatigue', 'Immunity Boost', 'Stress Relief'],
        price: 35000,
        isFeatured: true,
        status: 'ACTIVE',
      },
      {
        title: 'Spine & Joint Health Recovery Package',
        slug: 'spine-joint-health-recovery-package',
        subtitle: '14-Day Non-Surgical Spine & Joint Treatment Program',
        durationDays: 14,
        assignedBranchIds: [kattakadaBranch._id],
        overview: 'Specialized inpatient program targeting back pain, cervical spondylosis, sciatica, and osteoarthritis through Kadi Vasthi, Elakizhi, and herbal internal medicines.',
        inclusions: [
          'Specialist Spine Doctor Evaluation',
          'Kadi Vasthi / Janu Vasthi Daily',
          'Podikizhi & Abhyanga Therapies',
          'Ayurvedic Internal Herbal Medicines during stay',
          'Inpatient Room Accommodation',
        ],
        exclusions: ['MRI Scans', 'External Orthopedic Braces'],
        targetAilments: ['Lumbar Disc Hernia', 'Sciatica', 'Cervical Spondylosis', 'Knee Joint Degeneration'],
        price: 42000,
        isFeatured: true,
        status: 'ACTIVE',
      },
    ]);

    console.log('7. Seeding Ecosystem & Research Pillars...');
    await Ecosystem.create([
      {
        title: 'Medicinal Herbal Botanical Garden',
        slug: 'medicinal-herbal-botanical-garden',
        pillarType: 'herbal_garden',
        tagline: '500+ Rare Ayurvedic Medicinal Flora Cultivated On-Site',
        description: 'Spanning across our Kattakada hospital campus, our organic medicinal garden cultivates rare herbs used in fresh decoctions and kashayams prepared daily.',
        coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
        status: 'published',
      },
      {
        title: 'GMP Certified Herbal Pharmacy Unit',
        slug: 'gmp-certified-herbal-pharmacy-unit',
        pillarType: 'pharmacy_unit',
        tagline: 'In-House Production of 300+ Authentic Classical Formulations',
        description: 'Our state-of-the-art GMP certified pharmacy manufactures high-purity oils, kashayams, arishtams, and choornams following centuries-old Kerala Ayurvedic texts.',
        coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
        status: 'published',
      },
      {
        title: 'Clinical Research Center & Clinical Trials',
        slug: 'clinical-research-center-trials',
        pillarType: 'research_center',
        tagline: 'Evidence-Based Validation of Ayurvedic Protocols for Spine & Neuro Care',
        description: 'Documenting clinical efficacy and patient outcomes in non-surgical disc hernia management and post-stroke recovery.',
        coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
        status: 'published',
      },
      {
        title: 'Susrutha Ayurveda Academy',
        slug: 'susrutha-ayurveda-academy',
        pillarType: 'academy',
        tagline: 'Empowering Next Generation Practitioners & Panchakarma Therapists',
        description: 'Conducting certified Panchakarma technician training courses, clinical workshops, and international scholar immersion modules.',
        coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
        status: 'published',
      },
    ]);

    console.log('8. Seeding Video Gallery & Patient Stories...');
    await Video.create([
      {
        title: 'Patient Recovery Story — Severe Arthritis & Mobility Restoration',
        slug: 'patient-recovery-story-severe-arthritis',
        category: 'patient_story',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoHost: 'youtube',
        description: 'Watch how Mr. Nair regained full walking mobility after 21 days of inpatient Panchakarma treatment at our Kattakada hospital campus.',
        isFeatured: true,
        sortOrder: 1,
        status: 'published',
      },
      {
        title: 'Doctor Talk — Non-Surgical Management of Lumbar Disc Herniation',
        slug: 'doctor-talk-non-surgical-disc-herniation',
        category: 'doctor_talk',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoHost: 'youtube',
        description: 'Dr. Krishnakumar K explains how Kadi Vasthi and specialized herbal oils relieve sciatica nerve compression without surgery.',
        isFeatured: true,
        sortOrder: 2,
        status: 'published',
      },
      {
        title: 'Facility Tour — 40-Bed Hospital & Panchakarma Cottages at Kattakada',
        slug: 'facility-tour-40-bed-hospital-kattakada',
        category: 'facility_tour',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoHost: 'youtube',
        description: 'Take a virtual walkthrough of our lush green hospital campus, treatment suites, herbal garden, and organic dining hall.',
        isFeatured: true,
        sortOrder: 3,
        status: 'published',
      },
    ]);

    console.log('9. Seeding Photo Gallery Albums...');
    await GalleryAlbum.create([
      {
        title: 'Kattakada 40-Bed Inpatient Hospital Campus',
        slug: 'kattakada-40-bed-inpatient-hospital-campus',
        category: 'infrastructure',
        coverImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3',
        description: 'Photographs of our inpatient wards, private treatment cottages, reception lounge, and green surroundings.',
        mediaItems: [
          { url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3', caption: 'Hospital Front View', mediaType: 'image', sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d', caption: 'Panchakarma Therapy Suite', mediaType: 'image', sortOrder: 2 },
        ],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Ayurvedic Botanical Herbal Garden',
        slug: 'ayurvedic-botanical-herbal-garden',
        category: 'herbal_garden',
        coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
        description: 'Explore over 500 cultivated Ayurvedic medicinal plant species in our botanical sanctuary.',
        mediaItems: [
          { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae', caption: 'Medicinal Flora Section', mediaType: 'image', sortOrder: 1 },
        ],
        isFeatured: true,
        status: 'published',
      },
    ]);

    console.log('10. Seeding Accreditations & Affiliations...');
    await Affiliation.create([
      {
        title: 'NABH Accredited Ayurvedic Hospital',
        category: 'accreditation',
        logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
        issuingBody: 'National Accreditation Board for Hospitals & Healthcare Providers (NABH)',
        validityYear: '2026',
        description: 'National Accreditation Board for Hospitals & Healthcare Providers certification for high patient safety and clinical quality standards.',
        status: 'published',
      },
      {
        title: 'Ministry of AYUSH Government of India Recognized',
        category: 'accreditation',
        logoUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
        issuingBody: 'Ministry of AYUSH, Govt of India',
        validityYear: '2026',
        description: 'Empaneled and approved under Ministry of AYUSH clinical care guidelines.',
        status: 'published',
      },
      {
        title: 'Empaneled for Cashless Health Insurance & TPA Claims',
        category: 'certification',
        logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        issuingBody: 'All India Health Insurance TPAs',
        validityYear: '2026',
        description: 'Direct cashless treatment coverage with major health insurance companies and TPAs.',
        status: 'published',
      },
    ]);

    console.log('11. Seeding Press Releases & News Events...');
    await NewsEvent.create([
      {
        title: 'Susrutha Ayurveda Inaugurates Expanded 40-Bed Inpatient Campus at Kattakada',
        slug: 'susrutha-inaugurates-expanded-40-bed-campus',
        publisherName: 'The Hindu & Malayala Manorama',
        publicationType: 'press_release',
        articleUrl: 'https://thehindu.com',
        summary: 'Susrutha Ayurvedhik Hospital has expanded its inpatient capacity to 40 beds with dedicated Panchakarma suites and a botanical research unit in Trivandrum.',
        isFeatured: true,
        status: 'published',
      },
    ]);

    console.log('12. Seeding FAQs & Patient Knowledge Base...');
    await FAQ.create([
      {
        question: 'What is the recommended stay duration for inpatient Panchakarma?',
        answer: 'Classical Panchakarma programs typically range from 7, 14, to 21 days depending on individual health evaluation by our chief physicians.',
        category: 'PANCHAKARMA',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        question: 'Can I claim health insurance for Ayurvedic hospitalization?',
        answer: 'Yes, as an NABH-accredited hospital, inpatient treatments at Susrutha are eligible for health insurance reimbursement and cashless TPA approval.',
        category: 'INSURANCE',
        sortOrder: 2,
        status: 'ACTIVE',
      },
      {
        question: 'What facilities are included in the inpatient bed rooms?',
        answer: 'Our 40-bed inpatient campus features private AC cottages and non-AC rooms with attached bathrooms, doctor-prescribed organic meals, and 24x7 nursing care.',
        category: 'ADMISSION',
        sortOrder: 3,
        status: 'ACTIVE',
      },
    ]);

    console.log('13. Seeding Patient Testimonials...');
    await Testimonial.create([
      {
        patientName: 'K. R. Radhakrishnan',
        patientLocation: 'Trivandrum',
        treatmentReceived: 'Spine Disc Care & Kadi Vasthi',
        rating: 5,
        reviewText: 'I was suffering from severe sciatica and could barely walk. After 14 days of Kadi Vasthi and Panchakarma at Kattakada campus, my back pain is completely gone without surgery!',
        isFeatured: true,
        status: 'ACTIVE',
      },
      {
        patientName: 'Anjali Sharma',
        patientLocation: 'Dubai, UAE',
        treatmentReceived: 'Panchakarma Rejuvenation Package',
        rating: 5,
        reviewText: 'The serene environment, authentic Kerala oils, and care from Dr. Krishnakumar and therapists made my 14-day stay deeply rejuvenating. Highly recommend to everyone!',
        isFeatured: true,
        status: 'ACTIVE',
      },
    ]);

    console.log('14. Seeding Infrastructure Facilities...');
    await Infrastructure.create([
      {
        title: '40 Inpatient Hospital Beds & Private Cottages',
        category: 'ROOMS',
        branchId: kattakadaBranch._id,
        description: 'Well-ventilated private cottages and deluxe general rooms with 24x7 nursing support.',
        specifications: ['Attached Bathrooms', 'AC & Non-AC Options', 'Pure Organic Meals Delivered to Room'],
        capacity: 40,
        status: 'ACTIVE',
      },
      {
        title: '8 Private Panchakarma Therapy Suites',
        category: 'PANCHAKARMA_SUITES',
        branchId: kattakadaBranch._id,
        description: 'Equipped with traditional Neem wood Droni therapy tables and steam bath facilities.',
        specifications: ['Teak Wood Droni Beds', 'Attached Steam Bath Enclosure', 'Privacy & Hygiene Standard'],
        capacity: 8,
        status: 'ACTIVE',
      },
    ]);

    console.log('15. Seeding Health Blogs & Articles...');
    await Blog.create([
      {
        title: 'Ayurvedic Principles for Preventing Knee Joint Degeneration',
        slug: 'ayurvedic-principles-preventing-knee-joint-degeneration',
        category: 'Joint Health',
        authorName: 'Dr. Krishnakumar K.',
        excerpt: 'Learn how daily warm oil massage and Vata pacifying dietary choices preserve knee cartilage and joint lubrication.',
        content: 'Osteoarthritis occurs due to Vata dosha accumulation and depletion of Asthi-Majja Dhatus. Regular Abhyanga with Mahanarayana Thailam helps maintain joint fluid and flexibility...',
        tags: ['Arthritis', 'Joint Health', 'Ayurveda Tips'],
        isFeatured: true,
        status: 'PUBLISHED',
      },
    ]);

    console.log('16. Seeding Appointments & Inquiries...');
    await Appointment.create([
      {
        appointmentNumber: 'APT-2026-001',
        patientName: 'Najil Rahman',
        patientPhone: '+91 90486 49412',
        patientEmail: 'najilrahmanpm@gmail.com',
        branchId: kattakadaBranch._id,
        doctorId: doctor1._id,
        consultationType: 'OPD_INPERSON',
        preferredDate: new Date('2026-07-29'),
        preferredTimeSlot: '11:00 AM',
        symptomsNote: 'Severe lower back pain radiating to left leg for 3 months.',
        status: 'CONFIRMED',
      },
      {
        appointmentNumber: 'APT-2026-002',
        patientName: 'Suresh Varma',
        patientPhone: '+91 98470 12345',
        patientEmail: 'suresh.varma@gmail.com',
        branchId: kowdiarBranch._id,
        doctorId: doctor2._id,
        consultationType: 'OPD_INPERSON',
        preferredDate: new Date('2026-07-29'),
        preferredTimeSlot: '02:30 PM',
        symptomsNote: 'Cervical stiffness and morning numbness in fingers.',
        status: 'PENDING',
      },
      {
        appointmentNumber: 'APT-2026-003',
        patientName: 'Meera Nambiar',
        patientPhone: '+91 94471 98765',
        patientEmail: 'meera.nambiar@yahoo.com',
        branchId: kattakadaBranch._id,
        doctorId: doctor3._id,
        consultationType: 'IPD_ADMISSION',
        preferredDate: new Date('2026-07-30'),
        preferredTimeSlot: '10:00 AM',
        symptomsNote: 'Post-stroke motor rehabilitation consultation for hemiplegia recovery.',
        status: 'CONFIRMED',
      },
    ]);

    console.log('17. Seeding Patient Enquiries & Leads...');
    await Lead.create([
      {
        name: 'Ananthan Pillai',
        phone: '+91 97455 11223',
        email: 'ananthan.pillai@gmail.com',
        subject: 'Enquiry for 14-Day Panchakarma Package Admission',
        message: 'Looking for inpatient room availability for father suffering from chronic arthritis.',
        branchId: kattakadaBranch._id,
        source: 'WEBSITE_CONTACT',
        status: 'NEW',
      },
      {
        name: 'Dr. Priya Menon',
        phone: '+91 98950 44556',
        email: 'priya.menon@health.org',
        subject: 'Callback Request for Kowdiar OP Timings',
        message: 'Requesting callback regarding executive OPD consultation slots with Dr. Krishnakumar.',
        branchId: kowdiarBranch._id,
        source: 'HERO_CALLBACK',
        status: 'CONTACTED',
      },
    ]);

    console.log('16. Seeding Global Site Settings...');
    await Setting.create([
      {
        key: 'GENERAL_SETTINGS',
        value: {
          hospitalName: 'SUSRUTHA Ayurvedhik Hospital',
          tagline: 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus',
          foundedYear: 1986,
          lineageYear: 1970,
          emergencyHotline: '+91 96566 56736',
          whatsappNumber: '+91 96566 56736',
          mainEmail: 'info@susruthaayurveda.com',
        },
        description: 'Hospital name, tagline, hotline, and contact info',
        isSystem: true,
      },
      {
        key: 'ANNOUNCEMENT_BAR',
        value: {
          text: 'Authentic Kerala Panchakarma Admissions Open — 40-Bed Hospital Campus at Kattakada',
          link: '/packages',
          isEnabled: true,
        },
        description: 'Top header announcement banner text and link',
        isSystem: true,
      },
      {
        key: 'SOCIAL_LINKS',
        value: {
          facebook: 'https://facebook.com/susruthaayurveda',
          instagram: 'https://instagram.com/susruthaayurveda',
          youtube: 'https://youtube.com/@susruthaayurveda',
          whatsapp: 'https://wa.me/919656656736',
        },
        description: 'Official social media links',
        isSystem: true,
      },
    ]);

    console.log('17. Seeding Super Admin & System Roles...');
    const superAdminRole = await Role.create({
      name: 'SUPER_ADMIN',
      displayName: 'Super Administrator',
      description: 'Unrestricted full access across all hospital branches, CMS content, and system settings.',
      permissions: ['*'],
      isSystem: true,
    });

    const passwordHash = await bcrypt.hash('SusruthaAdmin2026!', 10);
    await User.create({
      name: 'Susrutha Super Admin',
      email: 'admin@susruthaayurveda.com',
      phone: '+91 96566 56736',
      passwordHash,
      roleId: superAdminRole._id,
      branchScope: 'GLOBAL',
      assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
      status: 'ACTIVE',
    });

    console.log('=====================================================');
    console.log('DATABASE SEEDING COMPLETE WITH RICH CONTENT ACROSS ALL MODELS!');
    console.log('Super Admin Login Credentials:');
    console.log('Email: admin@susruthaayurveda.com');
    console.log('Password: SusruthaAdmin2026!');
    console.log('=====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
