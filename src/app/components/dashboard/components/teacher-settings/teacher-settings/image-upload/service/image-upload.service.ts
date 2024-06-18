import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { uploadBytes } from '@firebase/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {

    constructor(private storage: Storage) { }

    async uploadImage(file: File): Promise<string> {
        const storageRef = ref(this.storage, `images/${Date.now()}_${file.name}`);

        await uploadBytes(storageRef, file);

        return await getDownloadURL(storageRef);
    }

}
