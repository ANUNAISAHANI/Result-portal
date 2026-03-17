// FIXED RESULT SCRIPT - New students + Delete + Father Name
document.addEventListener('DOMContentLoaded', function () {
  const resultForm = document.getElementById('resultSearchForm');
  if (resultForm) {
    resultForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const rollNo = document.getElementById('roll_no').value.trim();
      const examType = document.getElementById('exam_type').value;
      const btn = resultForm.querySelector('.btn-search');
      const errorBox = document.getElementById('errorBox');
      const resultCard = document.getElementById('resultCard');
      const demoHint = document.getElementById('demoHint');

      // Reset
      errorBox.style.display = 'none';
      resultCard.style.display = 'none';
      demoHint.style.display = 'block';
      btn.textContent = '🔍 Searching...';
      btn.disabled = true;

  if (!rollNo || !/^2024\d{3}$/.test(rollNo) || examType !== 'Final') {
        showSearchError('Enter 7-digit roll (2024001)');
        resetBtn(btn);
        return;
      }

      // Get data: localStorage > data.js
let searchData = JSON.parse(localStorage.getItem('studentsData') || '[]');
  // Fallback to original if localStorage empty/corrupted
  if (searchData.length === 0) {
    searchData = typeof studentsData !== 'undefined' ? studentsData : [];
  }

      const studentObj = searchData.find(s => s.roll_no === rollNo);
      if (!studentObj || !studentObj.subjects) {
        showSearchError(`No result for <strong>${rollNo}</strong>`);
        resetBtn(btn);
        return;
      }

      // Calculate
      const subjects = [];
      let totalObtained = 0, totalMax = 0, passOverall = true;
      studentObj.subjects.forEach(s => {
        const pct = (s.marks_obtained / s.total_marks * 100).toFixed(1);
        const grade = getGrade(pct);
        const pass = s.marks_obtained >= s.pass_marks;
        if (!pass) passOverall = false;
        subjects.push({name: s.name, obtained: s.marks_obtained, total: s.total_marks, pass_marks: s.pass_marks, pct, grade, pass});
        totalObtained += s.marks_obtained;
        totalMax += s.total_marks;
      });

      const percentage = (totalObtained / totalMax * 100).toFixed(1);
      const overallGrade = getGrade(percentage);
      
      resultCard.innerHTML = `
        <div class="rc-header" style="position:relative;">
            <div style="position:absolute;top:24px;right:24px;background:linear-gradient(135deg,#3b82f6,#60a5fa);color:#fff;padding:16px 20px;border-radius:12px;box-shadow:0 12px 32px rgba(59,130,246,0.5);min-width:140px;text-align:center;font-family:'Bebas Neue',sans-serif;z-index:1;">
            <div style="font-size:0.65rem;color:#bfdbfe;font-weight:700;letter-spacing:1.5px;margin-bottom:4px;">ROLL NO</div>
            <div style="font-size:1.9rem;font-weight:900;letter-spacing:2px;">${rollNo}</div>
          </div>
          <div class="rc-name" style="font-size:2.8rem;font-weight:800;letter-spacing:3px;margin-bottom:8px;line-height:1;">${studentObj.name}</div>
          <div style="font-size:1.3rem;font-weight:600;color:var(--text);letter-spacing:1.5px;margin-bottom:8px;">Father: <strong>${studentObj.father_name || 'N/A'}</strong></div>
          <div style="font-size:0.9rem;color:var(--primary);letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:24px;border-bottom:2px solid rgba(245,158,11,0.3);padding-bottom:12px;">HARIDWAR UNIVERSITY — Final Semester 2025-26</div>
          <div style="font-size:1.1rem;font-weight:500;color:var(--text);letter-spacing:1px;">Course ${studentObj.class || 'BTech'} | Section ${studentObj.section || 'D'}</div>
        </div>
        <div class="rc-body">
          <table class="marks-table">
            <thead><tr><th>Subject</th><th>Obtained</th><th>Max</th><th>Pass</th><th>Grade</th><th>Status</th></tr></thead>
            <tbody>${subjects.map(s => `<tr><td>${s.name}</td><td><strong>${s.obtained}</strong></td><td>${s.total}</td><td>${s.pass_marks}</td><td><span class="grade-badge ${s.grade.class}">${s.grade.letter}</span></td><td>${s.pass?'<span style="color:var(--success)">✔ Pass</span>':'<span style="color:var(--danger)">✘ Fail</span>'}</td></tr>`).join('')}</tbody>
          </table>
          <div class="rc-summary">
            <div class="summary-box"><div class="summary-label">Total</div><div class="summary-value">${totalObtained}/${totalMax}</div></div>
            <div class="summary-box"><div class="summary-label">%</div><div class="summary-value">${percentage}%</div></div>
            <div class="summary-box"><div class="summary-label">Grade</div><div class="summary-value">${overallGrade.letter}</div></div>
          </div>
          <div class="verdict ${passOverall ? 'pass' : 'fail'}">
            ${passOverall ? `✔ PASS — ${overallGrade.letter}` : `✘ FAIL`}
          </div>
          <button class="btn-print" onclick="window.print()">🖨️ Print PDF</button>

        </div>`;
      
      resultCard.style.display = 'block';
      demoHint.style.display = 'none';
      resetBtn(btn);
    });
  }

  window.removeStudent = function(rollNo) {
    if (confirm(`Delete ${rollNo}? This cannot be undone!`)) {
      let data = JSON.parse(localStorage.getItem('studentsData') || '[]');
      data = data.filter(s => s.roll_no !== rollNo);
      localStorage.setItem('studentsData', JSON.stringify(data));
      alert('✅ Deleted! Reload page.');
      location.reload();
    }
  };

  window.editStudent = function(rollNo) {
    const name = prompt('Edit Name:');
    const father = prompt('Edit Father Name:');
    if (name) {
      let data = JSON.parse(localStorage.getItem('studentsData') || '[]');
      const student = data.find(s => s.roll_no === rollNo);
      if (student) {
        student.name = name;
        student.father_name = father || student.father_name;
        localStorage.setItem('studentsData', JSON.stringify(data));
        location.reload();
      }
    }
  };

  function getGrade(pct) {
    if (pct >= 90) return {letter: 'A+', class: 'grade-A'};
    if (pct >= 80) return {letter: 'A', class: 'grade-A'};
    if (pct >= 70) return {letter: 'B', class: 'grade-B'};
    if (pct >= 60) return {letter: 'C', class: 'grade-C'};
    if (pct >= 50) return {letter: 'D', class: 'grade-D'};
    return {letter: 'F', class: 'grade-F'};
  }

  function showSearchError(msg) {
    document.getElementById('errorBox').innerHTML = `⚠️ ${msg}`;
    document.getElementById('errorBox').style.display = 'block';
  }

  function resetBtn(btn) {
    btn.textContent = '🔍 View Result';
    btn.disabled = false;
  }

  console.log('✅ Exam Result Portal - Add/Edit/Delete + Father Name!');
});