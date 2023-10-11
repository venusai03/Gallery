import {
    IonActionSheet,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader,
    IonIcon, IonImg,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Photos.styles.css';
import { camera, close, trash } from "ionicons/icons";
import { usePhotoGallery, UserPhoto } from "../hooks/usePhotoGallery";
import { useState } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const Photos: React.FC = () => {
    const { photos, takePhoto, deletePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();

    function handleFabButtonClick() {
        Haptics.impact({ style: ImpactStyle.Medium });
        takePhoto();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Photos</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        {photos.map((photo) => (
                            <IonCol size={"6"} key={photo.filePath}>
                                <IonImg src={photo.webviewPath} onClick={() => setPhotoToDelete(photo)} />
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                <IonFab vertical={"bottom"} horizontal={"center"} slot={"fixed"}>
                    <IonFabButton onClick={() => handleFabButtonClick()}>
                        <IonIcon icon={camera} />
                    </IonFabButton>
                </IonFab>

                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[
                        {
                            text: "Delete",
                            role: "destructive",
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            },
                        },
                        {
                            text: "Cancel",
                            role: "cancel",
                            icon: close,
                        },
                    ]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </IonContent>
        </IonPage>
    );
};

export default Photos;
