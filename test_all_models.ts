const API_URL = 'http://localhost:5000/api/v1/admin';

async function request(endpoint: string, method: string = 'GET', body?: any, token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    const error: any = new Error(`Request failed with status ${res.status}: ${data.message || JSON.stringify(data)}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function testAllModels() {
  console.log('=== STARTING ALL-MODELS CRUD & VERIFICATION TEST ===\n');

  try {
    // 1. Authenticate as Super Admin
    console.log('1. Testing Login...');
    const loginRes = await request('/auth/login', 'POST', {
      email: 'admin@susruthaayurveda.com',
      password: 'SusruthaAdmin2026!',
    });
    const token = loginRes.data.token;
    console.log('✓ Login Successful! Received Bearer Token.');

    // 2. Create Branch
    console.log('\n2. Testing Branch (Create & Update)...');
    const branchRes = await request('/branches', 'POST', {
      name: 'Susrutha Trivandrum Main Hospital',
      code: 'TVM',
      type: 'INPATIENT_HOSPITAL',
      tagline: '40-Bed Panchakarma Hospital',
      address: { street: 'Main Hospital Road', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695001' },
      contact: { phone: ['+91 96566 56736'], email: 'tvm@susruthaayurveda.com' },
      opdTimings: '09:00 AM - 07:00 PM',
      bedCapacity: 40,
      features: ['OPD', 'IPD', 'Pharmacy'],
      isMainBranch: true,
      status: 'ACTIVE',
    }, token);
    const branchId = branchRes.data._id;
    console.log(`✓ Branch Created: ID ${branchId}`);

    await request(`/branches/${branchId}`, 'PUT', {
      tagline: 'Updated 40-Bed Panchakarma Hospital Campus',
    }, token);
    console.log('✓ Branch Updated successfully.');

    // 3. Create Department
    console.log('\n3. Testing Department (Create & Update)...');
    const deptRes = await request('/departments', 'POST', {
      title: 'Panchakarma & Bio-Purification',
      code: 'D101',
      tagline: 'Kerala Ayurvedic Detoxification',
      overview: 'Comprehensive Kerala Ayurvedic protocols under senior physicians.',
      status: 'ACTIVE',
    }, token);
    const deptId = deptRes.data._id;
    console.log(`✓ Department Created: ID ${deptId}`);

    await request(`/departments/${deptId}`, 'PUT', {
      overview: 'Updated overview for Panchakarma.',
    }, token);
    console.log('✓ Department Updated successfully.');

    // 4. Create Doctor
    console.log('\n4. Testing Doctor (Create & Update)...');
    const docRes = await request('/doctors', 'POST', {
      name: 'Dr. Krishnakumar Varma',
      designation: 'Chief Medical Officer',
      qualifications: 'BAMS, MD (Ayurveda)',
      experienceYears: 20,
      registrationNumber: 'TCMC/AYU/12045',
      departmentId: deptId,
      assignedBranchIds: [branchId],
      bio: 'Senior physician specializing in Panchakarma.',
      consultationFee: 500,
      specialties: ['Panchakarma', 'Internal Medicine'],
      languagesSpoken: ['Malayalam', 'English'],
      isDirector: true,
      isFeatured: true,
      status: 'ACTIVE',
    }, token);
    const docId = docRes.data._id;
    console.log(`✓ Doctor Created: ID ${docId}`);

    await request(`/doctors/${docId}`, 'PUT', {
      consultationFee: 600,
    }, token);
    console.log('✓ Doctor Updated successfully.');

    // 5. Create Condition
    console.log('\n5. Testing Condition (Create & Update)...');
    const condRes = await request('/conditions', 'POST', {
      title: 'Rheumatoid & Osteoarthritis',
      category: 'Joint & Spine',
      shortDescription: 'Ayurvedic non-surgical protocol for arthritis.',
      fullDescription: 'Comprehensive inpatient and outpatient care.',
      symptoms: ['Joint Pain', 'Stiffness'],
      assignedBranchIds: [branchId],
      isFeatured: true,
      status: 'published',
    }, token);
    const condId = condRes.data._id;
    console.log(`✓ Condition Created: ID ${condId}`);

    await request(`/conditions/${condId}`, 'PUT', {
      shortDescription: 'Updated short description.',
    }, token);
    console.log('✓ Condition Updated successfully.');

    // 6. Create Treatment
    console.log('\n6. Testing Treatment (Create & Update)...');
    const treatRes = await request('/treatments', 'POST', {
      title: 'Abhyangam (Warm Oil Massage)',
      category: 'Panchakarma',
      shortDescription: 'Classical Ayurvedic oil massage.',
      fullDescription: 'Traditional body therapy.',
      durationMinutes: 60,
      recommendedDays: 7,
      indications: ['Vata imbalance', 'Fatigue'],
      benefits: ['Improves circulation'],
      assignedBranchIds: [branchId],
      isFeatured: true,
      status: 'published',
    }, token);
    const treatId = treatRes.data._id;
    console.log(`✓ Treatment Created: ID ${treatId}`);

    await request(`/treatments/${treatId}`, 'PUT', {
      durationMinutes: 75,
    }, token);
    console.log('✓ Treatment Updated successfully.');

    // 7. Create Care Package
    console.log('\n7. Testing Care Package (Create & Update)...');
    const pkgRes = await request('/packages', 'POST', {
      title: '7-Day Panchakarma Rejuvenation',
      subtitle: 'Inpatient Recovery & Detox Program',
      durationDays: 7,
      assignedBranchIds: [branchId],
      overview: 'Complete 7-day inpatient package.',
      inclusions: ['Consultations', 'Therapies', 'Diet'],
      price: 25000,
      discountedPrice: 22000,
      isFeatured: true,
      status: 'ACTIVE',
    }, token);
    const pkgId = pkgRes.data._id;
    console.log(`✓ Care Package Created: ID ${pkgId}`);

    await request(`/packages/${pkgId}`, 'PUT', {
      price: 26000,
    }, token);
    console.log('✓ Care Package Updated successfully.');

    // 8. Create Infrastructure / Facility
    console.log('\n8. Testing Infrastructure (Create & Update)...');
    const infraRes = await request('/infrastructure', 'POST', {
      title: 'Panchakarma Detox Suite #1',
      category: 'PANCHAKARMA_SUITES',
      branchId: branchId,
      description: 'Traditional Wooden Droni therapy suite.',
      capacity: 2,
      status: 'ACTIVE',
    }, token);
    const infraId = infraRes.data._id;
    console.log(`✓ Infrastructure Created: ID ${infraId}`);

    await request(`/infrastructure/${infraId}`, 'PUT', {
      capacity: 3,
    }, token);
    console.log('✓ Infrastructure Updated successfully.');

    // 9. Create Blog
    console.log('\n9. Testing Blog (Create & Update)...');
    const blogRes = await request('/blogs', 'POST', {
      title: 'Understanding Panchakarma Detox',
      category: 'Panchakarma',
      author: 'Dr. Krishnakumar Varma',
      readTime: '5 min read',
      excerpt: 'Dietary and lifestyle tips for Panchakarma.',
      content: 'Detailed explanation of Panchakarma therapies...',
      branchCode: 'TVM',
      status: 'PUBLISHED',
    }, token);
    const blogId = blogRes.data._id;
    console.log(`✓ Blog Created: ID ${blogId}`);

    await request(`/blogs/${blogId}`, 'PUT', {
      readTime: '6 min read',
    }, token);
    console.log('✓ Blog Updated successfully.');

    // 10. Create Testimonial
    console.log('\n10. Testing Testimonial (Create & Update)...');
    const testRes = await request('/testimonials', 'POST', {
      patientName: 'John Doe',
      patientLocation: 'Trivandrum',
      treatmentReceived: 'Abhyangam',
      rating: 5,
      reviewText: 'Excellent treatment experience!',
      isFeatured: true,
      status: 'ACTIVE',
    }, token);
    const testId = testRes.data._id;
    console.log(`✓ Testimonial Created: ID ${testId}`);

    await request(`/testimonials/${testId}`, 'PUT', {
      rating: 5,
    }, token);
    console.log('✓ Testimonial Updated successfully.');

    // 11. Create Ecosystem
    console.log('\n11. Testing Ecosystem (Create & Update)...');
    const ecoRes = await request('/ecosystem', 'POST', {
      title: 'Herbal Garden Research Center',
      pillarType: 'herbal_garden',
      tagline: 'Organic Cultivation',
      description: 'Cultivating authentic medicinal herbs.',
      status: 'published',
    }, token);
    const ecoId = ecoRes.data._id;
    console.log(`✓ Ecosystem Created: ID ${ecoId}`);

    await request(`/ecosystem/${ecoId}`, 'PUT', {
      tagline: 'Updated Organic Cultivation Tagline',
    }, token);
    console.log('✓ Ecosystem Updated successfully.');

    // 12. Create Video
    console.log('\n12. Testing Video (Create & Update)...');
    const vidRes = await request('/videos', 'POST', {
      title: 'Hospital Tour & Care Overview',
      category: 'facility_tour',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoHost: 'youtube',
      description: 'A complete walk-through of Susrutha Hospital.',
      isFeatured: true,
      status: 'published',
    }, token);
    const vidId = vidRes.data._id;
    console.log(`✓ Video Created: ID ${vidId}`);

    await request(`/videos/${vidId}`, 'PUT', {
      description: 'Updated video description.',
    }, token);
    console.log('✓ Video Updated successfully.');

    // 13. Create Gallery Album
    console.log('\n13. Testing Gallery Album (Create & Update)...');
    const galRes = await request('/gallery', 'POST', {
      title: 'Campus Overview Gallery',
      category: 'infrastructure',
      description: 'High-res photos of the hospital campus.',
      mediaItems: [{ url: 'https://example.com/photo.jpg', caption: 'Main Gate', mediaType: 'image', sortOrder: 1 }],
      isFeatured: true,
      status: 'published',
    }, token);
    const galId = galRes.data._id;
    console.log(`✓ Gallery Created: ID ${galId}`);

    await request(`/gallery/${galId}`, 'PUT', {
      description: 'Updated gallery description.',
    }, token);
    console.log('✓ Gallery Updated successfully.');

    // 14. Create Affiliation
    console.log('\n14. Testing Affiliation (Create & Update)...');
    const affRes = await request('/affiliations', 'POST', {
      title: 'NABH Accreditation Board',
      category: 'accreditation',
      issuingBody: 'National Accreditation Board',
      validityYear: '2026',
      description: 'Accreditation for hospital quality standards.',
      status: 'published',
    }, token);
    const affId = affRes.data._id;
    console.log(`✓ Affiliation Created: ID ${affId}`);

    await request(`/affiliations/${affId}`, 'PUT', {
      validityYear: '2027',
    }, token);
    console.log('✓ Affiliation Updated successfully.');

    // 15. Create News Event
    console.log('\n15. Testing News Event (Create & Update)...');
    const newsRes = await request('/news-events', 'POST', {
      title: 'Expansion of Inpatient Panchakarma Center',
      type: 'press_release',
      publisherName: 'The Hindu',
      summary: 'Susrutha opens new 40-bed facility.',
      content: 'Full press report on new facility...',
      isFeatured: true,
      status: 'published',
    }, token);
    const newsId = newsRes.data._id;
    console.log(`✓ News Event Created: ID ${newsId}`);

    await request(`/news-events/${newsId}`, 'PUT', {
      summary: 'Updated summary for press release.',
    }, token);
    console.log('✓ News Event Updated successfully.');

    // 16. Create FAQ
    console.log('\n16. Testing FAQ (Create & Update)...');
    const faqRes = await request('/faqs', 'POST', {
      question: 'What are the admission rules for Panchakarma?',
      answer: 'Patients are evaluated by a senior Vaidya prior to admission.',
      category: 'PANCHAKARMA',
      sortOrder: 1,
      status: 'ACTIVE',
    }, token);
    const faqId = faqRes.data._id;
    console.log(`✓ FAQ Created: ID ${faqId}`);

    await request(`/faqs/${faqId}`, 'PUT', {
      sortOrder: 2,
    }, token);
    console.log('✓ FAQ Updated successfully.');

    // 17. Create User & Role
    console.log('\n17. Testing Role & User (Create & Update)...');
    const roleRes = await request('/roles', 'POST', {
      name: 'CONTENT_MANAGER',
      displayName: 'Content Manager',
      description: 'Manages blogs, news, gallery and videos.',
      permissions: ['blogs:write', 'news:write'],
      status: 'ACTIVE',
    }, token);
    const roleId = roleRes.data._id;
    console.log(`✓ Role Created: ID ${roleId}`);

    const userRes = await request('/users', 'POST', {
      name: 'Test Staff User',
      email: 'staff@susruthaayurveda.com',
      phone: '+91 9876543210',
      password: 'Password123!',
      roleId: roleId,
      status: 'ACTIVE',
    }, token);
    const userId = userRes.data._id;
    console.log(`✓ User Created: ID ${userId}`);

    // 18. Create Appointment
    console.log('\n18. Testing Appointment (Create & Update)...');
    const apptRes = await request('/appointments', 'POST', {
      patientName: 'Jane Smith',
      patientPhone: '+91 94471 99999',
      patientEmail: 'janesmith@gmail.com',
      branchId: branchId,
      doctorId: docId,
      consultationType: 'OPD_INPERSON',
      preferredDate: '2026-08-01',
      preferredTimeSlot: '10:00 AM',
      symptomsNote: 'Back pain consultation',
      status: 'PENDING',
    }, token);
    const apptId = apptRes.data._id;
    console.log(`✓ Appointment Created: ID ${apptId}`);

    await request(`/appointments/${apptId}`, 'PUT', {
      status: 'CONFIRMED',
    }, token);
    console.log('✓ Appointment Updated successfully.');

    // 19. Create Lead
    console.log('\n19. Testing Lead (Create & Update)...');
    const leadRes = await request('/leads', 'POST', {
      name: 'Robert Brown',
      phone: '+91 98950 12345',
      email: 'robert@example.com',
      subject: 'Panchakarma Package Inquiry',
      message: 'Requesting details about 7-day inpatient package.',
      branchId: branchId,
      source: 'WEBSITE_CONTACT',
      status: 'NEW',
    }, token);
    const leadId = leadRes.data._id;
    console.log(`✓ Lead Created: ID ${leadId}`);

    await request(`/leads/${leadId}`, 'PUT', {
      status: 'CONTACTED',
    }, token);
    console.log('✓ Lead Updated successfully.');

    // 20. Update Settings
    console.log('\n20. Testing Settings Update...');
    await request('/settings/GENERAL_SETTINGS', 'PUT', {
      value: {
        hospitalName: 'SUSRUTHA Ayurvedhik Hospital & Research Center',
        tagline: 'Research-backed authentic Kerala Ayurveda hospital campus',
        foundedYear: 1986,
        lineageYear: 1970,
        emergencyHotline: '+91 96566 56736',
        whatsappNumber: '+91 96566 56736',
        mainEmail: 'info@susruthaayurveda.com',
      },
    }, token);
    console.log('✓ Settings Updated successfully.');

    console.log('\n=====================================================');
    console.log('ALL API ENDPOINTS PASSED FOR ALL 20 MODELS SUCCESSFULLY!');
    console.log('=====================================================');
  } catch (error: any) {
    console.error('\n❌ ERROR OCCURRED DURING MODEL TEST:');
    if (error.data) {
      console.error('Status:', error.status);
      console.error('Data:', JSON.stringify(error.data, null, 2));
    } else {
      console.error('Error message:', error.message);
    }
  }
}

testAllModels();
