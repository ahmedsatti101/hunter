import React, {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '~/lib/constants';
import ModalComponent from '~/components/Modal';

const ImageContext = createContext({ showImage: (imageUri: string) => { } });

export default function ImageProvider({ children }: { children: ReactNode }) {
  const imageRef = useRef(null);

  const showImage = (imageUri: any) => {
    imageRef.current?.show(imageUri);
  };

  return (
    <ImageContext.Provider value={{ showImage }}>
      {children}
      <ImageView ref={imageRef} />
    </ImageContext.Provider>
  );
}

const ImageView = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const imageUriRef = useRef('');
  const [modal, setModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalBody, setModalBody] = useState<string>("");

  useImperativeHandle(ref, () => ({
    hide: () => {
      imageUriRef.current = '';
      setShow(false);
    },
    show: (uri = '') => {
      imageUriRef.current = uri;
      setShow(true);
    },
  }));

  if (!show) return null;

  const hide = () => {
    setShow(false);
    imageUriRef.current = '';
  };

  const deleteImage = async () => {
    await axios.delete(`${API_URL}/screenshot`,
      {
        data:
        {
          key: imageUriRef.current.slice(imageUriRef.current.indexOf("users"), imageUriRef.current.indexOf("?"))
        }
      }).then((res) => {
        if (res.status === 204) {
          setModal(true);
          setModalTitle("Success");
          setModalBody("Screenshot removed");
        }
      }).catch((e) => {
        setModal(true);
        setModalTitle("Error");
        setModalBody(e);
      })
  }

  return (
    <>
      <View style={styles.overlayContainer}>
        <View style={styles.overlayBackground} />
        <View style={styles.overlayContent}>
          <AntDesign name="close" size={24} color="white" onPress={hide} style={styles.closeButton} />
          <AntDesign name="delete" size={24} color="white" onPress={deleteImage} style={styles.deleteButton} />
          <Zoomable isDoubleTapEnabled>
            <Image
              source={{ uri: imageUriRef.current }}
              contentFit="contain"
              style={styles.fullScreenImage}
            />
          </Zoomable>
        </View>
      </View>
      <ModalComponent open={modal} close={() => setModal(false)} title={modalTitle} body={modalBody} />
    </>
  );
});

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000000,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(90, 90, 90, 0.95)',
  },
  overlayContent: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 10,
    padding: 5,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    zIndex: 100001,
  },
  deleteButton: {
    position: 'absolute',
    top: 60,
    left: 10,
    padding: 5,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    zIndex: 100001,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export function useImage() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
}
