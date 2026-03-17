/**
 * ComponentTestScreen
 *
 * Visual test for all etendo-ui-library components.
 * Enable via SHOW_COMPONENT_TEST flag in App.tsx.
 */
import React, { useCallback, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  Alert,
  Button,
  Cards,
  DatePickerInput,
  DropdownInput,
  Modal,
  Pagination,
  PasswordInput,
  // @ts-ignore — index.d.ts has typo 'SeachInput' but runtime JS exports 'SearchInput'
  SearchInput as SeachInput,
  SkeletonItem,
  Tab,
  TextInput as EtendoTextInput,
  show,
  // Icons sample
  HomeIcon,
  SearchIcon,
  UserIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  StarIcon,
  EditIcon,
  TrashIcon,
} from 'etendo-ui-library';

// ─── helpers ────────────────────────────────────────────────────────────────

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

// ─── screen ─────────────────────────────────────────────────────────────────

const ComponentTestScreen = () => {
  const [textValue, setTextValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const renderCameraContent = () => {
    if (!hasPermission) {
      return (
        <Button
          typeStyle="primary"
          text="Request Camera Permission"
          onPress={requestPermission}
        />
      );
    }
    if (!device) {
      return <Text style={styles.hint}>No camera device found</Text>;
    }
    if (!cameraActive) {
      return (
        <Button
          typeStyle="primary"
          text="Open Camera"
          onPress={() => setCameraActive(true)}
        />
      );
    }
    return (
      <View>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={cameraActive}
          photo
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.captureBtn} onPress={takePhoto} />
          <Button
            typeStyle="secondary"
            text="Close"
            onPress={() => setCameraActive(false)}
          />
        </View>
        {!!lastPhoto && (
          <Text style={styles.hint}>Last photo: {lastPhoto}</Text>
        )}
      </View>
    );
  };

  const takePhoto = useCallback(async () => {
    try {
      const photo = await cameraRef.current?.takePhoto();
      if (photo) {
        setLastPhoto(photo.path);
        show('Photo taken!', 'success');
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to take photo';
      show(message, 'error');
    }
  }, []);

  const dropdownOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
    { label: 'Option D', value: 'd' },
  ];

  const tabData = [
    { name: 'Home', route: 'home' },
    { name: 'Search', route: 'search' },
    { name: 'Profile', route: 'profile' },
  ];

  const cardsMetadata = [
    { key: 'name', label: 'Name', isTitle: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
  ];

  const cardsData = [
    { name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>etendo-ui-library — Component Test</Text>

        {/* ── BUTTONS ─────────────────────────────────────────────────────── */}
        <Section title="Button">
          <Button typeStyle="primary" text="Primary" onPress={() => {}} />
          <Button typeStyle="secondary" text="Secondary" onPress={() => {}} />
          <Button typeStyle="terciary" text="Terciary" onPress={() => {}} />
          <Button
            typeStyle="whiteBorder"
            text="White Border"
            onPress={() => {}}
          />
          <Button typeStyle="primary" text="Disabled" disabled />
          <Button typeStyle="primary" text="Loading" loading />
        </Section>

        {/* ── ICONS ───────────────────────────────────────────────────────── */}
        <Section title="Icons (sample)">
          <View style={styles.row}>
            <HomeIcon />
            <SearchIcon />
            <UserIcon />
            <CheckCircleIcon />
            <AlertTriangleIcon />
            <StarIcon />
            <EditIcon />
            <TrashIcon />
          </View>
        </Section>

        {/* ── TEXT INPUT ──────────────────────────────────────────────────── */}
        <Section title="TextInput">
          <EtendoTextInput
            title="Name"
            placeholder="Enter name..."
            value={textValue}
            onChangeText={setTextValue}
          />
          <EtendoTextInput
            title="Error state"
            placeholder="Required field"
            isError
            helperText="This field is required"
          />
          <EtendoTextInput
            title="Disabled"
            placeholder="Disabled input"
            isDisabled
            value="Cannot edit this"
          />
          <EtendoTextInput
            title="Multiline"
            placeholder="Enter notes..."
            multiline
            numberOfLines={3}
          />
        </Section>

        {/* ── PASSWORD INPUT ──────────────────────────────────────────────── */}
        <Section title="PasswordInput">
          <PasswordInput
            title="Password"
            placeholder="Enter password..."
            value={passwordValue}
            onChangeText={setPasswordValue}
          />
        </Section>

        {/* ── DROPDOWN INPUT ──────────────────────────────────────────────── */}
        <Section title="DropdownInput">
          <DropdownInput
            title="Select option"
            placeholder="Choose..."
            value={dropdownValue}
            staticData={dropdownOptions}
            displayKey="label"
            onSelect={option => setDropdownValue(option.label)}
          />
        </Section>

        {/* ── SEARCH INPUT ────────────────────────────────────────────────── */}
        <Section title="SeachInput (SearchInput)">
          <SeachInput title="Search" placeholder="Search something..." />
        </Section>

        {/* ── DATE PICKER ─────────────────────────────────────────────────── */}
        <Section title="DatePickerInput">
          <DatePickerInput
            title="Date"
            placeholder="Select a date..."
            language={'en-US'}
            dateFormat={'DD/MM/YYYY'}
          />
        </Section>

        {/* ── TAB ─────────────────────────────────────────────────────────── */}
        <Section title="Tab — primary">
          <Tab
            typeStyle="primary"
            data={tabData}
            currentIndex={tabIndex}
            onPressTab={(_, index) => setTabIndex(index)}
          />
        </Section>

        <Section title="Tab — secondary">
          <Tab
            typeStyle="secondary"
            data={tabData}
            currentIndex={tabIndex}
            onPressTab={(_, index) => setTabIndex(index)}
          />
        </Section>

        <Section title="Tab — terciary">
          <Tab
            typeStyle="terciary"
            data={tabData}
            currentIndex={tabIndex}
            onPressTab={(_, index) => setTabIndex(index)}
          />
        </Section>

        {/* ── SKELETON ────────────────────────────────────────────────────── */}
        <Section title="SkeletonItem">
          <SkeletonItem width={0} height={0} />
          <SkeletonItem width={0} height={0} />
        </Section>

        {/* ── ALERT ───────────────────────────────────────────────────────── */}
        <Section title="Alert (show)">
          <Button
            typeStyle="primary"
            text="Success alert"
            onPress={() => show('Operation successful!', 'success')}
          />
          <Button
            typeStyle="secondary"
            text="Error alert"
            onPress={() => show('Something went wrong', 'error')}
          />
          <Button
            typeStyle="terciary"
            text="Warning alert"
            onPress={() => show('Check your data', 'warning')}
          />
          <Button
            typeStyle="whiteBorder"
            text="Info alert"
            onPress={() => show('Here is some info', 'info')}
          />
        </Section>

        {/* ── MODAL ───────────────────────────────────────────────────────── */}
        <Section title="Modal">
          <Button
            typeStyle="primary"
            text="Open Modal"
            onPress={() => setModalVisible(true)}
          />
          <Modal
            title="Test Modal"
            subtitle="This is a test modal from etendo-ui-library"
            labelCloseButton="Close"
            labelActionButton="Confirm"
            visible={modalVisible}
            showModal={() => setModalVisible(false)}
            handleAction={() => {
              show('Modal action confirmed!', 'success');
              setModalVisible(false);
            }}
          />
        </Section>

        {/* ── PAGINATION ──────────────────────────────────────────────────── */}
        <Section title="Pagination">
          <Text style={styles.hint}>Page: {currentPage} / 10</Text>
          <Pagination
            currentPage={currentPage}
            totalData={100}
            amountDataPerPage={10}
            onChangeSelected={page => setCurrentPage(page)}
          />
        </Section>

        {/* ── CARDS ───────────────────────────────────────────────────────── */}
        <Section title="Cards">
          <Cards title="Users" metadata={cardsMetadata} data={cardsData} />
        </Section>

        {/* ── CAMERA ──────────────────────────────────────────────────────── */}
        <Section title="Camera (react-native-vision-camera)">
          {renderCameraContent()}
        </Section>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Alert singleton — must live at root level */}
      <Alert />
    </SafeAreaView>
  );
};

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a2e',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  sectionContent: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 40,
  },
  camera: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#1a1a2e',
  },
});

export default ComponentTestScreen;
