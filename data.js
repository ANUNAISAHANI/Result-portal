// =============================================
//  HARIDWAR UNIVERSITY — STUDENT DATA
//  Fixed: complete return + force-reset broken cache
// =============================================

const studentsData = Array.from({length: 50}, (_, i) => {
  const roll_no = `2024${String(i+1).padStart(3, '0')}`;
  const password = roll_no.slice(-4);

  const names = [
    'Aaradhya','Ananya','Saanvi','Mahira','Aman',
    'Advika','Mohan','Diya','Kayra','Karan',
    'Mishika','Ruhi','Aanya','Shanaya','Vamika',
    'Ahana','Naisha','Ishanvi','Vyomika','Sara',
    'Rida','Parina','Zara','Mayra','Yashvi',
    'Aarav','Vihaan','Advait','Aryan','Kabir',
    'Ishaan','Kiaan','Dhruv','Ayaan','Rudra',
    'Shivansh','Naksh','Advik','Reyansh','Arth',
    'Divit','Atharv','Jash','Vivaan','Golu Kumar',
    'Ravi Kumar','Pratik Maurya','Abhijeet Singh','Rahul Kumar','Rishi'
  ];

  const fatherNames = [
    'Rajesh Sharma','Suresh Verma','Mohan Lal','Anil Kumar','Rakesh Singh',
    'Vinod Gupta','Sunil Yadav','Ramesh Mishra','Dinesh Tiwari','Mahesh Joshi',
    'Naresh Pandey','Umesh Chandra','Kamlesh Dubey','Ganesh Prasad','Harish Negi',
    'Prakash Rawat','Devesh Bhatt','Lokesh Bajpai','Mukesh Saxena','Vivek Srivastava',
    'Rizwan Khan','Farhan Ansari','Salman Sheikh','Imran Qureshi','Akram Ali',
    'Santosh Pal','Rajendra Thakur','Bhupesh Chauhan','Yogesh Trivedi','Pradeep Maurya',
    'Virendra Nath','Brijesh Gautam','Ashok Sahu','Deepak Shukla','Ajay Dwivedi',
    'Sanjay Tripathi','Vijay Dixit','Manoj Awasthi','Alok Tomar','Pankaj Misra',
    'Ramakant Rao','Surendra Yadav','Harender Singh','Mahendra Kumar','Rajeev Soni',
    'Nagendra Prasad','Devendra Gupta','Bharat Lal','Ratan Kumar','Kailash Nath'
  ];

  const sections = [
    'A','A','B','B','C','C','D','A','B','C',
    'D','A','B','C','D','A','B','C','D','A',
    'B','C','D','A','B','A','A','B','B','C',
    'C','D','D','A','B','C','C','D','D','A',
    'B','C','D','A','B','C','D','C','D','A'
  ];

  // Fixed marks (no Math.random) — same every time, no stale cache issues
  const seedMarks = [
    [85,78,82,88,79,91],[88,92,76,84,90,87],[72,68,74,70,65,78],[91,85,88,94,89,92],[63,58,71,67,72,60],
    [84,79,86,81,88,83],[77,82,75,79,84,80],[93,87,90,95,88,94],[69,73,66,71,68,74],[86,91,83,88,92,85],
    [78,74,80,76,82,79],[90,86,88,92,87,91],[82,77,84,79,85,81],[95,89,92,97,90,93],[71,67,73,69,75,70],
    [87,82,89,84,90,86],[76,80,73,77,82,78],[92,88,91,94,89,93],[83,78,85,80,86,82],[96,90,93,98,91,95],
    [74,69,76,72,78,73],[89,84,87,91,86,90],[80,75,82,77,83,79],[93,89,91,95,90,94],[85,80,87,83,88,84],
    [70,65,72,68,74,69],[88,83,86,90,85,89],[75,79,72,76,81,77],[91,87,89,93,88,92],[66,61,68,64,70,65],
    [84,79,82,86,81,85],[73,77,70,74,79,75],[90,86,88,92,87,91],[67,63,69,65,71,66],[87,82,85,89,84,88],
    [76,80,73,77,82,78],[93,89,91,95,90,94],[68,64,70,66,72,67],[86,81,84,88,83,87],[79,83,76,80,85,81],
    [92,88,90,94,89,93],[71,67,73,69,75,70],[85,80,83,87,82,86],[78,82,75,79,84,80],[63,59,65,61,67,62],
    [89,85,87,91,86,90],[72,68,74,70,76,71],[94,90,92,96,91,95],[65,61,67,63,69,64],[88,84,86,90,85,89]
  ];

  const marks = seedMarks[i];

  return {
    roll_no:     roll_no,
    password:    password,
    name:        names[i],
    father_name: fatherNames[i],
    class:       'BTech',
    section:     sections[i],
    exam_type:   'Final',
    subjects: [
      {name: 'Theory of Automata',  marks_obtained: marks[0], total_marks: 100, pass_marks: 40},
      {name: 'Web Technology',       marks_obtained: marks[1], total_marks: 100, pass_marks: 40},
      {name: 'Design Algorithm',     marks_obtained: marks[2], total_marks: 100, pass_marks: 40},
      {name: 'Aptitude',             marks_obtained: marks[3], total_marks: 100, pass_marks: 40},
      {name: 'Software Engineering', marks_obtained: marks[4], total_marks: 100, pass_marks: 40},
      {name: 'Python with ML',       marks_obtained: marks[5], total_marks: 100, pass_marks: 40}
    ]
  };
});

// ── Auto-reset localStorage if it contains broken/old data ──
(function resetIfBroken() {
  try {
    const raw = localStorage.getItem('studentsData');
    if (!raw) {
      localStorage.setItem('studentsData', JSON.stringify(studentsData));
      console.log('✅ First visit — data saved.');
      return;
    }
    const saved = JSON.parse(raw);
    const first = saved[0];
    // Broken if missing exam_type, subjects, or roll_no
    if (!first || !first.exam_type || !first.subjects || !first.roll_no) {
      localStorage.setItem('studentsData', JSON.stringify(studentsData));
      console.warn('⚠️ Old broken data detected — auto-reset done!');
    } else {
      console.log('✅ localStorage OK —', saved.length, 'students loaded.');
    }
  } catch(e) {
    localStorage.setItem('studentsData', JSON.stringify(studentsData));
    console.warn('⚠️ localStorage error — reset done.');
  }
})();

window.originalStudentsData = studentsData;
