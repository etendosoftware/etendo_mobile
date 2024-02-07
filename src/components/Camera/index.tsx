import React from 'react';
import { Modal, View } from 'react-native';
import CameraBarCode from '../CameraBarCode';
import { Button as ButtonUI, CancelIcon } from 'etendo-ui-library';
import { styles } from './styles';
import locale from '../../i18n/locale';

interface CameraProps {
  show: boolean;
  setShow: (show: boolean) => void;
  handleReadCode: (code: string) => void;
}

const Camera: React.FC<CameraProps> = ({ show, setShow, handleReadCode }) => {
  return show ? (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View style={styles.frameProsessor}>
        <CameraBarCode ableToRead={show} handleReadCode={handleReadCode} />
      </View>
      <View style={[styles.buttonContainer, styles.buttonPosition]}>
        <ButtonUI
          width={130}
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
