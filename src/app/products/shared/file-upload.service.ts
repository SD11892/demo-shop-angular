import { Component, OnInit, Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FileUploadService {
  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Subject<Observable<number>> = new Subject();

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  constructor(private storage: AngularFireStorage) {}

  startUpload(data) {
    // The File object
    const file = data.files.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    // The storage path
    const path = `product-images/${new Date().getTime()}_${file.name}`;

    // The main task
    const task = this.storage.upload(path, file);

    this.percentage.next(task.percentageChanges());

    return task;
  }

  deleteFile(files) {
    if (files) {
      files.map((filePath) => {
        return this.storage.ref(filePath).delete();
      });
    }
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
