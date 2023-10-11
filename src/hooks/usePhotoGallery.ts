import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { isPlatform } from "@ionic/react";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";

export interface UserPhoto {
    filePath: string;
    webviewPath?: string;
}

const PHOTO_STORAGE = "PHOTOS";

export function usePhotoGallery() {
    useEffect(() => {
        const loadSaved = async () => {
            const { value } = await Preferences.get({ key: PHOTO_STORAGE });
            const photosInPreference = (value ? JSON.parse(value) : []) as UserPhoto[];

            if (!isPlatform("hybrid")) {
                for (let photo of photosInPreference) {
                    const file = await Filesystem.readFile({
                        path: photo.filePath,
                        directory: Directory.Data,
                    });

                    photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
                }
            }

            setPhotos(photosInPreference);
        };

        loadSaved();
    }, []);

    const [photos, setPhotos] = useState<UserPhoto[]>([]);

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = Date.now() + ".jpeg";
        const savedFileImage = await savePicture(photo, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);

        Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    };

    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        let base64Data: string | Blob;

        if (isPlatform("hybrid")) {
            const file = await Filesystem.readFile({
                path: photo.path!,
            });

            base64Data = file.data;
        } else {
            base64Data = await base64FromPath(photo.webPath!);
        }

        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        if (isPlatform("hybrid")) {
            return {
                filePath: savedFile.uri,
                webviewPath: photo.webPath,
            };
        } else {
            return {
                filePath: fileName,
                webviewPath: photo.webPath,
            };
        }
    };

    const deletePhoto = async (photo: UserPhoto) => {
        const newPhotos = photos.filter((p) => p.filePath !== photo.filePath);

        Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });

        const fileName = photo.filePath.substring(photo.filePath.lastIndexOf("/") + 1);
        await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Data,
        });

        setPhotos(newPhotos);
    };

    return { photos, takePhoto, deletePhoto };
}

export async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject("method did not return a string");
            }
        };

        reader.readAsDataURL(blob);
    });
}