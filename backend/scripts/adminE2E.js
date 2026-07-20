require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});
const axios = require('axios');
const base = process.env.API_BASE || 'http://localhost:5000/api/v1';

(async () => {
  try {
    const adminEmail = 'admin@local.test';
    const adminPass = 'AdminPass123!';
    console.log('Logging in as admin', adminEmail);
    const loginRes = await axios.post(`${base}/auth/login`, {
      email: adminEmail,
      password: adminPass,
    });
    const token =
      loginRes.data && loginRes.data.data && loginRes.data.data.token;
    if (!token) throw new Error('No token from login');
    const headers = { Authorization: `Bearer ${token}` };

    // Create student
    const stuEmail = `student.e2e+${Date.now()}@example.com`;
    const roll = 'R' + Date.now().toString().slice(-6);
    const studentRes = await axios.post(
      `${base}/students`,
      {
        name: 'E2E Student',
        email: stuEmail,
        rollNumber: roll,
        department: 'CS',
        year: 2,
      },
      { headers }
    );
    console.log('STUDENT_CREATE', studentRes.data.message || studentRes.data);
    const studentId = studentRes.data.data._id;

    // Update student
    const studentUpdate = await axios.put(
      `${base}/students/${studentId}`,
      { name: 'E2E Student Updated' },
      { headers }
    );
    console.log(
      'STUDENT_UPDATE',
      studentUpdate.data.message || studentUpdate.data
    );

    // Create staff
    const staffEmail = `staff.e2e+${Date.now()}@example.com`;
    const staffRes = await axios.post(
      `${base}/staff`,
      { name: 'E2E Staff', email: staffEmail, role: 'faculty' },
      { headers }
    );
    console.log('STAFF_CREATE', staffRes.data.message || staffRes.data);
    const staffId = staffRes.data.data._id;

    // Update staff
    const staffUpdate = await axios.put(
      `${base}/staff/${staffId}`,
      { name: 'E2E Staff Updated' },
      { headers }
    );
    console.log('STAFF_UPDATE', staffUpdate.data.message || staffUpdate.data);

    // Ensure project type exists (create if missing)
    const typesRes = await axios.get(`${base}/projects/types`, { headers });
    let ptype = ((typesRes.data && typesRes.data.data) || []).find(
      (t) => t.name === 'E2E Type'
    );
    if (!ptype) {
      const ptypeRes = await axios.post(
        `${base}/projects/types`,
        {
          name: 'E2E Type',
          description: 'E2E project type',
          duration: '6 weeks',
          maxStudents: 4,
          category: 'Software',
        },
        { headers }
      );
      ptype = ptypeRes.data.data;
      console.log(
        'PROJECT_TYPE_CREATE',
        ptypeRes.data.message || ptypeRes.data
      );
    } else {
      console.log('PROJECT_TYPE_EXISTS', ptype.name);
    }
    const ptypeId = ptype._id;

    // Create project
    const projRes = await axios.post(
      `${base}/projects`,
      { title: 'E2E Project', description: 'desc', type: ptypeId },
      { headers }
    );
    console.log('PROJECT_CREATE', projRes.data.message || projRes.data);
    const projId = projRes.data.data._id;

    // Update project (non-fatal)
    try {
      const projU = await axios.put(
        `${base}/projects/${projId}`,
        { description: 'updated' },
        { headers }
      );
      console.log('PROJECT_UPDATE', projU.data.message || projU.data);
    } catch (e) {
      console.warn(
        'PROJECT_UPDATE_FAILED',
        e.response ? e.response.data || e.response.status : e.message
      );
    }

    // Create course (assign to staff) required for assignments
    const courseCode = 'C' + Date.now().toString().slice(-6);
    const courseRes = await axios.post(
      `${base}/courses`,
      { name: 'E2E Course', code: courseCode, faculty: staffId },
      { headers }
    );
    console.log('COURSE_CREATE', courseRes.data.message || courseRes.data);
    const courseId = courseRes.data.data._id;

    // Create assignment (requires course)
    const due = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
    const asgRes = await axios.post(
      `${base}/assignments`,
      {
        title: 'E2E Assignment',
        description: 'desc',
        dueDate: due,
        course: courseId,
      },
      { headers }
    );
    console.log('ASSIGNMENT_CREATE', asgRes.data.message || asgRes.data);
    const asgId = asgRes.data.data._id;

    // Update assignment
    const asgU = await axios.put(
      `${base}/assignments/${asgId}`,
      { title: 'E2E Assignment Updated' },
      { headers }
    );
    console.log('ASSIGNMENT_UPDATE', asgU.data.message || asgU.data);

    // Dashboard stats
    const dash = await axios.get(`${base}/analytics/dashboard`, { headers });
    console.log('DASHBOARD', dash.data.message || 'OK');

    // Users count
    const users = await axios.get(`${base}/users`, { headers });
    console.log(
      'USERS_COUNT',
      Array.isArray(users.data.data) ? users.data.data.length : 'unknown'
    );

    // Cleanup: delete created records
    if (studentId) {
      await axios.delete(`${base}/students/${studentId}`, { headers });
      console.log('STUDENT_DELETED');
    }
    if (staffId) {
      await axios.delete(`${base}/staff/${staffId}`, { headers });
      console.log('STAFF_DELETED');
    }
    if (projId) {
      await axios.delete(`${base}/projects/${projId}`, { headers });
      console.log('PROJECT_DELETED');
    }
    if (asgId) {
      await axios.delete(`${base}/assignments/${asgId}`, { headers });
      console.log('ASSIGNMENT_DELETED');
    }
    if (courseId) {
      await axios.delete(`${base}/courses/${courseId}`, { headers });
      console.log('COURSE_DELETED');
    }

    console.log('Admin E2E completed successfully');
    process.exit(0);
  } catch (err) {
    console.error(
      'Admin E2E error:',
      err.response ? err.response.data || err.response.status : err.message
    );
    process.exit(2);
  }
})();
