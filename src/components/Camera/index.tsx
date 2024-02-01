import React from 'react';
import { Modal, View } from 'react-native';
import CameraBarCode from '../CameraBarCode';
import { Button as ButtonUI, CancelIcon } from 'etendo-ui-library';
import { styles } from './styles';
import locale from '../../i18n/locale';
import { isTablet } from '../../helpers/IsTablet';

interface CameraProps {
  show: boolean;
  setShow: (show: boolean) => void;
  handleReadCode: (code: string) => void;
}

const Camera: React.FC<CameraProps> = ({ show, setShow, handleReadCode }) => {
  return show ? (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'transparent',
          zIndex: -1,
          position: 'relative',
        }}
      >
        <CameraBarCode ableToRead={show} handleReadCode={handleReadCode} />
      </View>
      <View
        style={[
          styles.buttonContainer,
          {
            position: 'absolute',
            bottom: 30,
            width: isTablet ? '20%' : '60%',
            height: '100%',
            justifyContent: 'flex-end',
            alignSelf: 'center',
          },
        ]}
      >
        <ButtonUI
          width="100%"
          height={50}
          typeStyle="primary"
          onPress={() => {
            setShow(false);
          }}
          text={locale.t('Common.cancel')}
          iconLeft={<CancelIcon style={styles.icon} />}
        />
      </View>
    </Modal>
  ) : (
    <></>
  );
};

export default Camera;
