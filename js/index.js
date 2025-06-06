//Elementos

const notesContainer = document.querySelector("#notes-container");

const noteInput = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

const searchInput = document.querySelector("#search-input");

const exportBtn = document.querySelector("#export-notes");

const importButton = document.querySelector("#import-notes");

// Funções
function showNotes() {
  cleanNotes();
  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);
    notesContainer.appendChild(noteElement);
    })
}
function cleanNotes() {
  notesContainer.replaceChildren([]);
}

function addNote() {
  const notes = getNotes();
  const noteObject= {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteElement);
  
  console.log(noteObject);

  notes.push(noteObject);
  saveNotes(notes);
  noteInput.value = ""; // Limpa o campo de entrada após adicionar a nota
}

// LocalStorage
function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));
  return orderedNotes
}
function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function generateId(){
return Math.floor(Math.random() * 1000000);
}

function exportData() {
  const notes = getNotes();
  const csvString = [
    ["ID", "Conteúdo", "Fixada"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ]
  .map((e) => e.join(","))
  .join("\n");
  
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvString));
  element.target = "_blank";
  element.download = "notes.csv";
  element.click();
  console.log("Dados exportados com sucesso!");
}
// Função para criar um novo elemento de nota
function createNote(id, content, fixed) {
  const element = document.createElement("div");
  element.classList.add("note");
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.placeholder = "Adicione algum texto...";
  element.appendChild(textarea);
  const pinIcon = document.createElement("i");
  pinIcon.classList.add(...["bi", "bi-pin"]);
  element.appendChild(pinIcon);
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(...["bi", "bi-x-lg"]);
  element.appendChild(deleteIcon);
  const duplicateIcon = document.createElement("i");
  duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
  element.appendChild(duplicateIcon);
  if (fixed) {
    element.classList.add("fixed");
  }
  //Eventos do elemento
  element.querySelector("textarea").addEventListener("keyup", (e) => {

    const noteContent = e.target.value;
    updateNote(id, noteContent);
  
  })
  element.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id);
  });
  element.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id,element);
  });
  element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
    copyNote(id)
  });
  return element;
}
function toggleFixNote(id) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.fixed = !targetNote.fixed; // Alterna o estado de fixação
  saveNotes(notes);
  showNotes(); // Atualiza a exibição das notas
}
function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id !== id);
  saveNotes(notes);
  element.remove(); // Remove o elemento da nota do DOM
  showNotes(); // Atualiza a exibição das notas
  console.log(`Nota com ID ${id} deletada.`);
}
 function copyNote(id) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  const newNote = {
    id: generateId(),
    content: targetNote.content,
    fixed: false,
  };
  const noteElement = createNote(newNote.id, newNote.content);
  notesContainer.appendChild(noteElement);
  notes.push(newNote);
  saveNotes(notes);
  console.log(`Nota com ID ${id} copiada.`);
  showNotes(); // Atualiza a exibição das notas
 } 
 function updateNote(id, content) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.content = content; // Atualiza o conteúdo da nota
  saveNotes(notes);
  console.log(`Nota com ID ${id} atualizada.`);
 }
 function searchNotes(searchTerm) {
  const searchResults = getNotes().filter((note) =>  note.content.includes(searchTerm))
  if (searchTerm !== "") {
    cleanNotes();
    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });
    return
  }
  cleanNotes();
  showNotes(); // Se a busca estiver vazia, mostra todas as notas
}
//Eventos
addNoteBtn.addEventListener("click", () => addNote()) 
searchInput.addEventListener("keyup", (e) => {
  const searchTerm = e.target.value
  searchNotes(searchTerm);
})
 noteInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
 })
exportBtn.addEventListener("click", () => {
  exportData();
})
//Inicialização
showNotes();