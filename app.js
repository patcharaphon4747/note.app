const auth = firebase.auth();

const userNameEl = document.getElementById("user-name");
const logoutLink = document.getElementById("logout-link");
const notification = document.getElementById("notification");

const noteDate = document.getElementById("note-date");
const noteColor = document.getElementById("note-color");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const saveNoteBtn = document.getElementById("save-note-btn");
const searchInput = document.getElementById("search");
const noteList = document.getElementById("note-list");

function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// ตรวจสอบสถานะล็อกอิน
auth.onAuthStateChanged(user => {
  if (user) {
    userNameEl.textContent = `👤 ${user.displayName}`;
    renderNotes();
  } else {
    window.location.href = "index.html";
  }
});

// ฟังก์ชันบันทึกโน้ตลง localStorage
function saveNote() {
  if (!noteTitle.value.trim()) {
    showNotification("กรุณากรอกชื่อโน้ตก่อนนะครับ 😊");
    return;
  }

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const newNote = {
    id: Date.now(),
    date: noteDate.value || new Date().toISOString().split("T")[0],
    color: noteColor.value,
    title: noteTitle.value.trim(),
    content: noteContent.value.trim(),
  };

  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));

  showNotification("บันทึกโน้ตเรียบร้อยแล้ว! 🎉");
  clearInputs();
  renderNotes();
}

// ฟังก์ชันแสดงโน้ตทั้งหมดในหน้า
function renderNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  noteList.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement("li");
    li.className = "note-item";
    li.style.backgroundColor = note.color;
    li.innerHTML = `
      <strong>${note.title}</strong> <br />
      <small>วันที่: ${note.date}</small>
      <p>${note.content}</p>
    `;
    noteList.appendChild(li);
  });
}

// ฟังก์ชันล้าง input หลังบันทึก
function clearInputs() {
  noteDate.value = "";
  noteColor.value = "#ffccf9";
  noteTitle.value = "";
  noteContent.value = "";
}

// ฟังก์ชันค้นหาโน้ต
function searchNotes() {
  const filter = searchInput.value.toLowerCase();
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  noteList.innerHTML = "";

  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(filter) ||
    note.content.toLowerCase().includes(filter)
  );

  filtered.forEach(note => {
    const li = document.createElement("li");
    li.className = "note-item";
    li.style.backgroundColor = note.color;
    li.innerHTML = `
      <strong>${note.title}</strong> <br />
      <small>วันที่: ${note.date}</small>
      <p>${note.content}</p>
    `;
    noteList.appendChild(li);
  });
}

saveNoteBtn.addEventListener("click", saveNote);
searchInput.addEventListener("input", searchNotes);

logoutLink.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut()
    .then(() => {
      showNotification("ออกจากระบบเรียบร้อย 🎉 กำลังกลับไปหน้าเข้าสู่ระบบ...");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    })
    .catch(err => {
      showNotification("เกิดข้อผิดพลาด: " + err.message);
      console.error(err);
    });
});
