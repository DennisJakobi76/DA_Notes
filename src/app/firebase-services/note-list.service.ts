import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection, doc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  items$;

  unsubList;
  unsubSingle;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.items$ = collectionData(this.getNotesRef());

    this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach((element) => {
        console.log(element.data());
      });
    });

    this.unsubSingle = onSnapshot(
      this.getSingleDocRef('notes', 'QkKSn3F7H8F79o4NSq2s'),
      (element) => {
        console.log(element);
      }
    );

    this.unsubSingle();
    this.unsubList();
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
}
