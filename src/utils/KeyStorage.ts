import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeKey = async (key: string): Promise<void> => {
  try {
    const existingKeys = JSON.parse(
      (await AsyncStorage.getItem("@keys")) as string
    );
    const keys = existingKeys ? [...existingKeys, key] : [key];
    await AsyncStorage.setItem("@keys", JSON.stringify(keys));
    console.log("Key stored successfully");
  } catch (error) {
    console.error("Failed to save the key to AsyncStorage", error);
    throw error;
  }
};

export const eraseItems = async (): Promise<void> => {
  try {
    const keys: string[] = JSON.parse(
      (await AsyncStorage.getItem("@keys")) as string
    );
    if (keys && Array.isArray(keys)) {
      await Promise.all(
        keys.map(async (key) => {
          await AsyncStorage.removeItem(key);
          console.log("Item removed successfully for key: ", key);
        })
      );
    }
  } catch (error) {
    console.error("Failed to erase the items from AsyncStorage", error);
    throw error;
  }
};
