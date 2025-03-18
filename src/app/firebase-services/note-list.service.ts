import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  Firestore,
  collectionData,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection, doc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  // items$;

  unsubTrash;
  unsubNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    // this.items$ = collectionData(this.getNotesRef());

    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  ngOnDestroy() {
    this.unsubTrash();
    this.unsubNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    colId === 'notes' ? (item.type = 'note') : (item.type = 'trash');
    if (item.type === 'note') {
      await addDoc(this.getNotesRef(), this.getCleanJson(item)).catch((err) => {
        console.log(err);
      });
    } else {
      await addDoc(this.getTrashRef(), this.getCleanJson(item)).catch((err) => {
        console.log(err);
      });
    }
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {
        console.log(err);
      });
    }
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    if (docId) {
      await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
        console.log(err);
      });
    }
  }

  getCleanJson(note: Note) {
    return {
      title: note.title,
      content: note.content,
      type: note.type,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note) {
    return note.type === 'note' ? 'notes' : 'trash';
  }
}
